"use client";

import { formatCurrency } from "@/lib/utils";

interface CostLine {
  label: string;
  amount: number;
}

interface CostBreakdownProps {
  lines: CostLine[];
}

export function CostBreakdown({ lines }: CostBreakdownProps) {
  return (
    <div className="mt-2 space-y-0.5">
      {lines
        .filter((l) => l.amount > 0)
        .map((line, i) => (
          <div
            key={line.label}
            className={`flex items-baseline justify-between rounded-sm px-1.5 py-0.5 text-xs ${
              i % 2 === 1 ? "bg-surface-light/50" : ""
            }`}
          >
            <span className="text-text-tertiary">{line.label}</span>
            <span className="font-mono text-text-secondary">
              {formatCurrency(line.amount)}
            </span>
          </div>
        ))}
    </div>
  );
}
