"use client";

import { useTranslations } from "next-intl";
import { RadioGroup } from "@/components/ui/RadioGroup";
import type { LanguageMode } from "@/lib/engine/types";

interface BilingualStepProps {
  languageMode: LanguageMode;
  onSetLanguageMode: (mode: LanguageMode) => void;
}

export function BilingualStep({
  languageMode,
  onSetLanguageMode,
}: BilingualStepProps) {
  const t = useTranslations("steps.extras");
  const tIndices = useTranslations("formules.indices");

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {t("title").split(" ")[0]}
        </span>
        <h2 className="mt-2 text-h3 font-bold text-text-primary">{t("title")}</h2>
        <p className="mt-1 text-text-secondary">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            {t("language.label")}
          </h3>
          <RadioGroup
            options={[
              {
                value: "single",
                label: t("language.single.label"),
                description: t("language.single.description"),
                priceHint: tIndices("compris"),
              },
              {
                value: "bilingual",
                label: t("language.bilingual.label"),
                description: t("language.bilingual.description"),
                priceHint: tIndices("compris"),
              },
              {
                value: "multilingual",
                label: t("language.multilingual.label"),
                description: t("language.multilingual.description"),
                priceHint: tIndices("aChiffrer"),
              },
            ]}
            value={languageMode}
            onChange={(v) => onSetLanguageMode(v as LanguageMode)}
            columns={3}
            ariaLabel={t("language.label")}
          />
        </div>
      </div>
    </div>
  );
}
