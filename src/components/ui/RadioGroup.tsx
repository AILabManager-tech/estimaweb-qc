"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  priceHint?: string;
  icon?: React.ReactNode;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
}

export function RadioGroup({
  options,
  value,
  onChange,
  columns = 2,
}: RadioGroupProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2",
    4: "grid-cols-1 sm:grid-cols-2",
  };

  return (
    <div className={cn("grid gap-3", gridCols[columns])} role="radiogroup">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative rounded-sm border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isSelected
                ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                : "border-surface-border bg-surface hover:border-accent/30 hover:-translate-y-px hover:shadow-subtle"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="radio-indicator"
                className="absolute right-3 top-3 h-3 w-3 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <div className="flex items-start gap-3 pr-6">
              {option.icon && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent/10 text-accent">
                  {option.icon}
                </div>
              )}
              <div>
                <p className="font-semibold text-text-primary">{option.label}</p>
                {option.description && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {option.description}
                  </p>
                )}
                {option.priceHint && (
                  <p className="mt-2 text-sm font-mono font-semibold text-accent">
                    {option.priceHint}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
