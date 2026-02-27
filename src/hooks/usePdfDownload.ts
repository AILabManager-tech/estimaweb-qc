"use client";

import { useCallback, useState } from "react";
import type { EstimationResult } from "@/lib/engine/types";

interface PdfDownloadOptions {
  result: EstimationResult;
  contactName?: string;
  contactCompany?: string;
}

export function usePdfDownload() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPdf = useCallback(async (options: PdfDownloadOptions) => {
    setIsGenerating(true);
    try {
      const [{ pdf }, { EstimationPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/pdf/EstimationPDF"),
      ]);

      const doc = EstimationPDF({
        result: options.result,
        contactName: options.contactName,
        contactCompany: options.contactCompany,
      });

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `estimaweb-qc-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { downloadPdf, isGenerating };
}
