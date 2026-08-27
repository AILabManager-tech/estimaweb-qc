import { ADDITIVE_IDS, SECTOR_MODULES } from "./matrix";
import type {
  LanguageMode,
  MultiplierId,
  Sector,
  SectorModuleId,
  SiteTypeId,
} from "./types";

export type CompatibilityRelation =
  | "MUTUELLEMENT EXCLUSIVES"
  | "REMPLACEMENT"
  | "INCLUSION"
  | "CUMUL AUTORISÉ"
  | "CONFLIT MÉTIER";

export type SelectableOptionKind = "siteType" | "multiplier" | "sectorModule";

export interface OptionReference {
  kind: SelectableOptionKind;
  id: SiteTypeId | MultiplierId | SectorModuleId;
}

export interface CompatibilitySelection {
  sector: Sector;
  siteType: SiteTypeId;
  selectedMultipliers: MultiplierId[];
  selectedSectorModules: SectorModuleId[];
}

interface PairRule {
  id: string;
  relation: "REMPLACEMENT" | "INCLUSION" | "CUMUL AUTORISÉ";
  source: OptionReference;
  target: OptionReference;
  capability: string;
  justification: string;
}

export const LANGUAGE_MODES = [
  "single",
  "bilingual",
  "multilingual",
] as const satisfies readonly LanguageMode[];

export const SITE_TYPES_BY_SECTOR: Record<Sector, readonly SiteTypeId[]> = {
  JUR: ["S01", "S02", "S05", "S06"],
  MED: ["S01", "S02", "S05", "S06"],
  PRO: ["S01", "S02", "S05", "S06"],
  PME: ["S01", "S02", "S03", "S04", "S05", "S06"],
};

export const MUTUALLY_EXCLUSIVE_GROUPS = [
  {
    id: "sector",
    relation: "MUTUELLEMENT EXCLUSIVES",
    options: ["JUR", "MED", "PRO", "PME"],
  },
  {
    id: "site-type",
    relation: "MUTUELLEMENT EXCLUSIVES",
    options: ["S01", "S02", "S03", "S04", "S05", "S06"],
  },
  {
    id: "language-mode",
    relation: "MUTUELLEMENT EXCLUSIVES",
    options: LANGUAGE_MODES,
  },
] as const;

export const REPLACEMENT_RULES = [
  {
    id: "medical-booking-replaces-generic-booking",
    relation: "REMPLACEMENT",
    source: { kind: "sectorModule", id: "MED01" },
    target: { kind: "multiplier", id: "M03" },
    capability: "appointment-booking",
    justification: "The medical module implements the same appointment-booking journey.",
  },
  {
    id: "legal-portal-replaces-generic-portal",
    relation: "REMPLACEMENT",
    source: { kind: "sectorModule", id: "JUR03" },
    target: { kind: "multiplier", id: "M04" },
    capability: "secure-client-portal",
    justification: "The confidential legal portal is the sector-specific client portal.",
  },
  {
    id: "patient-portal-replaces-generic-portal",
    relation: "REMPLACEMENT",
    source: { kind: "sectorModule", id: "MED03" },
    target: { kind: "multiplier", id: "M04" },
    capability: "secure-client-portal",
    justification: "The patient portal is the health-specific secure client portal.",
  },
  {
    id: "document-portal-replaces-generic-portal",
    relation: "REMPLACEMENT",
    source: { kind: "sectorModule", id: "PRO04" },
    target: { kind: "multiplier", id: "M04" },
    capability: "secure-client-portal",
    justification: "The document portal is the regulated-profession client portal.",
  },
  {
    id: "health-law25-replaces-generic-law25",
    relation: "REMPLACEMENT",
    source: { kind: "sectorModule", id: "MED02" },
    target: { kind: "multiplier", id: "M08" },
    capability: "law-25-compliance",
    justification: "The health-data module is the specialized Law 25 implementation.",
  },
  {
    id: "sme-quote-form-replaces-generic-complex-form",
    relation: "REMPLACEMENT",
    source: { kind: "sectorModule", id: "PME02" },
    target: { kind: "multiplier", id: "M09" },
    capability: "quote-request-workflow",
    justification: "The quote-request module already implements its conditional form workflow.",
  },
  {
    id: "professional-quote-system-replaces-generic-complex-form",
    relation: "REMPLACEMENT",
    source: { kind: "sectorModule", id: "PRO05" },
    target: { kind: "multiplier", id: "M09" },
    capability: "quote-request-workflow",
    justification: "The online quote system already includes the related complex form workflow.",
  },
] as const satisfies readonly PairRule[];

export const INCLUSION_RULES = [
  {
    id: "basic-commerce-includes-catalog",
    relation: "INCLUSION",
    source: { kind: "siteType", id: "S03" },
    target: { kind: "sectorModule", id: "PME01" },
    capability: "commerce-catalog",
    justification: "An online store already includes its product catalog.",
  },
  {
    id: "advanced-commerce-includes-catalog",
    relation: "INCLUSION",
    source: { kind: "siteType", id: "S04" },
    target: { kind: "sectorModule", id: "PME01" },
    capability: "commerce-catalog",
    justification: "An advanced online store already includes its product catalog.",
  },
  {
    id: "basic-commerce-includes-payment",
    relation: "INCLUSION",
    source: { kind: "siteType", id: "S03" },
    target: { kind: "multiplier", id: "M11" },
    capability: "commerce-checkout",
    justification: "The basic online store includes its checkout and payment integration.",
  },
  {
    id: "advanced-commerce-includes-payment",
    relation: "INCLUSION",
    source: { kind: "siteType", id: "S04" },
    target: { kind: "multiplier", id: "M11" },
    capability: "commerce-checkout",
    justification: "The advanced online store includes its checkout and payment integration.",
  },
  {
    id: "basic-commerce-includes-ordering",
    relation: "INCLUSION",
    source: { kind: "siteType", id: "S03" },
    target: { kind: "sectorModule", id: "PME05" },
    capability: "online-ordering",
    justification: "A commerce site and an online ordering module would implement the same order flow.",
  },
  {
    id: "advanced-commerce-includes-ordering",
    relation: "INCLUSION",
    source: { kind: "siteType", id: "S04" },
    target: { kind: "sectorModule", id: "PME05" },
    capability: "online-ordering",
    justification: "An advanced commerce site already includes the order flow.",
  },
  {
    id: "online-ordering-includes-payment",
    relation: "INCLUSION",
    source: { kind: "sectorModule", id: "PME05" },
    target: { kind: "multiplier", id: "M11" },
    capability: "online-ordering-checkout",
    justification: "The online ordering module includes checkout for that same ordering journey.",
  },
  {
    id: "online-ordering-includes-catalog",
    relation: "INCLUSION",
    source: { kind: "sectorModule", id: "PME05" },
    target: { kind: "sectorModule", id: "PME01" },
    capability: "commerce-catalog",
    justification: "An online menu or ordering module already structures its own product catalog.",
  },
] as const satisfies readonly PairRule[];

export const EXPLICIT_ALLOWED_CUMULATIONS = [
  { id: "booking-payment", relation: "CUMUL AUTORISÉ", options: ["M03", "M11"], justification: "Booking and payment are distinct implementations." },
  { id: "portal-basic-commerce", relation: "CUMUL AUTORISÉ", options: ["M04", "S03"], justification: "A secure client portal can be distinct from a store account." },
  { id: "portal-advanced-commerce", relation: "CUMUL AUTORISÉ", options: ["M04", "S04"], justification: "A secure client portal can be distinct from a store account." },
  { id: "portal-crm", relation: "CUMUL AUTORISÉ", options: ["M04", "M05"], justification: "A portal and a sales or marketing CRM serve different workflows." },
  { id: "crm-clio", relation: "CUMUL AUTORISÉ", options: ["M05", "JUR06"], justification: "A marketing CRM and Clio legal practice management are distinct systems." },
  { id: "crm-emr", relation: "CUMUL AUTORISÉ", options: ["M05", "MED04"], justification: "A marketing CRM and a clinical record system are distinct systems." },
  { id: "crm-business-software", relation: "CUMUL AUTORISÉ", options: ["M05", "PRO03"], justification: "A CRM and non-CRM line-of-business software are distinct systems." },
  { id: "accessibility-bar-compliance", relation: "CUMUL AUTORISÉ", options: ["M07", "JUR01"], justification: "Accessibility and Quebec Bar compliance cover different obligations." },
  { id: "accessibility-order-compliance", relation: "CUMUL AUTORISÉ", options: ["M07", "PRO01"], justification: "Accessibility and professional-order compliance cover different obligations." },
  { id: "law25-bar-compliance", relation: "CUMUL AUTORISÉ", options: ["M08", "JUR01"], justification: "Law 25 privacy work and Quebec Bar compliance are distinct." },
  { id: "law25-order-compliance", relation: "CUMUL AUTORISÉ", options: ["M08", "PRO01"], justification: "Law 25 privacy work and professional-order compliance are distinct." },
  { id: "complex-form-calculator", relation: "CUMUL AUTORISÉ", options: ["M09", "PRO02"], justification: "A separate form workflow and a calculator can both be required." },
  { id: "migration-crm", relation: "CUMUL AUTORISÉ", options: ["M10", "M05"], justification: "Data migration and a live CRM integration are distinct work." },
  { id: "migration-clio", relation: "CUMUL AUTORISÉ", options: ["M10", "JUR06"], justification: "Data migration and a live Clio integration are distinct work." },
  { id: "migration-emr", relation: "CUMUL AUTORISÉ", options: ["M10", "MED04"], justification: "Data migration and a live EMR integration are distinct work." },
  { id: "migration-business-software", relation: "CUMUL AUTORISÉ", options: ["M10", "PRO03"], justification: "Data migration and a live business-software integration are distinct work." },
  { id: "medical-booking-multi-practitioner", relation: "CUMUL AUTORISÉ", options: ["MED01", "MED06"], justification: "Booking and multi-practitioner information architecture are distinct." },
] as const;

/**
 * Décisions propres au mode refonte.
 *
 * La nature du projet et les états de blocs ne sont pas des options
 * sélectionnables : ils ne peuvent pas entrer en conflit avec une option et ne
 * relèvent donc pas des règles par paire ci-dessus. Ce qu'il faut déclarer, ce
 * sont les recoupements que la refonte rend ambigus.
 */
export const REFONTE_DECISIONS = [
  {
    id: "migration-vs-refonte",
    relation: "CUMUL AUTORISÉ",
    justification:
      "M10 Migration de données déplace un contenu existant vers une nouvelle structure; la refonte décrit l'état des sections refaites. Les deux peuvent coexister sur un même mandat.",
  },
  {
    id: "refonte-infrastructure-jamais-refacturee",
    relation: "EXCLUSION",
    justification:
      "Routing, i18n, hébergement et composants partagés sont portés par les blocs conservés, facturés à zéro. Aucun de ces postes ne peut réapparaître dans le socle d'une refonte.",
  },
  {
    id: "refonte-option-existante",
    relation: "EXCLUSION",
    justification:
      "Une option à l'état « existant » vaut zéro : une fonctionnalité déjà en place n'est jamais refacturée à son prix de construction.",
  },
] as const;

export const BUSINESS_CONFLICT_RULES = [
  {
    id: "sector-site-type",
    relation: "CONFLIT MÉTIER",
    justification: "Commerce site types S03 and S04 are offered only for the PME sector.",
  },
  {
    id: "sector-module-ownership",
    relation: "CONFLIT MÉTIER",
    justification: "A sector module cannot be selected for another sector.",
  },
] as const;

const SECTOR_MODULE_ORDER = Object.values(SECTOR_MODULES)
  .flat()
  .map((item) => item.id);

function isReferenceSelected(
  selection: CompatibilitySelection,
  reference: OptionReference
): boolean {
  if (reference.kind === "siteType") return selection.siteType === reference.id;
  if (reference.kind === "multiplier") {
    return selection.selectedMultipliers.includes(reference.id as MultiplierId);
  }
  return selection.selectedSectorModules.includes(reference.id as SectorModuleId);
}

function sameReference(
  kind: SelectableOptionKind,
  id: string,
  reference: OptionReference
): boolean {
  return reference.kind === kind && reference.id === id;
}

export function isSiteTypeAllowed(sector: Sector, siteType: SiteTypeId): boolean {
  return SITE_TYPES_BY_SECTOR[sector].includes(siteType);
}

export function normalizeCompatibleSelection<T extends CompatibilitySelection>(
  selection: T
): T {
  const rules = [...REPLACEMENT_RULES, ...INCLUSION_RULES];
  let multipliers = ADDITIVE_IDS.filter((id) =>
    selection.selectedMultipliers.includes(id)
  ) as MultiplierId[];
  let modules = SECTOR_MODULE_ORDER.filter((id) =>
    selection.selectedSectorModules.includes(id)
  ) as SectorModuleId[];

  // Point fixe : une option retirée ne peut plus en bloquer une autre, et une
  // règle en cascade s'applique jusqu'à stabilisation de la sélection.
  for (let pass = 0; pass < rules.length; pass++) {
    const current = { ...selection, selectedMultipliers: multipliers, selectedSectorModules: modules };
    const blockedMultipliers = new Set<MultiplierId>();
    const blockedModules = new Set<SectorModuleId>();

    for (const rule of rules) {
      if (!isReferenceSelected(current, rule.source)) continue;
      if (rule.target.kind === "multiplier") {
        blockedMultipliers.add(rule.target.id as MultiplierId);
      } else if (rule.target.kind === "sectorModule") {
        blockedModules.add(rule.target.id as SectorModuleId);
      }
    }

    const nextMultipliers = multipliers.filter((id) => !blockedMultipliers.has(id));
    const nextModules = modules.filter((id) => !blockedModules.has(id));
    const stable =
      nextMultipliers.length === multipliers.length &&
      nextModules.length === modules.length;
    multipliers = nextMultipliers;
    modules = nextModules;
    if (stable) break;
  }

  return {
    ...selection,
    selectedMultipliers: multipliers,
    selectedSectorModules: modules,
  } as T;
}

export type AvailabilityReason = "replacedBySpecialized" | "includedElsewhere";

export function getOptionAvailability(
  selection: CompatibilitySelection,
  kind: SelectableOptionKind,
  id: string
): { disabled: boolean; reason?: AvailabilityReason; blockingOptionId?: string } {
  for (const rule of REPLACEMENT_RULES) {
    if (sameReference(kind, id, rule.target) && isReferenceSelected(selection, rule.source)) {
      return {
        disabled: true,
        reason: "replacedBySpecialized",
        blockingOptionId: rule.source.id,
      };
    }
  }

  for (const rule of INCLUSION_RULES) {
    if (sameReference(kind, id, rule.target) && isReferenceSelected(selection, rule.source)) {
      return {
        disabled: true,
        reason: "includedElsewhere",
        blockingOptionId: rule.source.id,
      };
    }
  }

  return { disabled: false };
}
