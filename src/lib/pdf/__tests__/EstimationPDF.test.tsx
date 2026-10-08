// @vitest-environment node

import { describe, expect, it } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { ADDITIVE_IDS, SECTOR_MODULES } from "@/lib/engine/matrix";
import { recommanderFormule } from "@/lib/formules/recommander";
import {
  EstimationPDF,
  formatPdfCurrency,
  getPdfDisclosureCopy,
  PDF_COPY,
} from "../EstimationPDF";

const generatedAt = new Date("2026-10-08T12:00:00Z");

const result = recommanderFormule({
  sector: "PRO",
  siteType: "S02",
  multipliers: ["M05", "M06"],
  sectorModules: ["PRO02"],
  languageMode: "multilingual",
});

describe("EstimationPDF", () => {
  it.each(["fr", "en"] as const)("renders a valid %s PDF for a plan", async (locale) => {
    const buffer = await renderToBuffer(
      <EstimationPDF result={result} locale={locale} generatedAt={generatedAt} />
    );
    expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
    expect(buffer.byteLength).toBeGreaterThan(5_000);
  });

  it("renders a valid PDF for a custom quote", async () => {
    const soumission = recommanderFormule({
      sector: "PME",
      siteType: "S04",
      multipliers: [],
      sectorModules: [],
      languageMode: "single",
    });
    expect(soumission.kind).toBe("soumission");
    const buffer = await renderToBuffer(
      <EstimationPDF result={soumission} locale="fr" generatedAt={generatedAt} />
    );
    expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
  });

  it("formats Canadian currency according to the report language", () => {
    expect(formatPdfCurrency(16_330, "fr")).toMatch(/^16\s330\s\$$/);
    expect(formatPdfCurrency(16_330, "en")).toContain("16,330");
  });

  it("fills the price date in the subscription disclosures", () => {
    expect(getPdfDisclosureCopy("fr").pricing).toBe(
      "Prix des formules fixés par Auxo Systems le 7 octobre 2026. Montants indicatifs en dollars canadiens, avant taxes : la TPS et la TVQ s’ajoutent."
    );
    expect(getPdfDisclosureCopy("en").pricing).toContain("on October 7, 2026");
    expect(getPdfDisclosureCopy("fr").contract).toContain("pas une soumission contractuelle");
    expect(PDF_COPY.fr.footer).toContain("avant taxes");
    expect(PDF_COPY.en.footer).toContain("before taxes");
  });

  it("renders the largest selection without an error", async () => {
    const maximum = recommanderFormule({
      sector: "MED",
      siteType: "S02",
      multipliers: [...ADDITIVE_IDS],
      sectorModules: SECTOR_MODULES.MED.map((item) => item.id),
      languageMode: "multilingual",
    });
    const buffer = await renderToBuffer(
      <EstimationPDF result={maximum} locale="fr" generatedAt={generatedAt} />
    );
    expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
  });
});
