import { z } from "zod";
import { SECTOR_MODULES } from "./matrix";
import {
  isSiteTypeAllowed,
  LANGUAGE_MODES,
  normalizeCompatibleSelection,
} from "./compatibility";

const sectorSchema = z.enum(["JUR", "MED", "PRO", "PME"]);
const siteTypeSchema = z.enum(["S01", "S02", "S03", "S04", "S05", "S06"]);
const additiveMultiplierSchema = z.enum([
  "M03",
  "M04",
  "M05",
  "M06",
  "M07",
  "M08",
  "M09",
  "M10",
  "M11",
  "M12",
]);
const sectorModuleSchema = z.enum([
  "JUR01",
  "JUR02",
  "JUR03",
  "JUR04",
  "JUR05",
  "JUR06",
  "MED01",
  "MED02",
  "MED03",
  "MED04",
  "MED05",
  "MED06",
  "PRO01",
  "PRO02",
  "PRO03",
  "PRO04",
  "PRO05",
  "PME01",
  "PME02",
  "PME03",
  "PME04",
  "PME05",
  "PME06",
  "PME07",
]);

const optionStateSchema = z.enum(["neuf", "rhabille", "existant"]);
const blocCountSchema = z.number().int().nonnegative();

/** Champs exigés par le mode refonte, interdits en construction neuve. */
const REFONTE_ONLY_FIELDS = [
  "codeAuthor",
  "blocsNeufs",
  "blocsRhabilles",
  "blocsConserves",
  "optionStates",
] as const;

function hasDuplicates(values: readonly string[]): boolean {
  return new Set(values).size !== values.length;
}

export const CalculatorInputSchema = z
  .object({
    sector: sectorSchema,
    siteType: siteTypeSchema,
    selectedMultipliers: z.array(additiveMultiplierSchema),
    selectedSectorModules: z.array(sectorModuleSchema),
    languageMode: z.enum(LANGUAGE_MODES),
    isUrgent: z.boolean(),
    // Absent équivaut à `neuf` : une entrée écrite avant le mode refonte reste
    // valide et produit exactement le même résultat qu'auparavant.
    projectNature: z.enum(["neuf", "refonte"]).default("neuf"),
    codeAuthor: z.enum(["nous", "tiers"]).optional(),
    blocsNeufs: blocCountSchema.optional(),
    blocsRhabilles: blocCountSchema.optional(),
    blocsConserves: blocCountSchema.optional(),
    optionStates: z
      .record(
        z.union([additiveMultiplierSchema, sectorModuleSchema]),
        optionStateSchema
      )
      .optional(),
  })
  .strict()
  .superRefine((input, context) => {
    if (!isSiteTypeAllowed(input.sector, input.siteType)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["siteType"],
        message: `${input.siteType} is not available for sector ${input.sector}`,
      });
    }

    if (hasDuplicates(input.selectedMultipliers)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selectedMultipliers"],
        message: "Duplicate feature IDs are not allowed",
      });
    }

    if (hasDuplicates(input.selectedSectorModules)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selectedSectorModules"],
        message: "Duplicate sector module IDs are not allowed",
      });
    }

    const allowedModules = new Set(
      SECTOR_MODULES[input.sector].map((module) => module.id)
    );
    for (const moduleId of input.selectedSectorModules) {
      if (!allowedModules.has(moduleId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["selectedSectorModules"],
          message: `${moduleId} does not belong to sector ${input.sector}`,
        });
      }
    }

    if (input.projectNature === "refonte") {
      for (const field of REFONTE_ONLY_FIELDS) {
        // `optionStates` reste facultatif : une refonte peut ne rhabiller aucune
        // option et tout reconstruire à neuf.
        if (field === "optionStates") continue;
        if (input[field] === undefined) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `${field} is required when projectNature is "refonte"`,
          });
        }
      }

      const totalBlocs =
        (input.blocsNeufs ?? 0) +
        (input.blocsRhabilles ?? 0) +
        (input.blocsConserves ?? 0);
      if (totalBlocs === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["blocsNeufs"],
          message: "A refonte must describe at least one block",
        });
      }

      // Un état ne peut porter que sur une option réellement sélectionnée.
      const selected = new Set<string>([
        ...input.selectedMultipliers,
        ...input.selectedSectorModules,
      ]);
      for (const optionId of Object.keys(input.optionStates ?? {})) {
        if (!selected.has(optionId)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["optionStates"],
            message: `${optionId} carries a state but is not selected`,
          });
        }
      }
    } else {
      for (const field of REFONTE_ONLY_FIELDS) {
        if (input[field] !== undefined) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `${field} is only allowed when projectNature is "refonte"`,
          });
        }
      }
    }
  })
  .transform((input) => normalizeCompatibleSelection(input))
  .transform((input) => {
    // Une option retirée par la normalisation ne doit pas laisser d'état orphelin
    // derrière elle : le résultat ne décrirait plus la sélection réellement facturée.
    if (input.projectNature !== "refonte" || !input.optionStates) return input;
    const billed = new Set<string>([
      ...input.selectedMultipliers,
      ...input.selectedSectorModules,
    ]);
    const optionStates = Object.fromEntries(
      Object.entries(input.optionStates).filter(([id]) => billed.has(id))
    );
    return { ...input, optionStates };
  });
