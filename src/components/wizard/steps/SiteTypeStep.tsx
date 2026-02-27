"use client";

import { useTranslations } from "next-intl";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { SOCLE_ITEMS } from "@/lib/engine/matrix";
import { formatCurrency } from "@/lib/utils";
import type { SiteTypeId, Sector } from "@/lib/engine/types";

interface SiteTypeStepProps {
  value: SiteTypeId | null;
  onChange: (siteType: SiteTypeId) => void;
  sector: Sector;
}

const SITE_TYPES_BY_SECTOR: Record<Sector, SiteTypeId[]> = {
  JUR: ["S01", "S02", "S05", "S06"],
  MED: ["S01", "S02", "S05", "S06"],
  PRO: ["S01", "S02", "S05", "S06"],
  PME: ["S01", "S02", "S03", "S04", "S05", "S06"],
};

export function SiteTypeStep({ value, onChange, sector }: SiteTypeStepProps) {
  const t = useTranslations("steps.siteType");

  const allowedTypes = SITE_TYPES_BY_SECTOR[sector];
  const options = allowedTypes.map((id) => {
    const price = SOCLE_ITEMS[id];
    return {
      value: id,
      label: t(`${id}.label`),
      description: t(`${id}.description`),
      priceHint: `${formatCurrency(price.min)} – ${formatCurrency(price.max)}`,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {"// "}
          {t("title").split(" ")[0]}
        </span>
        <h2 className="mt-2 text-h3 font-bold text-text-primary">{t("title")}</h2>
        <p className="mt-1 text-text-secondary">{t("subtitle")}</p>
      </div>
      <RadioGroup
        options={options}
        value={value}
        onChange={(v) => onChange(v as SiteTypeId)}
        columns={2}
      />
    </div>
  );
}
