"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Shield } from "lucide-react";
import type { WizardState } from "@/lib/engine/types";

interface LeadCaptureStepProps {
  contact: WizardState["contact"];
  onSetContact: (field: keyof WizardState["contact"], value: string) => void;
  errors: Partial<Record<keyof WizardState["contact"], string>>;
}

export function LeadCaptureStep({
  contact,
  onSetContact,
  errors,
}: LeadCaptureStepProps) {
  const t = useTranslations("steps.contact");

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

      <div className="mx-auto max-w-md space-y-4">
        <Input
          label={t("name")}
          value={contact.name}
          onChange={(e) => onSetContact("name", e.target.value)}
          error={errors.name}
          required
          autoComplete="name"
        />
        <Input
          label={t("email")}
          type="email"
          value={contact.email}
          onChange={(e) => onSetContact("email", e.target.value)}
          error={errors.email}
          required
          autoComplete="email"
        />
        <Input
          label={t("company")}
          value={contact.company}
          onChange={(e) => onSetContact("company", e.target.value)}
          autoComplete="organization"
        />
        <Input
          label={t("phone")}
          type="tel"
          value={contact.phone}
          onChange={(e) => onSetContact("phone", e.target.value)}
          autoComplete="tel"
        />

        <div className="flex items-start gap-2 rounded-sm border border-surface-border bg-surface-light p-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p className="text-xs text-text-secondary">{t("privacy")}</p>
        </div>
      </div>
    </div>
  );
}
