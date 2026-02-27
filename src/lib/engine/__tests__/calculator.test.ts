import { describe, it, expect } from "vitest";
import { calculateEstimation } from "../calculator";
import { lerp } from "../../utils";

describe("lerp", () => {
  it("returns min at t=0", () => {
    expect(lerp(100, 200, 0)).toBe(100);
  });

  it("returns max at t=1", () => {
    expect(lerp(100, 200, 1)).toBe(200);
  });

  it("returns midpoint at t=0.5", () => {
    expect(lerp(100, 200, 0.5)).toBe(150);
  });
});

describe("calculateEstimation", () => {
  const baseInput = {
    sector: "PME" as const,
    siteType: "S01" as const,
    selectedMultipliers: [],
    selectedSectorModules: [],
    isBilingual: false,
    isMultilingual: false,
    isUrgent: false,
  };

  it("returns 3 scenarios with correct structure", () => {
    const result = calculateEstimation(baseInput);
    expect(result.eco).toBeDefined();
    expect(result.rec).toBeDefined();
    expect(result.premium).toBeDefined();
    expect(result.inputs.sector).toBe("PME");
  });

  it("eco <= rec <= premium for all cost fields", () => {
    const result = calculateEstimation(baseInput);
    const fields = [
      "baseCost",
      "initialTotal",
      "monthlyTotal",
      "year1Total",
    ] as const;

    for (const field of fields) {
      expect(result.eco[field]).toBeLessThanOrEqual(result.rec[field]);
      expect(result.rec[field]).toBeLessThanOrEqual(result.premium[field]);
    }
  });

  it("eco uses min values (S01: 2500$)", () => {
    const result = calculateEstimation(baseInput);
    expect(result.eco.baseCost).toBe(2500);
  });

  it("premium uses max values (S01: 6000$)", () => {
    const result = calculateEstimation(baseInput);
    expect(result.premium.baseCost).toBe(6000);
  });

  it("rec uses midpoint (S01: 4250$)", () => {
    const result = calculateEstimation(baseInput);
    expect(result.rec.baseCost).toBe(4250);
  });

  it("applies bilingual multiplier correctly", () => {
    const withBilingual = calculateEstimation({
      ...baseInput,
      isBilingual: true,
    });
    const without = calculateEstimation(baseInput);

    // Eco: base * 1.4 (min multiplier)
    expect(withBilingual.eco.baseCost).toBe(without.eco.baseCost);
    expect(withBilingual.eco.multipliersCost).toBeGreaterThan(0);
    expect(withBilingual.eco.initialTotal).toBeGreaterThan(without.eco.initialTotal);
  });

  it("chains multiplicative multipliers (bilingual + urgent)", () => {
    const bilingualOnly = calculateEstimation({
      ...baseInput,
      isBilingual: true,
    });
    const bothFlags = calculateEstimation({
      ...baseInput,
      isBilingual: true,
      isUrgent: true,
    });

    // Both should cost more than bilingual alone
    expect(bothFlags.eco.initialTotal).toBeGreaterThan(
      bilingualOnly.eco.initialTotal
    );
  });

  it("adds additive multipliers correctly", () => {
    const withM08 = calculateEstimation({
      ...baseInput,
      selectedMultipliers: ["M08"], // Loi 25: 1000-3000$
    });

    // Eco: base stays same, multipliersCost includes 1000$ (M08 min)
    expect(withM08.eco.multipliersCost).toBe(1000);
  });

  it("adds sector modules", () => {
    const withModule = calculateEstimation({
      ...baseInput,
      selectedSectorModules: ["PME03"], // Google Business: 500-1500$
    });

    expect(withModule.eco.sectorModulesCost).toBe(500);
    expect(withModule.premium.sectorModulesCost).toBe(1500);
  });

  it("applies 15% contingency", () => {
    const result = calculateEstimation(baseInput);
    // Eco: base=2500, no multipliers, no modules
    // subtotal=2500, contingency=2500*0.15=375
    expect(result.eco.contingency).toBe(375);
  });

  it("year1 = initial + monthly*12", () => {
    const result = calculateEstimation(baseInput);
    for (const scenario of [result.eco, result.rec, result.premium]) {
      expect(scenario.year1Total).toBe(
        scenario.initialTotal + scenario.annualRecurring
      );
    }
  });

  it("annualRecurring = monthlyTotal * 12", () => {
    const result = calculateEstimation(baseInput);
    for (const scenario of [result.eco, result.rec, result.premium]) {
      expect(scenario.annualRecurring).toBe(scenario.monthlyTotal * 12);
    }
  });
});
