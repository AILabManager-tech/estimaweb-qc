"use client";

import { useLocale, useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { formatDatePrixFixes } from "@/lib/formules/recommander";

export function TransparencyNotes() {
  const t = useTranslations("transparency");
  const locale = useLocale() as "fr" | "en";

  const notes = [
    t("notes.0", { date: formatDatePrixFixes(locale) }),
    t("notes.1"),
    t("notes.2"),
    t("notes.3"),
  ];

  return (
    <div className="rounded-sm border-l-2 border-l-accent bg-surface-light p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
        <Info className="h-4 w-4 text-accent" />
        {t("title")}
      </h3>
      <ul className="mt-3 space-y-2">
        {notes.map((note, i) => (
          <li
            key={i}
            className="flex gap-2 text-xs leading-relaxed text-text-secondary"
          >
            <span className="mt-0.5 shrink-0 text-accent">•</span>
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
