"use client";

import { useLocale, useTranslations } from "next-intl";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { SOCLE_ITEMS } from "@/lib/engine/matrix";
import { billedSocleRange } from "@/lib/engine/calculator";
import { SITE_TYPES_BY_SECTOR } from "@/lib/engine/compatibility";
import { formatCurrency } from "@/lib/utils";
import type {
  SiteTypeId,
  Sector,
  ProjectNature,
  CodeAuthor,
} from "@/lib/engine/types";

interface SiteTypeStepProps {
  value: SiteTypeId | null;
  onChange: (siteType: SiteTypeId) => void;
  sector: Sector;
  projectNature: ProjectNature;
  codeAuthor: CodeAuthor;
  blocsNeufs: number;
  blocsRhabilles: number;
  blocsConserves: number;
}

export function SiteTypeStep({
  value,
  onChange,
  sector,
  projectNature,
  codeAuthor,
  blocsNeufs,
  blocsRhabilles,
  blocsConserves,
}: SiteTypeStepProps) {
  const t = useTranslations("steps.siteType");
  const locale = useLocale() as "fr" | "en";

  // Un socle de refonte n'est chiffrable qu'une fois les sections décrites, à
  // l'étape suivante. Tant qu'elles ne le sont pas, la fourchette affichée reste
  // celle d'une construction neuve — et le libellé le dit.
  const totalBlocs = blocsNeufs + blocsRhabilles + blocsConserves;
  const showsRefonte = projectNature === "refonte" && totalBlocs > 0;

  const allowedTypes = SITE_TYPES_BY_SECTOR[sector];
  const options = allowedTypes.map((id) => {
    const price = showsRefonte
      ? billedSocleRange({
          sector,
          siteType: id,
          selectedMultipliers: [],
          selectedSectorModules: [],
          languageMode: "single",
          isUrgent: false,
          projectNature: "refonte",
          codeAuthor,
          blocsNeufs,
          blocsRhabilles,
          blocsConserves,
        })
      : SOCLE_ITEMS[id];
    return {
      value: id,
      label: t(`${id}.label`),
      description: t(`${id}.description`),
      priceHint: `${formatCurrency(Math.round(price.min), locale)} – ${formatCurrency(Math.round(price.max), locale)}`,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {t("title").split(" ")[0]}
        </span>
        <h2 className="mt-2 text-h3 font-bold text-text-primary">{t("title")}</h2>
        <p className="mt-1 text-text-secondary">{t("subtitle")}</p>
        {/* Lever toute ambiguïté sur ce que la fourchette affichée représente. */}
        <p className="mt-2 text-xs font-medium text-accent">
          {showsRefonte ? t("priceScopeRefonte") : t("priceScopeNeuf")}
        </p>
      </div>
      <RadioGroup
        options={options}
        value={value}
        onChange={(v) => onChange(v as SiteTypeId)}
        columns={2}
        ariaLabel={t("title")}
      />
    </div>
  );
}
