"use client";

import { useLocale, useTranslations } from "next-intl";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { SITE_TYPES_BY_SECTOR } from "@/lib/engine/compatibility";
import { formuleDuSite, getFormule } from "@/lib/formules/recommander";
import { formatCurrency } from "@/lib/utils";
import type { SiteTypeId, Sector } from "@/lib/engine/types";

interface SiteTypeStepProps {
  value: SiteTypeId | null;
  onChange: (siteType: SiteTypeId) => void;
  sector: Sector;
}

export function SiteTypeStep({ value, onChange, sector }: SiteTypeStepProps) {
  const t = useTranslations("steps.siteType");
  const tFormules = useTranslations("formules");
  const locale = useLocale() as "fr" | "en";

  // Indice : la formule de départ pour ce type de site, avant les options.
  const options = SITE_TYPES_BY_SECTOR[sector].map((id) => {
    const formule = formuleDuSite(id);
    return {
      value: id,
      label: t(`${id}.label`),
      description: t(`${id}.description`),
      priceHint: formule
        ? tFormules("indices.siteFormule", {
            formule: tFormules(`${formule}.nom`),
            prix: formatCurrency(getFormule(formule).prixMensuel, locale),
          })
        : tFormules("indices.soumission"),
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
        <p className="mt-2 text-xs font-medium text-accent">{t("priceScope")}</p>
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
