"use client";

import { useTranslations } from "next-intl";
import { RadioGroup } from "@/components/ui/RadioGroup";
import type { LanguageMode } from "@/lib/engine/types";

interface BilingualStepProps {
  languageMode: LanguageMode;
  isUrgent: boolean;
  onSetLanguageMode: (mode: LanguageMode) => void;
  onSetUrgent: (v: boolean) => void;
}

export function BilingualStep({
  languageMode,
  isUrgent,
  onSetLanguageMode,
  onSetUrgent,
}: BilingualStepProps) {
  const t = useTranslations("steps.extras");

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
              },
              {
                value: "bilingual",
                label: t("language.bilingual.label"),
                description: t("language.bilingual.description"),
              },
              {
                value: "multilingual",
                label: t("language.multilingual.label"),
                description: t("language.multilingual.description"),
              },
            ]}
            value={languageMode}
            onChange={(v) => onSetLanguageMode(v as LanguageMode)}
            columns={3}
            ariaLabel={t("language.label")}
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            {t("urgency.label")}
          </h3>
          <RadioGroup
            options={[
              { value: "yes", label: t("urgency.yes") },
              { value: "no", label: t("urgency.no") },
            ]}
            value={isUrgent ? "yes" : "no"}
            onChange={(v) => onSetUrgent(v === "yes")}
            columns={2}
            ariaLabel={t("urgency.label")}
          />
        </div>
      </div>
    </div>
  );
}
