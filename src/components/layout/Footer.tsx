"use client";

import { useLocale, useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as "fr" | "en";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-surface/50">
      <div className="section-container py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-sm font-bold tracking-tight text-text-primary">
              EstimaWeb <span className="text-accent">QC</span>
            </span>
            <span className="text-xs text-text-tertiary">{t("tagline")}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-text-tertiary sm:gap-4">
            <a
              href="https://auxosystems.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {t("auxoSite")}
            </a>
            <a
              href={`https://auxosystems.ca/${locale}/privacy`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {t("privacy")}
            </a>
          </div>

          <div className="flex flex-col items-center gap-1 sm:items-end">
            <span className="text-xs text-text-tertiary">
              &copy; {year} Auxo Systems. {t("rights")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
