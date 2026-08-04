import { describe, expect, it } from "vitest";
import { calculateEstimation } from "../calculator";
import {
  BUSINESS_CONFLICT_RULES,
  EXPLICIT_ALLOWED_CUMULATIONS,
  INCLUSION_RULES,
  MUTUALLY_EXCLUSIVE_GROUPS,
  normalizeCompatibleSelection,
  REPLACEMENT_RULES,
} from "../compatibility";
import { CalculatorInputSchema } from "../schema";
import type {
  CalculatorInput,
  MultiplierId,
  Sector,
  SectorModuleId,
  SiteTypeId,
} from "../types";

const baseInput: CalculatorInput = {
  sector: "PME",
  siteType: "S01",
  selectedMultipliers: [],
  selectedSectorModules: [],
  languageMode: "single",
  isUrgent: false,
};

function sectorForModule(id: string): Sector {
  if (id.startsWith("JUR")) return "JUR";
  if (id.startsWith("MED")) return "MED";
  if (id.startsWith("PRO")) return "PRO";
  return "PME";
}

function inputForPair(sourceId: string, targetId: string): CalculatorInput {
  const ids = [sourceId, targetId];
  const moduleIds = ids.filter((id) => /^(JUR|MED|PRO|PME)\d{2}$/.test(id));
  const sector = moduleIds.length > 0 ? sectorForModule(moduleIds[0]) : "PME";
  const explicitSiteType = ids.find((id) => /^S0[1-6]$/.test(id));
  return {
    sector,
    siteType: (explicitSiteType ?? "S01") as SiteTypeId,
    selectedMultipliers: ids.filter((id) => /^M(0[3-9]|1[0-2])$/.test(id)) as MultiplierId[],
    selectedSectorModules: moduleIds as SectorModuleId[],
    languageMode: "single",
    isUrgent: false,
  };
}

function expectReferencePresent(result: ReturnType<typeof calculateEstimation>, id: string) {
  if (/^S0[1-6]$/.test(id)) {
    expect(result.inputs.siteType).toBe(id);
  } else if (/^M(0[3-9]|1[0-2])$/.test(id)) {
    expect(result.inputs.multipliers).toContain(id);
  } else {
    expect(result.inputs.sectorModules).toContain(id);
  }
}

describe("executable option compatibility registry", () => {
  it("defines every required relation class", () => {
    expect(MUTUALLY_EXCLUSIVE_GROUPS).toHaveLength(3);
    expect(REPLACEMENT_RULES).toHaveLength(7);
    expect(INCLUSION_RULES).toHaveLength(7);
    expect(EXPLICIT_ALLOWED_CUMULATIONS).toHaveLength(17);
    expect(BUSINESS_CONFLICT_RULES).toHaveLength(2);
  });

  it.each(REPLACEMENT_RULES)("normalizes replacement $id before calculation", (rule) => {
    const redundant = inputForPair(rule.source.id, rule.target.id);
    const normalized = calculateEstimation(redundant);
    const specializedOnly = calculateEstimation({
      ...redundant,
      selectedMultipliers: redundant.selectedMultipliers.filter((id) => id !== rule.target.id),
    });

    expect(normalized.inputs.multipliers).not.toContain(rule.target.id);
    expectReferencePresent(normalized, rule.source.id);
    expect(normalized).toEqual(specializedOnly);
  });

  it.each(INCLUSION_RULES)("normalizes inclusion $id before calculation", (rule) => {
    const redundant = inputForPair(rule.source.id, rule.target.id);
    const normalized = calculateEstimation(redundant);
    const includedOnly = calculateEstimation({
      ...redundant,
      selectedMultipliers: redundant.selectedMultipliers.filter((id) => id !== rule.target.id),
      selectedSectorModules: redundant.selectedSectorModules.filter((id) => id !== rule.target.id),
    });

    if (rule.target.kind === "multiplier") {
      expect(normalized.inputs.multipliers).not.toContain(rule.target.id);
    } else {
      expect(normalized.inputs.sectorModules).not.toContain(rule.target.id);
    }
    expectReferencePresent(normalized, rule.source.id);
    expect(normalized).toEqual(includedOnly);
  });

  it.each(EXPLICIT_ALLOWED_CUMULATIONS)("keeps authorized cumulative work $id", ({ options: [first, second] }) => {
    const result = calculateEstimation(inputForPair(first, second));
    expectReferencePresent(result, first);
    expectReferencePresent(result, second);
  });

  it.each([
    { group: "sector", input: { ...baseInput, sector: ["PME", "MED"] } },
    { group: "site-type", input: { ...baseInput, siteType: ["S01", "S02"] } },
    { group: "language-mode", input: { ...baseInput, languageMode: ["single", "bilingual"] } },
  ])("rejects a multiple value for the mutually exclusive $group group", ({ input }) => {
    expect(() => CalculatorInputSchema.parse(input)).toThrow();
  });

  it("rejects the legacy bilingual plus multilingual direct-call shape", () => {
    const legacy = {
      ...baseInput,
      isBilingual: true,
      isMultilingual: true,
    };
    delete (legacy as Partial<CalculatorInput>).languageMode;
    expect(() => calculateEstimation(legacy as unknown as CalculatorInput)).toThrow();
  });

  it("rejects every registered business conflict", () => {
    expect(BUSINESS_CONFLICT_RULES.map((rule) => rule.id)).toEqual([
      "sector-site-type",
      "sector-module-ownership",
    ]);
    expect(() => calculateEstimation({ ...baseInput, sector: "JUR", siteType: "S03" })).toThrow();
    expect(() => calculateEstimation({ ...baseInput, selectedSectorModules: ["JUR01"] })).toThrow();
  });

  it("returns a deterministic canonical selection order", () => {
    const normalized = normalizeCompatibleSelection({
      sector: "PME",
      siteType: "S01",
      selectedMultipliers: ["M12", "M03", "M05"],
      selectedSectorModules: ["PME07", "PME02", "PME03"],
    });
    expect(normalized.selectedMultipliers).toEqual(["M03", "M05", "M12"]);
    expect(normalized.selectedSectorModules).toEqual(["PME02", "PME03", "PME07"]);
  });

  it("removes an old redundant commerce payment without changing the commerce base", () => {
    const result = calculateEstimation({
      ...baseInput,
      siteType: "S03",
      selectedMultipliers: ["M03", "M11"],
      selectedSectorModules: ["PME03"],
      languageMode: "bilingual",
    });
    expect(result.inputs.multipliers).toEqual(["M03"]);
    expect(result.eco.baseCost).toBe(8_000);
    expect(result.eco.initialTotal).toBe(15_755);
  });
});
