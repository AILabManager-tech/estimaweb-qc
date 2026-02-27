"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_KEYS = [
  "sector",
  "siteType",
  "features",
  "extras",
  "contact",
  "results",
] as const;

const STEP_ABBR: Record<string, string> = {
  sector: "Sect.",
  siteType: "Type",
  features: "Fonc.",
  extras: "Lang.",
  contact: "Info",
  results: "Rés.",
};

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const t = useTranslations("wizard.steps");

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center gap-1">
        {STEP_KEYS.map((key, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          return (
            <li key={key} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
                    isCompleted && "bg-accent text-background",
                    isActive &&
                      "bg-accent/20 text-accent ring-2 ring-accent",
                    !isCompleted && !isActive && "bg-surface-light text-text-tertiary"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {i + 1}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full ring-2 ring-accent"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                {i < totalSteps - 1 && (
                  <div className="relative h-0.5 flex-1 bg-surface-border">
                    {isCompleted && (
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-accent"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    )}
                  </div>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] leading-tight",
                  isActive ? "text-accent font-medium" : "text-text-tertiary"
                )}
              >
                <span className="hidden sm:inline">{t(key)}</span>
                <span className="sm:hidden">{STEP_ABBR[key]}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
