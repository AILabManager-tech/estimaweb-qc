"use client";

import { useTranslations } from "next-intl";
import { Scale, Heart, Briefcase, Store } from "lucide-react";
import { RadioGroup } from "@/components/ui/RadioGroup";
import type { Sector } from "@/lib/engine/types";

interface SectorStepProps {
  value: Sector | null;
  onChange: (sector: Sector) => void;
}

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  JUR: <Scale className="h-5 w-5" />,
  MED: <Heart className="h-5 w-5" />,
  PRO: <Briefcase className="h-5 w-5" />,
  PME: <Store className="h-5 w-5" />,
};

const SECTORS: Sector[] = ["JUR", "MED", "PRO", "PME"];

export function SectorStep({ value, onChange }: SectorStepProps) {
  const t = useTranslations("steps.sector");

  const options = SECTORS.map((s) => ({
    value: s,
    label: t(`${s}.label`),
    description: t(`${s}.description`),
    icon: SECTOR_ICONS[s],
  }));

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
        onChange={(v) => onChange(v as Sector)}
        columns={2}
      />
    </div>
  );
}
