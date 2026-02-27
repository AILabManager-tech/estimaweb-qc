"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Header() {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const currentLocale = pathname.startsWith("/en") ? "en" : "fr";
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
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-text-primary">
            Mark<span className="text-gradient-accent">Systems</span>
          </span>
        </div>
        <button
          onClick={switchLocale}
          className="rounded-sm border border-surface-border px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
        >
          {t("langSwitch")}
        </button>
      </div>
    </motion.header>
  );
}
