"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ScenarioCard } from "@/components/results/ScenarioCard";
import { TransparencyNotes } from "@/components/results/TransparencyNotes";
import { Button } from "@/components/ui/Button";
import { Download, RotateCcw, MessageSquare, Mail, Pencil } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { EstimationResult } from "@/lib/engine/types";

interface ResultsStepProps {
  result: EstimationResult;
  onRestart: () => void;
  onEdit: () => void;
  onDownloadPdf: () => void;
  isPdfGenerating: boolean;
}

export function ResultsStep({
  result,
  onRestart,
  onEdit,
  onDownloadPdf,
  isPdfGenerating,
}: ResultsStepProps) {
  const t = useTranslations("steps.results");
  const tCommon = useTranslations("common");
  const tCta = useTranslations("contact_cta");
  const tSector = useTranslations("steps.sector");
  const tSiteType = useTranslations("steps.siteType");
  const tFeatures = useTranslations("steps.features");
  const tModules = useTranslations("steps.sectorModules");
  const featureLabels = result.inputs.multipliers.map((id) =>
    tFeatures(`${id}.label`)
  );
  const moduleLabels = result.inputs.sectorModules.map((id) =>
    tModules(`${id}.label`)
  );

  return (
    <motion.div
      className="space-y-10"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">{t("title").split(" ")[0]}</span>
        <h2 className="mt-2 text-h2 font-bold text-text-primary">{t("title")}</h2>
        <p className="mt-1 text-text-secondary">{t("subtitle")}</p>
      </motion.div>

      <motion.section
        variants={fadeInUp}
        className="rounded-sm border border-surface-border bg-surface-light p-5"
        aria-labelledby="normalized-selection-title"
      >
        <h3 id="normalized-selection-title" className="text-base font-bold text-text-primary">
          {t("summary.title")}
        </h3>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {t("summary.sector")}
            </dt>
            <dd className="mt-1 font-medium text-text-primary">
              {tSector(`${result.inputs.sector}.label`)}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {t("summary.siteType")}
            </dt>
            <dd className="mt-1 font-medium text-text-primary">
              {tSiteType(`${result.inputs.siteType}.label`)}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {t("summary.features")}
            </dt>
            <dd className="mt-1 text-text-primary">
              {featureLabels.join(", ") || t("summary.none")}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {t("summary.modules")}
            </dt>
            <dd className="mt-1 text-text-primary">
              {moduleLabels.join(", ") || t("summary.none")}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {t("summary.language")}
            </dt>
            <dd className="mt-1 text-text-primary">
              {t(`summary.languageModes.${result.inputs.languageMode}`)}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {t("summary.urgency")}
            </dt>
            <dd className="mt-1 text-text-primary">
              {result.inputs.isUrgent ? t("summary.yes") : t("summary.no")}
            </dd>
          </div>
        </dl>
      </motion.section>

      <motion.div
        variants={fadeInUp}
        className="grid gap-5 lg:grid-cols-3"
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
        <Button onClick={onDownloadPdf} variant="secondary" disabled={isPdfGenerating}>
          <Download className="h-4 w-4" />
          {isPdfGenerating ? tCommon("generatingPdf") : tCommon("downloadPdf")}
        </Button>
        <Button onClick={onEdit} variant="secondary">
          <Pencil className="h-4 w-4" />
          {tCommon("editAnswers")}
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
          const subject = encodeURIComponent(tCta("subject"));
          const body = encodeURIComponent(tCta("body"));
          window.location.href = `mailto:info@auxosystems.ca?subject=${subject}&body=${body}`;
        }}>
          <MessageSquare className="h-4 w-4" />
          {tCta("cta")}
        </Button>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-tertiary">
          <Mail className="h-3 w-3" />
          <span>{tCta("response")}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
