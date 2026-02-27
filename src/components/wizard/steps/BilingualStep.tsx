"use client";

import { useTranslations } from "next-intl";
import { RadioGroup } from "@/components/ui/RadioGroup";

interface BilingualStepProps {
  isBilingual: boolean;
  isMultilingual: boolean;
  isUrgent: boolean;
  onSetBilingual: (v: boolean) => void;
  onSetMultilingual: (v: boolean) => void;
  onSetUrgent: (v: boolean) => void;
}

export function BilingualStep({
  isBilingual,
  isMultilingual,
  isUrgent,
  onSetBilingual,
  onSetMultilingual,
  onSetUrgent,
}: BilingualStepProps) {
  const t = useTranslations("steps.extras");

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {"// "}
          {t("title").split(" ")[0]}
        </span>
        <h2 className="mt-2 text-h3 font-bold text-text-primary">{t("title")}</h2>
        <p className="mt-1 text-text-secondary">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            {t("bilingual.label")}
          </h3>
          <RadioGroup
            options={[
              { value: "yes", label: t("bilingual.yes") },
              { value: "no", label: t("bilingual.no") },
            ]}
            value={isBilingual ? "yes" : "no"}
            onChange={(v) => onSetBilingual(v === "yes")}
            columns={2}
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            {t("multilingual.label")}
          </h3>
          <RadioGroup
            options={[
              { value: "yes", label: t("multilingual.yes") },
              { value: "no", label: t("multilingual.no") },
            ]}
            value={isMultilingual ? "yes" : "no"}
            onChange={(v) => onSetMultilingual(v === "yes")}
            columns={2}
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
          />
        </div>
      </div>
    </div>
  );
}
