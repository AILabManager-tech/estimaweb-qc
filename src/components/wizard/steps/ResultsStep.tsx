"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { FormuleCard } from "@/components/results/FormuleCard";
import { TransparencyNotes } from "@/components/results/TransparencyNotes";
import { Button } from "@/components/ui/Button";
import { Download, RotateCcw, MessageSquare, Mail, Pencil, Info, FileText } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { formatCurrency } from "@/lib/utils";
import { ENGAGEMENT_MOIS, FRAIS_DE_DEPART, OPTIONS_AGENTS_IA } from "@/lib/formules/donnees";
import {
  ORDRE_FORMULES,
  getFormule,
  raisonsNonCouvertes,
  type ElementAChiffrer,
  type ResultatFormule,
} from "@/lib/formules/recommander";

interface ResultsStepProps {
  result: ResultatFormule;
  onRestart: () => void;
  onEdit: () => void;
  onDownloadPdf: () => void;
  isPdfGenerating: boolean;
  pdfFailed?: boolean;
}

const CONDITIONS = ["engagement", "propriete", "contenu", "revisions", "pages"] as const;

export function ResultsStep({
  result,
  onRestart,
  onEdit,
  onDownloadPdf,
  isPdfGenerating,
  pdfFailed = false,
}: ResultsStepProps) {
  const t = useTranslations("steps.results");
  const tCommon = useTranslations("common");
  const tCta = useTranslations("contact_cta");
  const tSector = useTranslations("steps.sector");
  const tSiteType = useTranslations("steps.siteType");
  const tFeatures = useTranslations("steps.features");
  const tModules = useTranslations("steps.sectorModules");
  const tFormules = useTranslations("formules");
  const locale = useLocale() as "fr" | "en";
  const { selection } = result;

  const featureLabels = selection.multipliers.map((id) => tFeatures(`${id}.label`));
  const moduleLabels = selection.sectorModules.map((id) => tModules(`${id}.label`));
  const frais = formatCurrency(FRAIS_DE_DEPART, locale);

  const labelAChiffrer = (element: ElementAChiffrer) => {
    if (element.kind === "langue") return tFormules("aChiffrer.langue");
    if (element.kind === "multiplier") return tFeatures(`${element.id}.label`);
    return tModules(`${element.id}.label`);
  };

  const ecrire = () => {
    const subject = encodeURIComponent(tCta("subject"));
    const body = encodeURIComponent(
      result.kind === "formule"
        ? tCta("body", {
            formule: tFormules(`${result.formule}.nom`),
            prix: formatCurrency(getFormule(result.formule).prixMensuel, locale),
            mois: ENGAGEMENT_MOIS,
          })
        : tCta("bodySoumission")
    );
    window.location.href = `mailto:info@auxosystems.ca?subject=${subject}&body=${body}`;
  };

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

      {result.kind === "formule" ? (
        <>
          <motion.div variants={fadeInUp} className="grid gap-6 pt-4 lg:grid-cols-3 lg:gap-5">
            {ORDRE_FORMULES.map((formule) => (
              <FormuleCard
                key={formule}
                formule={formule}
                recommandee={formule === result.formule}
                neCouvrePas={raisonsNonCouvertes(result, formule)}
              />
            ))}
          </motion.div>

          {result.noteCroissance11a15 && (
            <motion.p
              variants={fadeInUp}
              className="flex items-center justify-center gap-2 text-center text-sm font-medium text-text-primary"
            >
              <Info className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              {tFormules("note11a15")}
            </motion.p>
          )}

          {result.aChiffrer.length > 0 && (
            <motion.section
              variants={fadeInUp}
              aria-labelledby="a-chiffrer-titre"
              className="rounded-sm border border-scenario-premium/40 bg-scenario-premium-bg p-5"
            >
              <h3 id="a-chiffrer-titre" className="text-base font-bold text-text-primary">
                {tFormules("aChiffrer.titre")}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">{tFormules("aChiffrer.sousTitre")}</p>
              <ul className="mt-3 space-y-1.5">
                {result.aChiffrer.map((element) => (
                  <li
                    key={element.kind === "langue" ? "langue" : element.id}
                    className="flex gap-2 text-sm text-text-primary"
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-scenario-premium" aria-hidden />
                    <span>
                      {labelAChiffrer(element)}
                      {element.kind !== "langue" && OPTIONS_AGENTS_IA.includes(element.id) && (
                        <span className="block text-xs text-text-secondary">
                          {tFormules("aChiffrer.agentsIa")}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          <motion.section variants={fadeInUp} aria-labelledby="conditions-titre">
            <h3 id="conditions-titre" className="text-sm font-semibold text-text-primary">
              {tFormules("conditions.titre")}
            </h3>
            <ul className="mt-2 grid gap-1.5 text-sm text-text-secondary sm:grid-cols-2">
              {CONDITIONS.map((key) => (
                <li key={key} className="flex gap-2">
                  <span className="shrink-0 text-accent">•</span>
                  {tFormules(`conditions.${key}`, { mois: ENGAGEMENT_MOIS, frais })}
                </li>
              ))}
            </ul>
          </motion.section>
        </>
      ) : (
        <motion.section
          variants={fadeInUp}
          aria-labelledby="soumission-titre"
          className="mx-auto max-w-xl rounded-sm border border-t-4 border-accent bg-surface p-8 text-center shadow-card"
        >
          <h3 id="soumission-titre" className="text-h3 font-bold text-text-primary">
            {tFormules("soumission.titre")}
          </h3>
          <p className="mt-3 text-text-secondary">{tFormules("soumission.texte")}</p>
          <Button className="mt-6 px-8" variant="primary" onClick={ecrire}>
            <MessageSquare className="h-4 w-4" />
            {tCta("cta")}
          </Button>
        </motion.section>
      )}

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
            <dt className="font-mono text-[0.625rem] uppercase tracking-widest text-text-tertiary">
              {t("summary.sector")}
            </dt>
            <dd className="mt-1 font-medium text-text-primary">
              {tSector(`${selection.sector}.label`)}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.625rem] uppercase tracking-widest text-text-tertiary">
              {t("summary.siteType")}
            </dt>
            <dd className="mt-1 font-medium text-text-primary">
              {tSiteType(`${selection.siteType}.label`)}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.625rem] uppercase tracking-widest text-text-tertiary">
              {t("summary.features")}
            </dt>
            <dd className="mt-1 text-text-primary">
              {featureLabels.join(", ") || t("summary.none")}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.625rem] uppercase tracking-widest text-text-tertiary">
              {t("summary.modules")}
            </dt>
            <dd className="mt-1 text-text-primary">
              {moduleLabels.join(", ") || t("summary.none")}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.625rem] uppercase tracking-widest text-text-tertiary">
              {t("summary.language")}
            </dt>
            <dd className="mt-1 text-text-primary">
              {t(`summary.languageModes.${selection.languageMode}`)}
            </dd>
          </div>
        </dl>
      </motion.section>

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

      {pdfFailed && (
        <motion.p
          variants={fadeInUp}
          role="alert"
          className="text-center text-sm text-scenario-premium"
        >
          {tCommon("pdfError")}
        </motion.p>
      )}

      {/* Contact : le courriel prérempli nomme la formule recommandée */}
      <motion.div
        variants={fadeInUp}
        className="mx-auto max-w-lg rounded-sm border border-accent/20 bg-accent/5 p-8 text-center"
      >
        <h3 className="text-h3 font-bold text-text-primary">{tCta("title")}</h3>
        <p className="mt-2 text-sm text-text-secondary">{tCta("subtitle")}</p>
        <Button className="mt-6 px-8" variant="primary" onClick={ecrire}>
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
