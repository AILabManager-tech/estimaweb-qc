"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
  priceHint?: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  values: string[];
  onChange: (values: string[]) => void;
  columns?: 2 | 3;
  ariaLabel: string;
}

export function CheckboxGroup({
  options,
  values,
  onChange,
  columns = 2,
  ariaLabel,
}: CheckboxGroupProps) {
  const groupId = useId();
  const toggle = (val: string) => {
    const option = options.find((item) => item.value === val);
    if (option?.disabled) return;
    onChange(
      values.includes(val)
        ? values.filter((v) => v !== val)
        : [...values, val]
    );
  };

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className={cn("grid gap-3", gridCols[columns])} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const isChecked = values.includes(option.value);
        const reasonId = `${groupId}-${option.value}-reason`;
        return (
          <motion.button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            aria-disabled={option.disabled || undefined}
            aria-describedby={option.disabledReason ? reasonId : undefined}
            onClick={() => toggle(option.value)}
            whileTap={option.disabled ? undefined : { scale: 0.98 }}
            className={cn(
              "relative rounded-sm border p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              option.disabled
                ? "cursor-not-allowed border-surface-border bg-surface-light opacity-65"
                : isChecked
                ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                : "border-surface-border bg-surface hover:border-accent/30 hover:-translate-y-px hover:shadow-subtle"
            )}
          >
            <div
              className={cn(
                "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-sm border transition-colors",
                isChecked
                  ? "border-accent bg-accent text-background"
                  : "border-surface-border"
              )}
            >
              {isChecked && <Check className="h-3 w-3" />}
            </div>
            <div className="pr-8">
              <p className="text-sm font-medium text-text-primary">
                {option.label}
              </p>
              {option.description && (
                <p className="mt-0.5 text-xs text-text-secondary">
                  {option.description}
                </p>
              )}
              {option.priceHint && (
                <p className="mt-1.5 text-xs font-mono font-semibold text-accent">
                  {option.priceHint}
                </p>
              )}
              {option.disabledReason && (
                <p id={reasonId} className="mt-2 text-xs font-medium leading-relaxed text-accent">
                  {option.disabledReason}
                </p>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
