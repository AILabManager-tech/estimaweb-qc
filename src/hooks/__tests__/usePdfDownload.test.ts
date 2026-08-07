import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { usePdfDownload } from "../usePdfDownload";
import type { EstimationResult } from "@/lib/engine/types";

const toBlob = vi.fn();

vi.mock("@react-pdf/renderer", () => ({
  pdf: () => ({ toBlob }),
}));

vi.mock("@/lib/pdf/EstimationPDF", () => ({
  EstimationPDF: () => null,
}));

const result = { inputs: {} } as unknown as EstimationResult;

describe("usePdfDownload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("signale un échec de génération au lieu de le taire", async () => {
    toBlob.mockRejectedValue(new Error("rendering failed"));
    const { result: hook } = renderHook(() => usePdfDownload());

    await act(async () => {
      await hook.current.downloadPdf({ result, locale: "fr" });
    });

    await waitFor(() => {
      expect(hook.current.hasFailed).toBe(true);
      // le bouton doit redevenir utilisable, sans laisser croire à une réussite
      expect(hook.current.isGenerating).toBe(false);
    });
  });

  it("ne signale aucun échec quand la génération réussit", async () => {
    toBlob.mockResolvedValue(new Blob(["%PDF-1.7"], { type: "application/pdf" }));
    const createObjectURL = vi.fn(() => "blob:estimaweb");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });

    const { result: hook } = renderHook(() => usePdfDownload());
    await act(async () => {
      await hook.current.downloadPdf({ result, locale: "fr" });
    });

    expect(hook.current.hasFailed).toBe(false);
    expect(hook.current.isGenerating).toBe(false);
    expect(createObjectURL).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
