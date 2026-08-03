import { describe, expect, it } from "vitest";
import { calculateEstimation } from "../calculator";
import { CalculatorInputSchema } from "../schema";
import { ADDITIVE_IDS, SECTOR_MODULES, SOCLE_ITEMS } from "../matrix";
import type {
  CalculatorInput,
  ScenarioBreakdown,
  Sector,
  SiteTypeId,
} from "../types";

const controlledScenarios: Array<{
  name: string;
  input: CalculatorInput;
  expected: Record<"eco" | "rec" | "premium", ScenarioBreakdown>;
}> = [
  {
    name: "small showcase site",
    input: {
      sector: "PME",
      siteType: "S01",
      selectedMultipliers: [],
      selectedSectorModules: [],
      isBilingual: false,
      isMultilingual: false,
      isUrgent: false,
    },
    expected: {
      eco: { baseCost: 2500, multipliersCost: 0, sectorModulesCost: 0, contingency: 375, initialTotal: 2875, maintenanceMonthly: 75, thirdPartyMonthly: 16, monthlyTotal: 91, year1Total: 3967, annualRecurring: 1092 },
      rec: { baseCost: 4250, multipliersCost: 0, sectorModulesCost: 0, contingency: 638, initialTotal: 4888, maintenanceMonthly: 250, thirdPartyMonthly: 98, monthlyTotal: 348, year1Total: 9064, annualRecurring: 4176 },
      premium: { baseCost: 6000, multipliersCost: 0, sectorModulesCost: 0, contingency: 900, initialTotal: 6900, maintenanceMonthly: 750, thirdPartyMonthly: 179, monthlyTotal: 929, year1Total: 18048, annualRecurring: 11148 },
    },
  },
  {
    name: "bilingual showcase site",
    input: {
      sector: "JUR",
      siteType: "S02",
      selectedMultipliers: [],
      selectedSectorModules: [],
      isBilingual: true,
      isMultilingual: false,
      isUrgent: false,
    },
    expected: {
      eco: { baseCost: 5000, multipliersCost: 2000, sectorModulesCost: 0, contingency: 1050, initialTotal: 8050, maintenanceMonthly: 75, thirdPartyMonthly: 16, monthlyTotal: 91, year1Total: 9142, annualRecurring: 1092 },
      rec: { baseCost: 10000, multipliersCost: 5000, sectorModulesCost: 0, contingency: 2250, initialTotal: 17250, maintenanceMonthly: 250, thirdPartyMonthly: 98, monthlyTotal: 348, year1Total: 21426, annualRecurring: 4176 },
      premium: { baseCost: 15000, multipliersCost: 9000, sectorModulesCost: 0, contingency: 3600, initialTotal: 27600, maintenanceMonthly: 750, thirdPartyMonthly: 179, monthlyTotal: 929, year1Total: 38748, annualRecurring: 11148 },
    },
  },
  {
    name: "basic e-commerce with booking, payment and local search",
    input: {
      sector: "PME",
      siteType: "S03",
      selectedMultipliers: ["M03", "M11"],
      selectedSectorModules: ["PME03"],
      isBilingual: true,
      isMultilingual: false,
      isUrgent: false,
    },
    expected: {
      eco: { baseCost: 8000, multipliersCost: 5700, sectorModulesCost: 500, contingency: 2130, initialTotal: 16330, maintenanceMonthly: 75, thirdPartyMonthly: 16, monthlyTotal: 91, year1Total: 17422, annualRecurring: 1092 },
      rec: { baseCost: 16500, multipliersCost: 14500, sectorModulesCost: 1000, contingency: 4800, initialTotal: 36800, maintenanceMonthly: 250, thirdPartyMonthly: 98, monthlyTotal: 348, year1Total: 40976, annualRecurring: 4176 },
      premium: { baseCost: 25000, multipliersCost: 25000, sectorModulesCost: 1500, contingency: 7725, initialTotal: 59225, maintenanceMonthly: 750, thirdPartyMonthly: 179, monthlyTotal: 929, year1Total: 70373, annualRecurring: 11148 },
    },
  },
  {
    name: "custom application with portal, CRM and business integration",
    input: {
      sector: "PRO",
      siteType: "S05",
      selectedMultipliers: ["M04", "M05"],
      selectedSectorModules: ["PRO03"],
      isBilingual: false,
      isMultilingual: false,
      isUrgent: false,
    },
    expected: {
      eco: { baseCost: 25000, multipliersCost: 4500, sectorModulesCost: 2000, contingency: 4725, initialTotal: 36225, maintenanceMonthly: 75, thirdPartyMonthly: 16, monthlyTotal: 91, year1Total: 37317, annualRecurring: 1092 },
      rec: { baseCost: 52500, multipliersCost: 12250, sectorModulesCost: 6000, contingency: 10613, initialTotal: 81363, maintenanceMonthly: 250, thirdPartyMonthly: 98, monthlyTotal: 348, year1Total: 85539, annualRecurring: 4176 },
      premium: { baseCost: 80000, multipliersCost: 20000, sectorModulesCost: 10000, contingency: 16500, initialTotal: 126500, maintenanceMonthly: 750, thirdPartyMonthly: 179, monthlyTotal: 929, year1Total: 137648, annualRecurring: 11148 },
    },
  },
  {
    name: "maximum selectable medical project",
    input: {
      sector: "MED",
      siteType: "S05",
      selectedMultipliers: [...ADDITIVE_IDS],
      selectedSectorModules: SECTOR_MODULES.MED.map((item) => item.id),
      isBilingual: true,
      isMultilingual: true,
      isUrgent: true,
    },
    expected: {
      eco: { baseCost: 25000, multipliersCost: 71900, sectorModulesCost: 18000, contingency: 17235, initialTotal: 132135, maintenanceMonthly: 75, thirdPartyMonthly: 16, monthlyTotal: 91, year1Total: 133227, annualRecurring: 1092 },
      rec: { baseCost: 52500, multipliersCost: 206500, sectorModulesCost: 38000, contingency: 44550, initialTotal: 341550, maintenanceMonthly: 250, thirdPartyMonthly: 98, monthlyTotal: 348, year1Total: 345726, annualRecurring: 4176 },
      premium: { baseCost: 80000, multipliersCost: 404400, sectorModulesCost: 58000, contingency: 81360, initialTotal: 623760, maintenanceMonthly: 750, thirdPartyMonthly: 179, monthlyTotal: 929, year1Total: 634908, annualRecurring: 11148 },
    },
  },
];

describe("controlled calculation truth table", () => {
  it.each(controlledScenarios)("matches independent totals: $name", ({ input, expected }) => {
    const observed = calculateEstimation(input);
    expect(observed.eco).toEqual(expected.eco);
    expect(observed.rec).toEqual(expected.rec);
    expect(observed.premium).toEqual(expected.premium);
  });

  it("never returns negative, non-finite or internally inconsistent values", () => {
    const sectors = Object.keys(SECTOR_MODULES) as Sector[];
    const siteTypes = Object.keys(SOCLE_ITEMS) as SiteTypeId[];
    for (const sector of sectors) {
      for (const siteType of siteTypes) {
        const result = calculateEstimation({
          sector,
          siteType,
          selectedMultipliers: [...ADDITIVE_IDS],
          selectedSectorModules: SECTOR_MODULES[sector].map((item) => item.id),
          isBilingual: true,
          isMultilingual: true,
          isUrgent: true,
        });
        for (const scenario of [result.eco, result.rec, result.premium]) {
          for (const amount of Object.values(scenario)) {
            expect(Number.isFinite(amount)).toBe(true);
            expect(amount).toBeGreaterThanOrEqual(0);
          }
          expect(scenario.year1Total).toBe(scenario.initialTotal + scenario.annualRecurring);
          expect(scenario.annualRecurring).toBe(scenario.monthlyTotal * 12);
          expect(scenario.monthlyTotal).toBe(scenario.maintenanceMonthly + scenario.thirdPartyMonthly);
        }
      }
    }
  });
});

describe("calculator input validation", () => {
  const valid: CalculatorInput = controlledScenarios[0].input;

  it("accepts a valid strict input", () => {
    expect(CalculatorInputSchema.parse(valid)).toEqual(valid);
  });

  it.each([
    { ...valid, selectedMultipliers: ["M03", "M03"] },
    { ...valid, selectedSectorModules: ["JUR01"] },
    { ...valid, sector: "OTHER" },
    { ...valid, selectedMultipliers: ["M01"] },
    { ...valid, unexpected: true },
  ])("rejects invalid or incoherent inputs", (input) => {
    expect(() => CalculatorInputSchema.parse(input)).toThrow();
    expect(() => calculateEstimation(input as CalculatorInput)).toThrow();
  });
});
