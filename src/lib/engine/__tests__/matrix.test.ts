import { describe, it, expect } from "vitest";
import {
  SOCLE_ITEMS,
  SOCLE_ADDONS,
  MULTIPLIERS,
  SECTOR_MODULES,
  MAINTENANCE_TIERS,
  RECURRING_SERVICES,
  THIRD_PARTY_COSTS,
} from "../matrix";

describe("matrix data integrity", () => {
  it("all SOCLE_ITEMS have min <= max", () => {
    for (const [id, price] of Object.entries(SOCLE_ITEMS)) {
      expect(price.min, `${id} min <= max`).toBeLessThanOrEqual(price.max);
    }
  });

  it("all SOCLE_ADDONS have min <= max", () => {
    for (const [id, price] of Object.entries(SOCLE_ADDONS)) {
      expect(price.min, `${id} min <= max`).toBeLessThanOrEqual(price.max);
    }
  });

  it("multipliers have min <= max", () => {
    for (const [id, m] of Object.entries(MULTIPLIERS)) {
      expect(m.value.min, `${id} min <= max`).toBeLessThanOrEqual(m.value.max);
    }
  });

  it("multiplicative multipliers >= 1.0", () => {
    for (const [id, m] of Object.entries(MULTIPLIERS)) {
      if (m.type === "multiplicateur") {
        expect(m.value.min, `${id} min >= 1.0`).toBeGreaterThanOrEqual(1.0);
      }
    }
  });

  it("all sector module IDs are unique", () => {
    const allIds: string[] = [];
    for (const modules of Object.values(SECTOR_MODULES)) {
      for (const mod of modules) {
        allIds.push(mod.id);
      }
    }
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it("sector modules have min <= max", () => {
    for (const [sector, modules] of Object.entries(SECTOR_MODULES)) {
      for (const mod of modules) {
        expect(
          mod.price.min,
          `${sector}/${mod.id} min <= max`
        ).toBeLessThanOrEqual(mod.price.max);
      }
    }
  });

  it("maintenance tiers have min <= max", () => {
    for (const [id, tier] of Object.entries(MAINTENANCE_TIERS)) {
      expect(tier.price.min, `${id} min <= max`).toBeLessThanOrEqual(
        tier.price.max
      );
    }
  });

  it("maintenance tiers are ordered by price", () => {
    const tiers = ["ABN00", "ABN01", "ABN02", "ABN03", "ABN04"] as const;
    for (let i = 1; i < tiers.length; i++) {
      const prev = MAINTENANCE_TIERS[tiers[i - 1]];
      const curr = MAINTENANCE_TIERS[tiers[i]];
      expect(
        prev.price.max,
        `${tiers[i - 1]} max <= ${tiers[i]} max`
      ).toBeLessThanOrEqual(curr.price.max);
    }
  });

  it("has correct number of items per category", () => {
    expect(Object.keys(SOCLE_ITEMS)).toHaveLength(6);        // S01-S06
    expect(Object.keys(SOCLE_ADDONS)).toHaveLength(6);       // S07-S12
    expect(Object.keys(MULTIPLIERS)).toHaveLength(13);       // M01-M13
    expect(Object.keys(MAINTENANCE_TIERS)).toHaveLength(5);  // ABN00-ABN04
    expect(Object.keys(RECURRING_SERVICES)).toHaveLength(7); // REC01-REC07
    expect(Object.keys(THIRD_PARTY_COSTS)).toHaveLength(9);  // TIR01-TIR09
  });

  it("sector module counts match source", () => {
    expect(SECTOR_MODULES.JUR).toHaveLength(6);
    expect(SECTOR_MODULES.MED).toHaveLength(6);
    expect(SECTOR_MODULES.PRO).toHaveLength(5);
    expect(SECTOR_MODULES.PME).toHaveLength(7);
  });
});
