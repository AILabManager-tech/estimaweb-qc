import type {
  SiteTypeId,
  MultiplierId,
  SectorModuleId,
  Sector,
  ScenarioBreakdown,
  EstimationResult,
} from "./types";
import {
  SOCLE_ITEMS,
  MULTIPLIERS,
  SECTOR_MODULES,
  MAINTENANCE_TIERS,
  THIRD_PARTY_COSTS,
  BASELINE_THIRD_PARTY,
  SCENARIO_MAINTENANCE,
} from "./matrix";
import { lerp } from "../utils";

// ── Types internes ──────────────────────────────────────────────
interface CalculatorInput {
  sector: Sector;
  siteType: SiteTypeId;
  selectedMultipliers: MultiplierId[];
  selectedSectorModules: SectorModuleId[];
  isBilingual: boolean;
  isMultilingual: boolean;
  isUrgent: boolean;
}

type ScenarioKey = "eco" | "rec" | "premium";

// Percentile par scénario
const SCENARIO_PERCENTILES: Record<ScenarioKey, number> = {
  eco: 0,      // min
  rec: 0.5,    // mid
  premium: 1,  // max
};

// ── Fonction principale ─────────────────────────────────────────

/**
 * Calcule les 3 scénarios d'estimation à partir des inputs du wizard.
 *
 * Formule SOIC :
 *   Réalisation = (Socle × Multiplicateurs_chaînés) + Ajouts_fixes + Modules_sectoriels + Marge_15%
 *   Mensuel = Maintenance + Coûts_tiers
 *   Année 1 = Réalisation + (Mensuel × 12)
 *
 */
export function calculateEstimation(input: CalculatorInput): EstimationResult {
  const scenarios = (["eco", "rec", "premium"] as const).reduce(
    (acc, key) => {
      acc[key] = computeScenario(key, input);
      return acc;
    },
    {} as Record<ScenarioKey, ScenarioBreakdown>
  );

  return {
    ...scenarios,
    inputs: {
      sector: input.sector,
      siteType: input.siteType,
      multipliers: input.selectedMultipliers,
      sectorModules: input.selectedSectorModules,
      isBilingual: input.isBilingual,
      isMultilingual: input.isMultilingual,
      isUrgent: input.isUrgent,
    },
  };
}

// ── Compute a single scenario ───────────────────────────────────
function computeScenario(
  scenario: ScenarioKey,
  input: CalculatorInput
): ScenarioBreakdown {
  const t = SCENARIO_PERCENTILES[scenario];

  // 1. Coût de base (socle)
  const socle = SOCLE_ITEMS[input.siteType];
  const baseCost = lerp(socle.min, socle.max, t);

  // 2. Multiplicateurs chaînés (bilingue × multilingue × urgence)
  let chainedMultiplier = 1;
  if (input.isBilingual) {
    const m = MULTIPLIERS.M01;
    chainedMultiplier *= lerp(m.value.min, m.value.max, t);
  }
  if (input.isMultilingual) {
    const m = MULTIPLIERS.M02;
    chainedMultiplier *= lerp(m.value.min, m.value.max, t);
  }
  if (input.isUrgent) {
    const m = MULTIPLIERS.M13;
    chainedMultiplier *= lerp(m.value.min, m.value.max, t);
  }

  const costAfterMultipliers = baseCost * chainedMultiplier;
  const multipliersCost = costAfterMultipliers - baseCost;

  // 3. Additifs (M03-M12) — seulement ceux sélectionnés
  let additiveCost = 0;
  for (const mId of input.selectedMultipliers) {
    const m = MULTIPLIERS[mId];
    if (m && m.type === "ajout_fixe") {
      additiveCost += lerp(m.value.min, m.value.max, t);
    }
  }

  // 4. Modules sectoriels sélectionnés
  let sectorModulesCost = 0;
  const sectorModules = SECTOR_MODULES[input.sector] ?? [];
  for (const modId of input.selectedSectorModules) {
    const mod = sectorModules.find((m) => m.id === modId);
    if (mod) {
      sectorModulesCost += lerp(mod.price.min, mod.price.max, t);
    }
  }

  // 5. Sous-total + marge imprévus 15%
  const subtotal = costAfterMultipliers + additiveCost + sectorModulesCost;
  const contingency = subtotal * 0.15;
  const initialTotal = subtotal + contingency;

  // 6. Coûts mensuels
  const maintenanceTierId = SCENARIO_MAINTENANCE[scenario];
  const maintenanceTier = MAINTENANCE_TIERS[maintenanceTierId];
  const maintenanceMonthly = lerp(maintenanceTier.price.min, maintenanceTier.price.max, t);

  let thirdPartyMonthly = 0;
  for (const tpId of BASELINE_THIRD_PARTY) {
    const tp = THIRD_PARTY_COSTS[tpId];
    thirdPartyMonthly += lerp(tp.min, tp.max, t);
  }

  const roundedMaintenance = Math.round(maintenanceMonthly);
  const roundedThirdParty = Math.round(thirdPartyMonthly);
  const roundedMonthly = roundedMaintenance + roundedThirdParty;
  const roundedAnnual = roundedMonthly * 12;

  return {
    baseCost: Math.round(baseCost),
    multipliersCost: Math.round(multipliersCost + additiveCost),
    sectorModulesCost: Math.round(sectorModulesCost),
    contingency: Math.round(contingency),
    initialTotal: Math.round(initialTotal),
    maintenanceMonthly: roundedMaintenance,
    thirdPartyMonthly: roundedThirdParty,
    monthlyTotal: roundedMonthly,
    year1Total: Math.round(initialTotal) + roundedAnnual,
    annualRecurring: roundedAnnual,
  };
}
