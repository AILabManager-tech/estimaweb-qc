"use client";

import { formatCurrency } from "@/lib/utils";

interface CostLine {
  label: string;
  amount: number;
}

interface CostBreakdownProps {
  lines: CostLine[];
  locale: "fr" | "en";
}

export function CostBreakdown({ lines, locale }: CostBreakdownProps) {
  return (
    <div className="mt-2 space-y-0.5">
      {lines
        .filter((l) => l.amount > 0)
        .map((line, i) => (
          <div
            key={line.label}
            className={`flex items-baseline justify-between gap-3 rounded-sm px-1.5 py-0.5 text-xs ${
              i % 2 === 1 ? "bg-surface-light/50" : ""
            }`}
          >
            <span className="min-w-0 text-text-tertiary">{line.label}</span>
            <span className="shrink-0 whitespace-nowrap font-mono text-text-secondary">
              {formatCurrency(line.amount, locale)}
            </span>
          </div>
        ))}
    </div>
  );
}
