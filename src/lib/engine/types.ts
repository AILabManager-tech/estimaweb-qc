// ── Secteurs d'activité ──────────────────────────────────────────
export type Sector = "JUR" | "MED" | "PRO" | "PME";

// ── Types de site (socle) ────────────────────────────────────────
export type SiteTypeId = "S01" | "S02" | "S03" | "S04" | "S05" | "S06";
export type SocleAddonId = "S07" | "S08" | "S09" | "S10" | "S11" | "S12";

// ── Multiplicateurs de complexité ────────────────────────────────
export type MultiplierId =
  | "M01" | "M02" | "M03" | "M04" | "M05" | "M06"
  | "M07" | "M08" | "M09" | "M10" | "M11" | "M12" | "M13";

// ── Modules sectoriels ──────────────────────────────────────────
export type JurModuleId = "JUR01" | "JUR02" | "JUR03" | "JUR04" | "JUR05" | "JUR06";
export type MedModuleId = "MED01" | "MED02" | "MED03" | "MED04" | "MED05" | "MED06";
export type ProModuleId = "PRO01" | "PRO02" | "PRO03" | "PRO04" | "PRO05";
export type PmeModuleId = "PME01" | "PME02" | "PME03" | "PME04" | "PME05" | "PME06" | "PME07";
export type SectorModuleId = JurModuleId | MedModuleId | ProModuleId | PmeModuleId;

// ── Abonnements ─────────────────────────────────────────────────
// ── Nature du projet (neuf vs refonte) ──────────────────────────
export type ProjectNature = "neuf" | "refonte";
export type CodeAuthor = "nous" | "tiers";

/**
 * État d'un bloc, d'un ajout fixe ou d'un module dans une refonte.
 * - `neuf`     : à construire de zéro, facturé plein tarif;
 * - `rhabille` : existe déjà, seule l'apparence change;
 * - `existant` : conservé tel quel, jamais refacturé.
 */
export type OptionState = "neuf" | "rhabille" | "existant";

/** État par option; toute option absente de la table est considérée `neuf`. */
export type OptionStateMap = Partial<
  Record<MultiplierId | SectorModuleId, OptionState>
>;

export type MaintenanceTierId = "ABN00" | "ABN01" | "ABN02" | "ABN03" | "ABN04";
export type RecurringServiceId = "REC01" | "REC02" | "REC03" | "REC04" | "REC05" | "REC06" | "REC07";
export type ThirdPartyCostId = "TIR01" | "TIR02" | "TIR03" | "TIR04" | "TIR05" | "TIR06" | "TIR07" | "TIR08" | "TIR09";
export type LanguageMode = "single" | "bilingual" | "multilingual";

// ── Structures de données ───────────────────────────────────────
export interface PriceRange {
  min: number;
  max: number;
}

export interface MatrixItem {
  id: string;
  price: PriceRange;
}

export interface MultiplierItem {
  id: MultiplierId;
  type: "multiplicateur" | "ajout_fixe";
  value: PriceRange; // Pour multiplicateur: {min: 1.4, max: 1.6}, pour ajout_fixe: {min: 2000, max: 8000}
}

export interface SectorModule {
  id: SectorModuleId;
  price: PriceRange;
}

export interface MaintenanceTier {
  id: MaintenanceTierId;
  price: PriceRange; // mensuel
}

// ── State du wizard ─────────────────────────────────────────────
export interface WizardState {
  currentStep: number;
  sector: Sector | null;
  siteType: SiteTypeId | null;
  selectedMultipliers: MultiplierId[];
  selectedSectorModules: SectorModuleId[];
  languageMode: LanguageMode;
  isUrgent: boolean;
  projectNature: ProjectNature;
  codeAuthor: CodeAuthor;
  blocsNeufs: number;
  blocsRhabilles: number;
  blocsConserves: number;
  optionStates: OptionStateMap;
  result: EstimationResult | null;
}

export interface CalculatorInput {
  sector: Sector;
  siteType: SiteTypeId;
  selectedMultipliers: MultiplierId[];
  selectedSectorModules: SectorModuleId[];
  languageMode: LanguageMode;
  isUrgent: boolean;
  /** Absent équivaut à `neuf` : une entrée écrite avant le mode refonte reste valide. */
  projectNature?: ProjectNature;
  // Les champs ci-dessous sont requis si et seulement si `projectNature === "refonte"`.
  codeAuthor?: CodeAuthor;
  blocsNeufs?: number;
  blocsRhabilles?: number;
  blocsConserves?: number;
  optionStates?: OptionStateMap;
}

// ── Résultats ───────────────────────────────────────────────────
export interface ScenarioBreakdown {
  baseCost: number;
  multipliersCost: number;
  sectorModulesCost: number;
  contingency: number;
  initialTotal: number;
  maintenanceMonthly: number;
  thirdPartyMonthly: number;
  monthlyTotal: number;
  year1Total: number;
  annualRecurring: number;
}

export interface EstimationResult {
  eco: ScenarioBreakdown;
  rec: ScenarioBreakdown;
  premium: ScenarioBreakdown;
  inputs: {
    sector: Sector;
    siteType: SiteTypeId;
    multipliers: MultiplierId[];
    sectorModules: SectorModuleId[];
    languageMode: LanguageMode;
    isUrgent: boolean;
    projectNature: ProjectNature;
    /** Renseigné uniquement en refonte. */
    refonte?: {
      codeAuthor: CodeAuthor;
      blocsNeufs: number;
      blocsRhabilles: number;
      blocsConserves: number;
      optionStates: OptionStateMap;
    };
  };
}
