"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-surface/50">
      <div className="section-container py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-sm font-bold tracking-tight text-text-primary">
              Mark<span className="text-gradient-accent">Systems</span>
            </span>
            <span className="text-xs text-text-tertiary">{t("tagline")}</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-text-tertiary">
            <a
              href="https://marksystems.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              marksystems.ca
            </a>
            <a
              href="https://marksystems.ca/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {t("privacy")}
            </a>
          </div>

          <div className="flex flex-col items-center gap-1 sm:items-end">
            <span className="font-mono text-xs text-accent/60">
              {"// estimaweb-qc"}
            </span>
            <span className="text-xs text-text-tertiary">
              &copy; {year} Mark Systems. {t("rights")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
