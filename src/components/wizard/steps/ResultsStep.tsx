"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ScenarioCard } from "@/components/results/ScenarioCard";
import { TransparencyNotes } from "@/components/results/TransparencyNotes";
import { Button } from "@/components/ui/Button";
import { Download, RotateCcw, MessageSquare, Clock } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { EstimationResult } from "@/lib/engine/types";

interface ResultsStepProps {
  result: EstimationResult;
  onRestart: () => void;
  onDownloadPdf: () => void;
}

export function ResultsStep({
  result,
  onRestart,
  onDownloadPdf,
}: ResultsStepProps) {
  const t = useTranslations("steps.results");
  const tCommon = useTranslations("common");
  const tCta = useTranslations("contact_cta");

  return (
    <motion.div
      className="space-y-10"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {"// "}
          {t("title").split(" ")[0]}
        </span>
        <h2 className="mt-2 text-h2 font-bold text-text-primary">{t("title")}</h2>
        <p className="mt-1 text-text-secondary">{t("subtitle")}</p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="grid gap-4 md:grid-cols-3"
      >
        <ScenarioCard scenario="eco" breakdown={result.eco} />
        <ScenarioCard scenario="rec" breakdown={result.rec} featured />
        <ScenarioCard scenario="premium" breakdown={result.premium} />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <TransparencyNotes />
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
      >
        <Button onClick={onDownloadPdf} variant="secondary">
          <Download className="h-4 w-4" />
          {tCommon("downloadPdf")}
        </Button>
        <Button onClick={onRestart} variant="ghost">
          <RotateCcw className="h-4 w-4" />
          {tCommon("restart")}
        </Button>
      </motion.div>

      {/* CTA persuasive */}
      <motion.div
        variants={fadeInUp}
        className="mx-auto max-w-lg rounded-sm border border-accent/20 bg-accent/5 p-8 text-center"
      >
        <h3 className="text-h3 font-bold text-text-primary">{tCta("title")}</h3>
        <p className="mt-2 text-sm text-text-secondary">{tCta("subtitle")}</p>
        <Button className="mt-6 px-8" variant="primary" onClick={() => {
          const subject = encodeURIComponent("Demande de devis — EstimaWeb QC");
          const body = encodeURIComponent("Bonjour,\n\nJ'ai utilisé EstimaWeb QC et j'aimerais obtenir un devis personnalisé pour mon projet web.\n\nMerci!");
          window.location.href = `mailto:ai.developpe.agents@jimerle.com?subject=${subject}&body=${body}`;
        }}>
          <MessageSquare className="h-4 w-4" />
          {tCta("cta")}
        </Button>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-tertiary">
          <Clock className="h-3 w-3" />
          <span>{tCta("response")}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
