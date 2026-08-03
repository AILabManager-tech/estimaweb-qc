"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowDown } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const t = useTranslations("hero");

  const scrollToWizard = () => {
    document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[82vh] items-center overflow-hidden border-b border-surface-border pt-16">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(32,39,37,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(32,39,37,0.35) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-accent/5 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-scenario-eco/10 blur-[100px]" />

      {/* Content */}
      <motion.div
        className="section-container relative z-10 py-20 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Monospace badge */}
        <motion.span
          variants={fadeInUp}
          className="inline-block rounded-full border border-accent/20 bg-surface px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent shadow-subtle"
        >
          {t("badge")}
        </motion.span>

        {/* Title */}
        <motion.h1
          variants={fadeInUp}
          className="mx-auto mt-7 max-w-4xl text-display font-bold text-balance text-text-primary sm:text-hero"
        >
          {t("titlePre")}
          <span className="text-gradient-accent">{t("titleAccent")}</span>
          {t("titlePost")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-6 max-w-2xl text-body-lg text-text-secondary"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUp} className="mt-10">
          <Button onClick={scrollToWizard} className="gap-3 px-8 py-4 text-base">
            {t("cta")}
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </Button>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          variants={fadeInUp}
          className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-text-tertiary"
        >
          {[t("trust1"), t("trust2"), t("trust3")].map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
              <span>{stat}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
