import { describe, expect, it } from "vitest";
import fr from "../../../../messages/fr.json";
import en from "../../../../messages/en.json";
import { MARKET_DATA_METADATA, SECTOR_MODULES } from "../matrix";

describe("definitive bilingual business copy", () => {
  it("states the exact French before-tax pricing position", () => {
    expect(fr.transparency.notes[0]).toBe(
      "Estimations basées sur la grille tarifaire interne d’Auxo Systems. Montants indicatifs en dollars canadiens, avant taxes. Cette estimation ne constitue pas une soumission contractuelle."
    );
    expect(fr.transparency.notes[2]).toContain("selon le lieu du client");
  });

  it("states the professional English equivalent", () => {
    expect(en.transparency.notes[0]).toBe(
      "Estimates based on Auxo Systems’ internal pricing grid. Indicative amounts in Canadian dollars, before taxes. This estimate does not constitute a contractual quote."
    );
    expect(en.transparency.notes[2]).toContain("based on the client’s location");
  });

  it("identifies the Auxo internal grid and its definitive revision date", () => {
    expect(MARKET_DATA_METADATA).toEqual({
      owner: "Auxo Systems",
      sourceStatus: "auxo-internal-rate-card",
      revisedAt: "2026-08-03",
      currency: "CAD",
      taxTreatment: "before-tax",
      contractual: false,
      marketRepresentative: false,
    });
    expect(fr.transparency.notes[1]).toContain("révisée le 3 août 2026");
    expect(en.transparency.notes[1]).toContain("revised on August 3, 2026");
  });

  it("defines one language choice with the same three meanings in both locales", () => {
    expect(fr.steps.extras.language).toMatchObject({
      single: { label: "Une langue" },
      bilingual: { description: "Exactement deux langues" },
      multilingual: { description: "Trois langues ou plus" },
    });
    expect(en.steps.extras.language).toMatchObject({
      single: { label: "One language" },
      bilingual: { description: "Exactly two languages" },
      multilingual: { description: "Three languages or more" },
    });
  });

  it("provides bilingual purpose text for every selectable sector module", () => {
    const ids = Object.values(SECTOR_MODULES).flat().map((item) => item.id);
    for (const id of ids) {
      expect(fr.steps.sectorModules[id].description.length).toBeGreaterThan(10);
      expect(en.steps.sectorModules[id].description.length).toBeGreaterThan(10);
    }
  });

  it("contains no obsolete market-year or external-study claim", () => {
    for (const catalog of [fr, en]) {
      const serialized = JSON.stringify(catalog);
      expect(serialized).not.toMatch(/2025|étude externe|external study|current market data|données de marché actuelles/i);
    }
  });
});
