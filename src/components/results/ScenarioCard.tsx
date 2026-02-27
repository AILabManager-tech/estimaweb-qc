"use client";

import { useTranslations } from "next-intl";
import { cn, formatCurrency } from "@/lib/utils";
import { CostBreakdown } from "./CostBreakdown";
import type { ScenarioBreakdown } from "@/lib/engine/types";

type ScenarioKey = "eco" | "rec" | "premium";

interface ScenarioCardProps {
  scenario: ScenarioKey;
  breakdown: ScenarioBreakdown;
  featured?: boolean;
}

const scenarioStyles: Record<
  ScenarioKey,
  { header: string; border: string; badge: string }
> = {
  eco: {
    header: "bg-scenario-eco/10",
    border: "border-l-[3px] border-l-scenario-eco",
    badge: "bg-scenario-eco text-background",
  },
  rec: {
    header: "bg-accent/10",
    border: "border-l-[3px] border-l-accent",
    badge: "bg-accent text-background",
  },
  premium: {
    header: "bg-scenario-premium/10",
    border: "border-l-[3px] border-l-scenario-premium",
    badge: "bg-scenario-premium text-background",
  },
};

export function ScenarioCard({
  scenario,
  breakdown,
  featured = false,
}: ScenarioCardProps) {
  const tScenarios = useTranslations("scenarios");
  const tResults = useTranslations("results");
  const tCommon = useTranslations("common");
  const styles = scenarioStyles[scenario];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-sm border bg-surface overflow-hidden transition-all duration-300",
        featured
          ? "ring-2 ring-accent border-accent shadow-glow md:z-10"
          : "border-surface-border hover:border-accent/30"
      )}
    >
      {featured && (
        <div className="absolute right-3 top-3 rounded-sm bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
          {tCommon("recommended")}
        </div>
      )}

      {/* Header */}
      <div className={cn("p-5", styles.header, styles.border)}>
        <span
          className={cn(
            "inline-block rounded-sm px-2.5 py-0.5 text-xs font-bold",
            styles.badge
          )}
        >
          {tScenarios(`${scenario}.name`)}
        </span>
        <p className="mt-1.5 text-sm text-text-secondary">
          {tScenarios(`${scenario}.description`)}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Initial */}
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {tResults("initialCost")}
          </h4>
          <p className="mt-1 text-3xl font-bold text-text-primary">
            {formatCurrency(breakdown.initialTotal)}
          </p>
          <CostBreakdown
            lines={[
              { label: tResults("baseCost"), amount: breakdown.baseCost },
              { label: tResults("multipliers"), amount: breakdown.multipliersCost },
              { label: tResults("sectorModules"), amount: breakdown.sectorModulesCost },
              { label: tResults("contingency"), amount: breakdown.contingency },
            ]}
          />
        </div>

        <hr className="border-surface-border" />

        {/* Monthly */}
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {tResults("monthlyCost")}
          </h4>
          <p className="mt-1 text-xl font-bold text-text-primary">
            {formatCurrency(breakdown.monthlyTotal)}
            <span className="text-sm font-normal text-text-secondary">
              {tCommon("perMonth")}
            </span>
          </p>
          <CostBreakdown
            lines={[
              { label: tResults("maintenance"), amount: breakdown.maintenanceMonthly },
              { label: tResults("thirdParty"), amount: breakdown.thirdPartyMonthly },
            ]}
          />
        </div>

        <hr className="border-surface-border" />

        {/* Totals */}
        <div className="mt-auto space-y-2">
          <div className="flex items-baseline justify-between rounded-sm bg-accent/5 p-2">
            <span className="text-sm font-medium text-text-secondary">
              {tResults("year1Total")}
            </span>
            <span className="text-lg font-bold text-accent">
              {formatCurrency(breakdown.year1Total)}
            </span>
          </div>
          <div className="flex items-baseline justify-between px-2">
            <span className="text-sm font-medium text-text-secondary">
              {tResults("annualRecurring")}
            </span>
            <span className="text-sm font-semibold text-text-primary">
              {formatCurrency(breakdown.annualRecurring)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
