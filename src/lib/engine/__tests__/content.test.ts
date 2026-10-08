import { describe, expect, it } from "vitest";
import fr from "../../../../messages/fr.json";
import en from "../../../../messages/en.json";
import { MARKET_DATA_METADATA, SECTOR_MODULES } from "../matrix";

describe("definitive bilingual business copy", () => {
  it("states the French subscription pricing position, taxes added", () => {
    expect(fr.transparency.notes[0]).toBe(
      "Prix des formules fixés par Auxo Systems le {date}. Montants indicatifs en dollars canadiens, avant taxes : la TPS et la TVQ s’ajoutent."
    );
    expect(fr.transparency.notes[1]).toContain("ne constitue pas une soumission contractuelle");
  });

  it("states the professional English equivalent", () => {
    expect(en.transparency.notes[0]).toBe(
      "Plan prices set by Auxo Systems on {date}. Indicative amounts in Canadian dollars, before taxes: GST and QST are added."
    );
    expect(en.transparency.notes[1]).toContain("does not constitute a contractual quote");
  });

  it("keeps the internal grid metadata of the one-time engine", () => {
    expect(MARKET_DATA_METADATA).toEqual({
      owner: "Auxo Systems",
      sourceStatus: "auxo-internal-rate-card",
      revisedAt: "2026-08-03",
      currency: "CAD",
      taxTreatment: "before-tax",
      contractual: false,
      marketRepresentative: false,
    });
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
