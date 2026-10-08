"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { ENGAGEMENT_MOIS, FRAIS_DE_DEPART, type FormuleId, type RaisonId } from "@/lib/formules/donnees";
import { getFormule } from "@/lib/formules/recommander";

interface FormuleCardProps {
  formule: FormuleId;
  /** La formule qui correspond au projet. */
  recommandee: boolean;
  /** Raisons pour lesquelles cette formule ne suffit pas (vide : elle suffit). */
  neCouvrePas: RaisonId[];
}

const accents: Record<FormuleId, { bande: string; pastille: string }> = {
  depart: { bande: "border-t-scenario-eco", pastille: "bg-scenario-eco text-background" },
  pro: { bande: "border-t-accent", pastille: "bg-accent text-background" },
  croissance: { bande: "border-t-scenario-premium", pastille: "bg-scenario-premium text-background" },
};

export function FormuleCard({ formule, recommandee, neCouvrePas }: FormuleCardProps) {
  const t = useTranslations("formules");
  const locale = useLocale() as "fr" | "en";
  const { prixMensuel, pagesMax } = getFormule(formule);
  const inclus = t.raw(`${formule}.inclus`) as string[];
  const attenuee = neCouvrePas.length > 0;

  return (
    <article
      aria-label={t(`${formule}.nom`)}
      className={cn(
        "relative flex flex-col rounded-sm border border-t-4 bg-surface shadow-card transition-all duration-300",
        accents[formule].bande,
        recommandee
          ? "border-accent ring-2 ring-accent shadow-glow lg:-translate-y-2"
          : "border-surface-border",
        attenuee && "opacity-75"
      )}
    >
      {recommandee && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-accent px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-background">
          {t("recommandee")}
        </div>
      )}

      <div className="p-5 pt-6">
        <h3
          className={cn(
            "inline-block rounded-sm px-2.5 py-0.5 text-sm font-bold",
            accents[formule].pastille
          )}
        >
          {t(`${formule}.nom`)}
        </h3>
        <p className="mt-2 text-sm text-text-secondary">{t(`${formule}.accroche`)}</p>

        <p className="mt-4 flex items-baseline gap-1.5">
          <span className="text-[2.75rem] font-bold leading-none text-text-primary">
            {formatCurrency(prixMensuel, locale)}
          </span>
          <span className="text-base font-medium text-text-secondary">{t("parMois")}</span>
        </p>
        <p className="mt-2 text-xs text-text-tertiary">
          {t("sousLigne", {
            mois: ENGAGEMENT_MOIS,
            frais: formatCurrency(FRAIS_DE_DEPART, locale),
          })}
        </p>
        <p className="mt-3 text-sm font-semibold text-text-primary">
          {t("pages", { pages: pagesMax })}
        </p>
      </div>

      {attenuee && (
        <p className="mx-5 rounded-sm bg-surface-light px-3 py-2 text-xs font-medium text-text-secondary">
          {t("neCouvrePas", { raisons: neCouvrePas.map((r) => t(`raisons.${r}`)).join(", ") })}
        </p>
      )}

      <ul className="flex-1 space-y-2 border-t border-surface-border p-5 mt-4">
        {inclus.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-snug text-text-secondary">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
