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
  })
  .transform((input) => normalizeCompatibleSelection(input));
