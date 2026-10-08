"use client";

import { useTranslations } from "next-intl";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { SECTOR_MODULES, ADDITIVE_IDS } from "@/lib/engine/matrix";
import { getOptionAvailability } from "@/lib/engine/compatibility";
import { effetOption } from "@/lib/formules/recommander";
import type {
  MultiplierId,
  SectorModuleId,
  Sector,
  SiteTypeId,
} from "@/lib/engine/types";

interface FeaturesStepProps {
  sector: Sector;
  siteType: SiteTypeId;
  selectedMultipliers: MultiplierId[];
  selectedSectorModules: SectorModuleId[];
  onToggleMultiplier: (id: MultiplierId) => void;
  onToggleSectorModule: (id: SectorModuleId) => void;
}

export function FeaturesStep({
  sector,
  siteType,
  selectedMultipliers,
  selectedSectorModules,
  onToggleMultiplier,
  onToggleSectorModule,
}: FeaturesStepProps) {
  const tFeatures = useTranslations("steps.features");
  const tModules = useTranslations("steps.sectorModules");
  const tCompatibility = useTranslations("compatibility");
  const tFormules = useTranslations("formules");

  const totalSelected = selectedMultipliers.length + selectedSectorModules.length;

  const selection = {
    sector,
    siteType,
    selectedMultipliers,
    selectedSectorModules,
  };

  /** Indice : l'effet de l'option sur la formule, jamais un montant ponctuel. */
  const hintFor = (id: MultiplierId | SectorModuleId) => {
    const effet = effetOption(id);
    if (effet.effet === "comprise") return tFormules("indices.compris");
    if (effet.effet === "aChiffrer") return tFormules("indices.aChiffrer");
    return tFormules("indices.monte", { formule: tFormules(`${effet.formule}.nom`) });
  };

  const multiplierOptions = ADDITIVE_IDS.map((id) => {
    const availability = getOptionAvailability(selection, "multiplier", id);
    return {
      value: id,
      label: tFeatures(`${id}.label`),
      description: tFeatures(`${id}.description`),
      priceHint: hintFor(id),
      disabled: availability.disabled,
      disabledReason: availability.reason
        ? tCompatibility(availability.reason)
        : undefined,
    };
  });

  const sectorModules = SECTOR_MODULES[sector] ?? [];
  const sectorOptions = sectorModules.map((mod) => {
    const availability = getOptionAvailability(selection, "sectorModule", mod.id);
    return {
      value: mod.id,
      label: tModules(`${mod.id}.label`),
      description: tModules(`${mod.id}.description`),
      priceHint: hintFor(mod.id),
      disabled: availability.disabled,
      disabledReason: availability.reason
        ? tCompatibility(availability.reason)
        : undefined,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {tFeatures("title").split(" ")[0]}
        </span>
        <h2 className="mt-2 text-h3 font-bold text-text-primary">
          {tFeatures("title")}
        </h2>
        <p className="mt-1 text-text-secondary">{tFeatures("subtitle")}</p>
        {totalSelected > 0 && (
          <span className="mt-2 inline-block rounded-sm bg-accent/10 px-2.5 py-1 font-mono text-xs text-accent">
            {tFeatures("selectedCount", { count: totalSelected })}
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
        ariaLabel={tFeatures("title")}
      />

      {sectorOptions.length > 0 && (
        <>
          <div className="border-t border-surface-border pt-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
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
            ariaLabel={tFeatures("sectorModules")}
          />
        </>
      )}
    </div>
  );
}
