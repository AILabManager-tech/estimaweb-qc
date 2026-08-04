// @vitest-environment node

import { describe, expect, it } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { calculateEstimation } from "@/lib/engine/calculator";
import { ADDITIVE_IDS, SECTOR_MODULES } from "@/lib/engine/matrix";
import {
  EstimationPDF,
  formatPdfCurrency,
  getPdfDisclosureCopy,
  PDF_COPY,
} from "../EstimationPDF";

const result = calculateEstimation({
  sector: "PME",
  siteType: "S03",
  selectedMultipliers: ["M03", "M11"],
  selectedSectorModules: ["PME03"],
  languageMode: "bilingual",
  isUrgent: false,
});

describe("EstimationPDF", () => {
  it.each(["fr", "en"] as const)("renders a valid %s PDF", async (locale) => {
    const buffer = await renderToBuffer(
      <EstimationPDF result={result} locale={locale} generatedAt={new Date("2026-08-03T12:00:00Z")} />
    );
    expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
    expect(buffer.byteLength).toBeGreaterThan(5_000);
  });

  it("formats Canadian currency according to the report language", () => {
    expect(formatPdfCurrency(16_330, "fr")).toContain("16 330");
    expect(formatPdfCurrency(16_330, "en")).toContain("16,330");
  });

  it("uses the definitive French and English pricing and tax disclosures", () => {
    expect(getPdfDisclosureCopy("fr")).toMatchObject({
      pricing:
        "Estimations basées sur la grille tarifaire interne d’Auxo Systems. Montants indicatifs en dollars canadiens, avant taxes. Cette estimation ne constitue pas une soumission contractuelle.",
      taxes:
        "Les taxes applicables seront déterminées lors d’une éventuelle soumission officielle selon le lieu du client.",
    });
    expect(getPdfDisclosureCopy("en")).toMatchObject({
      pricing:
        "Estimates based on Auxo Systems’ internal pricing grid. Indicative amounts in Canadian dollars, before taxes. This estimate does not constitute a contractual quote.",
      taxes:
        "Applicable taxes will be determined in any official quote based on the client’s location.",
    });
    expect(PDF_COPY.fr.footer).toContain("avant taxes");
    expect(PDF_COPY.en.footer).toContain("before taxes");
  });

  it("receives only the normalized selection used by the result screen", () => {
    expect(result.inputs.multipliers).toEqual(["M03"]);
    expect(result.inputs.languageMode).toBe("bilingual");
  });

  it("renders the maximum valid scenario without an error", async () => {
    const maximumResult = calculateEstimation({
      sector: "MED",
      siteType: "S05",
      selectedMultipliers: [...ADDITIVE_IDS],
      selectedSectorModules: SECTOR_MODULES.MED.map((item) => item.id),
      languageMode: "multilingual",
      isUrgent: true,
    });
    const buffer = await renderToBuffer(
      <EstimationPDF result={maximumResult} locale="fr" generatedAt={new Date("2026-08-03T12:00:00Z")} />
    );
    expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
    expect(buffer.byteLength).toBeGreaterThan(6_000);
  });
});
