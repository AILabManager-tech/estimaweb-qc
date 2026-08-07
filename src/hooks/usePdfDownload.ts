"use client";

import { useCallback, useState } from "react";
import type { EstimationResult } from "@/lib/engine/types";

interface PdfDownloadOptions {
  result: EstimationResult;
  locale: "fr" | "en";
}

export function usePdfDownload() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const downloadPdf = useCallback(async (options: PdfDownloadOptions) => {
    setIsGenerating(true);
    setHasFailed(false);
    try {
      const [{ pdf }, { EstimationPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/pdf/EstimationPDF"),
      ]);

      const doc = EstimationPDF({
        result: options.result,
        locale: options.locale,
      });

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `estimaweb-qc-${options.locale}-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch (error) {
      // Un échec de génération doit rester visible : sans cela, le bouton
      // redevient actif et l'utilisateur croit avoir reçu son rapport.
      console.error("[EstimaWeb] PDF generation failed", error);
      setHasFailed(true);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { downloadPdf, isGenerating, hasFailed };
}
