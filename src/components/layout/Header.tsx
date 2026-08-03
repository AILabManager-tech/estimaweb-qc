"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const currentLocale = locale === "en" ? "en" : "fr";
  const targetLocale = currentLocale === "fr" ? "en" : "fr";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = () => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${targetLocale}`);
    router.push(newPath);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-surface-border/50 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="section-container flex h-16 items-center justify-between">
        <a href={`/${currentLocale}`} className="flex min-h-11 items-center gap-3">
          <span className="text-lg font-bold tracking-tight text-text-primary">
            EstimaWeb <span className="text-accent">QC</span>
          </span>
          <span className="hidden border-l border-surface-border pl-3 text-xs text-text-tertiary sm:inline">
            Auxo Systems
          </span>
        </a>
        <button
          type="button"
          onClick={switchLocale}
          aria-label={t("switchLanguage")}
          className="min-h-11 rounded-sm border border-surface-border bg-surface px-4 py-2 font-mono text-xs font-semibold text-text-secondary transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t("langSwitch")}
        </button>
      </div>
    </motion.header>
  );
}
