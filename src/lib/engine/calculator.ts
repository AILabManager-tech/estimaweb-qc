import type {
  ScenarioBreakdown,
  EstimationResult,
  CalculatorInput,
  OptionState,
  OptionStateMap,
  PriceRange,
  ProductionMode,
} from "./types";
import {
  SOCLE_ITEMS_BY_MODE,
  DEFAULT_PRODUCTION_MODE,
  SOCLE_PROJECT_SHARE,
  BILINGUAL_MULTIPLIER_BY_MODE,
  MULTIPLIERS,
  SECTOR_MODULES,
  MAINTENANCE_TIERS,
  THIRD_PARTY_COSTS,
  BASELINE_THIRD_PARTY,
  SITE_TYPE_MAINTENANCE,
  REFONTE_FACTORS,
} from "./matrix";
import { lerp } from "../utils";
import { CalculatorInputSchema } from "./schema";

type ScenarioKey = "eco" | "rec" | "premium";

function normalizeDecimal(value: number): number {
  return Number(value.toFixed(8));
}

// Percentile par scénario
const SCENARIO_PERCENTILES: Record<ScenarioKey, number> = {
  eco: 0,      // min
  rec: 0.5,    // mid
  premium: 1,  // max
};

/**
 * Part du prix de construction réellement due pour une option, selon son état.
 * En construction neuve tout est `neuf`, donc le facteur vaut toujours 1 et la
 * fonction est sans effet sur les résultats existants.
 */
function optionStateFactor(state: OptionState, t: number): number {
  switch (state) {
    case "existant":
      // Règle d'exclusion : ce qui est conservé ne se refacture jamais.
      return 0;
    case "bloc":
      // Règle de non-recouvrement : le travail a bien lieu, mais il est déjà
      // compté parmi les blocs déclarés du socle. Le facturer en plus le
      // compterait deux fois.
      return 0;
    case "rhabille":
      return lerp(REFONTE_FACTORS.blocRhabille.min, REFONTE_FACTORS.blocRhabille.max, t);
    default:
      return 1;
  }
}

function stateOf(states: OptionStateMap | undefined, id: string): OptionState {
  return states?.[id as keyof OptionStateMap] ?? "neuf";
}

/** Mode de production de l'entrée; absent équivaut au mode généré. */
function productionModeOf(input: CalculatorInput): ProductionMode {
  return input.productionMode ?? DEFAULT_PRODUCTION_MODE;
}

/**
 * Socle facturé pour le scénario.
 *
 * En neuf, c'est le montant du type de site pour le mode de production retenu.
 *
 * En refonte, ce montant se scinde en deux parts qui ne se comportent pas de la
 * même façon :
 *
 * - une **part projet** (`SOCLE_PROJECT_SHARE`) — cadrage, assurance qualité,
 *   non-régression, mise en ligne. Ce travail porte sur le mandat et sur le
 *   site entier : il est facturé en entier, sans division par les blocs;
 * - une **part blocs** — le reste, réparti sur le nombre total de blocs, puis
 *   facturé selon l'état de chacun : neuf à plein tarif, rhabillé à une
 *   fraction, conservé à zéro.
 *
 * La division par le nombre total de blocs porte donc désormais sur le seul
 * travail réellement proportionnel aux sections. Auparavant elle portait sur
 * tout le socle, ce qui diluait le travail neuf dans le site ancien : à travail
 * strictement identique, le socle facturé variait d'un facteur 10 selon le
 * nombre de blocs conservés. Il reste une variation résiduelle, et elle est
 * voulue : à budget de type de site donné, un site de cent sections a des
 * sections plus légères qu'un site de dix.
 *
 * L'infrastructure (routing, i18n, hébergement, composants partagés) reste
 * portée par les blocs conservés et n'est jamais refacturée.
 */
function computeSocle(input: CalculatorInput, t: number): number {
  const socle = SOCLE_ITEMS_BY_MODE[productionModeOf(input)][input.siteType];
  const fullBuild = lerp(socle.min, socle.max, t);
  if (input.projectNature !== "refonte") return fullBuild;

  const blocsNeufs = input.blocsNeufs ?? 0;
  const blocsRhabilles = input.blocsRhabilles ?? 0;
  const blocsConserves = input.blocsConserves ?? 0;
  const totalBlocs = blocsNeufs + blocsRhabilles + blocsConserves;
  // Le schéma refuse déjà une somme nulle; garde défensive contre un appel direct.
  if (totalBlocs === 0) return 0;

  // La part projet n'existe que s'il y a un mandat : si aucun bloc n'est touché,
  // il n'y a ni cadrage, ni non-régression, ni mise en ligne à facturer. La
  // règle d'exclusion l'emporte — rien de refait, rien de facturé.
  const blocsTouches = blocsNeufs + blocsRhabilles;
  const partProjet = blocsTouches > 0 ? fullBuild * SOCLE_PROJECT_SHARE : 0;
  const coutBloc = (fullBuild - fullBuild * SOCLE_PROJECT_SHARE) / totalBlocs;
  const rebuilt =
    partProjet +
    blocsNeufs * coutBloc +
    blocsRhabilles * coutBloc * optionStateFactor("rhabille", t) +
    blocsConserves * REFONTE_FACTORS.blocConserve;

  const codeFactor =
    input.codeAuthor === "tiers"
      ? lerp(REFONTE_FACTORS.codeTiers.min, REFONTE_FACTORS.codeTiers.max, t)
      : REFONTE_FACTORS.codeNous;

  return rebuilt * codeFactor;
}

// ── Fonction principale ─────────────────────────────────────────

/**
 * Calcule les 3 scénarios d'estimation à partir des inputs du wizard.
 *
 * Formule SOIC :
 *   Réalisation = (Socle × Multiplicateurs_chaînés) + Ajouts_fixes + Modules_sectoriels + Marge_15%
 *   Mensuel = Maintenance + Coûts_tiers
 *   Année 1 = Réalisation + (Mensuel × 12)
 *
 * Les multiplicateurs chaînés (langue, urgence) portent sur le socle seul : ils
 * majorent le travail de base, pas les ajouts fixes ni les modules sectoriels,
 * déjà chiffrés pour le périmètre qu'ils couvrent.
 *
 * En refonte, seul le socle change de forme : il se décompose par bloc selon
 * l'état de chacun (voir `computeSocle`), et chaque ajout ou module porte lui
 * aussi un état. Le reste de la chaîne est identique au mode neuf.
 * Le forfait de maintenance dépend du type de site; le scénario ne choisit que
 * le percentile appliqué uniformément à tous les postes.
 *
 */
export function calculateEstimation(input: CalculatorInput): EstimationResult {
  const validatedInput = CalculatorInputSchema.parse(input);
  const scenarios = (["eco", "rec", "premium"] as const).reduce(
    (acc, key) => {
      acc[key] = computeScenario(key, validatedInput);
      return acc;
    },
    {} as Record<ScenarioKey, ScenarioBreakdown>
  );

  return {
    ...scenarios,
    inputs: {
      sector: validatedInput.sector,
      siteType: validatedInput.siteType,
      multipliers: [...validatedInput.selectedMultipliers],
      sectorModules: [...validatedInput.selectedSectorModules],
      languageMode: validatedInput.languageMode,
      isUrgent: validatedInput.isUrgent,
      projectNature: validatedInput.projectNature,
      productionMode: validatedInput.productionMode,
      ...(validatedInput.projectNature === "refonte"
        ? {
            refonte: {
              codeAuthor: validatedInput.codeAuthor ?? "nous",
              blocsNeufs: validatedInput.blocsNeufs ?? 0,
              blocsRhabilles: validatedInput.blocsRhabilles ?? 0,
              blocsConserves: validatedInput.blocsConserves ?? 0,
              optionStates: { ...(validatedInput.optionStates ?? {}) },
            },
          }
        : {}),
    },
  };
}

/**
 * Fourchette réellement facturée pour une option, selon son état.
 *
 * L'interface doit annoncer ce que le calcul retiendra : une option déjà en
 * place vaut zéro, une option rhabillée ne vaut qu'une fraction de son prix de
 * construction. Passe par `optionStateFactor`, comme le calcul, pour que
 * l'affiché et le facturé ne puissent pas diverger.
 */
export function billedOptionRange(
  price: PriceRange,
  state: OptionState = "neuf"
): PriceRange {
  return {
    min: price.min * optionStateFactor(state, 0),
    max: price.max * optionStateFactor(state, 1),
  };
}

/**
 * Fourchette de socle réellement facturée, décomposition de refonte comprise.
 *
 * Réutilise `computeSocle` aux deux extrémités plutôt que de refaire le calcul :
 * une évolution de la formule se reflète automatiquement dans l'interface.
 */
export function billedSocleRange(input: CalculatorInput): PriceRange {
  return { min: computeSocle(input, 0), max: computeSocle(input, 1) };
}

// ── Compute a single scenario ───────────────────────────────────
function computeScenario(
  scenario: ScenarioKey,
  input: CalculatorInput
): ScenarioBreakdown {
  const t = SCENARIO_PERCENTILES[scenario];

  // 1. Coût de base (socle) — décomposé par bloc si le projet est une refonte
  const baseCost = computeSocle(input, t);

  // 2. Multiplicateurs chaînés (choix linguistique × urgence)
  let chainedMultiplier = 1;
  if (input.languageMode === "bilingual") {
    // Le supplément bilingue suit le mode de production : le générateur produit
    // le FR/EN nativement, un montage manuel duplique chaque bloc.
    const m01 = BILINGUAL_MULTIPLIER_BY_MODE[productionModeOf(input)];
    chainedMultiplier *= lerp(m01.min, m01.max, t);
  }
  if (input.languageMode === "multilingual") {
    const m = MULTIPLIERS.M02;
    chainedMultiplier *= lerp(m.value.min, m.value.max, t);
  }
  if (input.isUrgent) {
    const m = MULTIPLIERS.M13;
    chainedMultiplier *= lerp(m.value.min, m.value.max, t);
  }

  const costAfterMultipliers = normalizeDecimal(baseCost * chainedMultiplier);
  const multipliersCost = costAfterMultipliers - baseCost;

  // 3. Additifs (M03-M12) — seulement ceux sélectionnés, au prorata de leur état
  let additiveCost = 0;
  for (const mId of input.selectedMultipliers) {
    const m = MULTIPLIERS[mId];
    if (m && m.type === "ajout_fixe") {
      const factor = optionStateFactor(stateOf(input.optionStates, mId), t);
      additiveCost += lerp(m.value.min, m.value.max, t) * factor;
    }
  }

  // 4. Modules sectoriels sélectionnés, au prorata de leur état
  let sectorModulesCost = 0;
  const sectorModules = SECTOR_MODULES[input.sector] ?? [];
  for (const modId of input.selectedSectorModules) {
    const mod = sectorModules.find((m) => m.id === modId);
    if (mod) {
      const factor = optionStateFactor(stateOf(input.optionStates, modId), t);
      sectorModulesCost += lerp(mod.price.min, mod.price.max, t) * factor;
    }
  }

  // 5. Sous-total + marge imprévus 15%
  const subtotal = normalizeDecimal(
    costAfterMultipliers + additiveCost + sectorModulesCost
  );
  const contingency = normalizeDecimal(subtotal * 0.15);

  // Le total est la somme des quatre lignes telles qu'elles sont affichées, et
  // non l'arrondi du sous-total : arrondir chaque ligne séparément puis le total
  // une seule fois faisait diverger les deux d'un dollar dès que le socle tombait
  // sur une fraction — ce qui arrive systématiquement en refonte, où il est
  // divisé par le nombre de blocs. En construction neuve les deux formules
  // donnent le même résultat, aucun montant existant ne change.
  const roundedBase = Math.round(baseCost);
  const roundedMultipliers = Math.round(multipliersCost + additiveCost);
  const roundedSectorModules = Math.round(sectorModulesCost);
  const roundedContingency = Math.round(contingency);
  const initialTotal =
    roundedBase + roundedMultipliers + roundedSectorModules + roundedContingency;

  // 6. Coûts mensuels — le forfait dépend de l'ampleur du projet, pas du scénario
  const maintenanceTierId = SITE_TYPE_MAINTENANCE[input.siteType];
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
    baseCost: roundedBase,
    multipliersCost: roundedMultipliers,
    sectorModulesCost: roundedSectorModules,
    contingency: roundedContingency,
    initialTotal,
    maintenanceMonthly: roundedMaintenance,
    thirdPartyMonthly: roundedThirdParty,
    monthlyTotal: roundedMonthly,
    year1Total: initialTotal + roundedAnnual,
    annualRecurring: roundedAnnual,
  };
}
