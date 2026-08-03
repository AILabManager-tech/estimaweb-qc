// @vitest-environment node

import { describe, expect, it } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { calculateEstimation } from "@/lib/engine/calculator";
import { ADDITIVE_IDS, SECTOR_MODULES } from "@/lib/engine/matrix";
import { EstimationPDF, formatPdfCurrency } from "../EstimationPDF";

const result = calculateEstimation({
  sector: "PME",
  siteType: "S03",
  selectedMultipliers: ["M03", "M11"],
  selectedSectorModules: ["PME03"],
  isBilingual: true,
  isMultilingual: false,
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

  it("renders the maximum valid scenario without an error", async () => {
    const maximumResult = calculateEstimation({
      sector: "MED",
      siteType: "S05",
      selectedMultipliers: [...ADDITIVE_IDS],
      selectedSectorModules: SECTOR_MODULES.MED.map((item) => item.id),
      isBilingual: true,
      isMultilingual: true,
      isUrgent: true,
    });
    const buffer = await renderToBuffer(
      <EstimationPDF result={maximumResult} locale="fr" generatedAt={new Date("2026-08-03T12:00:00Z")} />
    );
    expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
    expect(buffer.byteLength).toBeGreaterThan(6_000);
  });
});
