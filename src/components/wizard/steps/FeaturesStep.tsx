"use client";

import { useLocale, useTranslations } from "next-intl";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { MULTIPLIERS, SECTOR_MODULES, ADDITIVE_IDS } from "@/lib/engine/matrix";
import { billedOptionRange } from "@/lib/engine/calculator";
import { getOptionAvailability } from "@/lib/engine/compatibility";
import { formatCurrency } from "@/lib/utils";
import { RadioGroup } from "@/components/ui/RadioGroup";
import type {
  MultiplierId,
  SectorModuleId,
  Sector,
  SiteTypeId,
  OptionState,
  OptionStateMap,
  ProjectNature,
  PriceRange,
} from "@/lib/engine/types";

interface FeaturesStepProps {
  sector: Sector;
  siteType: SiteTypeId;
  selectedMultipliers: MultiplierId[];
  selectedSectorModules: SectorModuleId[];
  onToggleMultiplier: (id: MultiplierId) => void;
  onToggleSectorModule: (id: SectorModuleId) => void;
  projectNature: ProjectNature;
  optionStates: OptionStateMap;
  onSetOptionState: (id: MultiplierId | SectorModuleId, state: OptionState) => void;
}

const OPTION_STATES = ["neuf", "rhabille", "existant"] as const;

export function FeaturesStep({
  sector,
  siteType,
  selectedMultipliers,
  selectedSectorModules,
  onToggleMultiplier,
  onToggleSectorModule,
  projectNature,
  optionStates,
  onSetOptionState,
}: FeaturesStepProps) {
  const tFeatures = useTranslations("steps.features");
  const tModules = useTranslations("steps.sectorModules");
  const tCompatibility = useTranslations("compatibility");
  const locale = useLocale() as "fr" | "en";

  const tStates = useTranslations("steps.optionStates");
  const totalSelected = selectedMultipliers.length + selectedSectorModules.length;
  const stateOf = (id: MultiplierId | SectorModuleId): OptionState =>
    optionStates[id] ?? "neuf";

  // En refonte, chaque option retenue porte un état : une fonctionnalité qui
  // existe déjà ne doit pas être facturée à son prix de construction.
  const statefulOptions =
    projectNature === "refonte"
      ? [
          ...selectedMultipliers.map((id) => ({
            id: id as MultiplierId | SectorModuleId,
            label: tFeatures(`${id}.label`),
          })),
          ...selectedSectorModules.map((id) => ({
            id: id as MultiplierId | SectorModuleId,
            label: tModules(`${id}.label`),
          })),
        ]
      : [];

  const selection = {
    sector,
    siteType,
    selectedMultipliers,
    selectedSectorModules,
  };

  /**
   * Indice de prix réellement facturé. En refonte, une option déjà en place ne
   * coûte rien et une option rhabillée ne coûte qu'une fraction : afficher son
   * prix de construction ferait mentir l'interface sur ce que le calcul retient.
   */
  const priceHintFor = (id: MultiplierId | SectorModuleId, price: PriceRange) => {
    const state = projectNature === "refonte" ? stateOf(id) : "neuf";
    if (state === "existant") return tStates("hintExistant");
    const billed = billedOptionRange(price, state);
    return `+ ${formatCurrency(billed.min, locale)} – ${formatCurrency(billed.max, locale)}`;
  };

  const multiplierOptions = ADDITIVE_IDS.map((id) => {
    const m = MULTIPLIERS[id];
    const availability = getOptionAvailability(selection, "multiplier", id);
    return {
      value: id,
      label: tFeatures(`${id}.label`),
      description: tFeatures(`${id}.description`),
      priceHint: priceHintFor(id, m.value),
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
      priceHint: priceHintFor(mod.id, mod.price),
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

      {statefulOptions.length > 0 && (
        <div className="space-y-4 border-t border-surface-border pt-6">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
              {tStates("title")}
            </h3>
            <p className="mt-1 text-xs text-text-secondary">
              {tStates("subtitle")}
            </p>
          </div>
          <div className="space-y-3">
            {statefulOptions.map((option) => (
              <div
                key={option.id}
                className="rounded-sm border border-surface-border bg-surface p-4"
              >
                <p className="mb-3 text-sm font-medium text-text-primary">
                  {option.label}
                </p>
                <RadioGroup
                  options={OPTION_STATES.map((value) => ({
                    value,
                    label: tStates(`${value}.label`),
                    description: tStates(`${value}.description`),
                  }))}
                  value={optionStates[option.id] ?? "neuf"}
                  onChange={(v) => onSetOptionState(option.id, v as OptionState)}
                  columns={3}
                  ariaLabel={`${option.label} — ${tStates("title")}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
