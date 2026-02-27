"use client";

import { useTranslations } from "next-intl";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { MULTIPLIERS, SECTOR_MODULES, ADDITIVE_IDS } from "@/lib/engine/matrix";
import { formatCurrency } from "@/lib/utils";
import type { MultiplierId, SectorModuleId, Sector } from "@/lib/engine/types";

interface FeaturesStepProps {
  sector: Sector;
  selectedMultipliers: MultiplierId[];
  selectedSectorModules: SectorModuleId[];
  onToggleMultiplier: (id: MultiplierId) => void;
  onToggleSectorModule: (id: SectorModuleId) => void;
}

export function FeaturesStep({
  sector,
  selectedMultipliers,
  selectedSectorModules,
  onToggleMultiplier,
  onToggleSectorModule,
}: FeaturesStepProps) {
  const tFeatures = useTranslations("steps.features");
  const tModules = useTranslations("steps.sectorModules");

  const totalSelected = selectedMultipliers.length + selectedSectorModules.length;

  const multiplierOptions = ADDITIVE_IDS.map((id) => {
    const m = MULTIPLIERS[id];
    return {
      value: id,
      label: tFeatures(`${id}.label`),
      description: tFeatures(`${id}.description`),
      priceHint: `+ ${formatCurrency(m.value.min)} – ${formatCurrency(m.value.max)}`,
    };
  });

  const sectorModules = SECTOR_MODULES[sector] ?? [];
  const sectorOptions = sectorModules.map((mod) => ({
    value: mod.id,
    label: tModules(`${mod.id}.label`),
    priceHint: `+ ${formatCurrency(mod.price.min)} – ${formatCurrency(mod.price.max)}`,
  }));

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {"// "}
          {tFeatures("title").split(" ")[0]}
        </span>
        <h2 className="mt-2 text-h3 font-bold text-text-primary">
          {tFeatures("title")}
        </h2>
        <p className="mt-1 text-text-secondary">{tFeatures("subtitle")}</p>
        {totalSelected > 0 && (
          <span className="mt-2 inline-block rounded-sm bg-accent/10 px-2.5 py-1 font-mono text-xs text-accent">
            {totalSelected} {totalSelected === 1 ? "sélectionnée" : "sélectionnées"}
          </span>
        )}
      </div>

      <CheckboxGroup
        options={multiplierOptions}
        values={selectedMultipliers}
        onChange={(vals) => {
          const added = vals.filter((v) => !selectedMultipliers.includes(v as MultiplierId));
          const removed = selectedMultipliers.filter((v) => !vals.includes(v));
          added.forEach((v) => onToggleMultiplier(v as MultiplierId));
          removed.forEach((v) => onToggleMultiplier(v));
        }}
        columns={2}
      />

      {sectorOptions.length > 0 && (
        <>
          <div className="border-t border-surface-border pt-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
              {"// "}
              {tFeatures("sectorModules")}
            </h3>
          </div>
          <CheckboxGroup
            options={sectorOptions}
            values={selectedSectorModules}
            onChange={(vals) => {
              const added = vals.filter((v) => !selectedSectorModules.includes(v as SectorModuleId));
              const removed = selectedSectorModules.filter((v) => !vals.includes(v));
              added.forEach((v) => onToggleSectorModule(v as SectorModuleId));
              removed.forEach((v) => onToggleSectorModule(v));
            }}
            columns={2}
          />
        </>
      )}
    </div>
  );
}
