/**
 * Recommandation de la formule mensuelle à partir des réponses.
 * Toute la correspondance vient de ./donnees.ts : ce fichier ne contient
 * aucun prix ni aucun classement d'option.
 */

import {
  CORRESPONDANCE_SITE,
  EFFET_OPTIONS,
  FORMULES,
  LANGUE_A_CHIFFRER,
  PRIX_FIXES_LE,
  type EffetOption,
  type FormuleId,
  type RaisonId,
} from "./donnees";
import type {
  LanguageMode,
  MultiplierId,
  Sector,
  SectorModuleId,
  SiteTypeId,
} from "@/lib/engine/types";

export interface SelectionFormule {
  sector: Sector;
  siteType: SiteTypeId;
  multipliers: MultiplierId[];
  sectorModules: SectorModuleId[];
  languageMode: LanguageMode;
}

/** Élément listé dans « À chiffrer avec vous, en plus de la formule ». */
export type ElementAChiffrer =
  | { kind: "multiplier"; id: MultiplierId }
  | { kind: "sectorModule"; id: SectorModuleId }
  | { kind: "langue" };

/** Ce qui fait monter la formule, et jusqu'où. */
export interface Declencheur {
  formule: FormuleId;
  raison: RaisonId;
}

export type ResultatFormule =
  | {
      kind: "formule";
      selection: SelectionFormule;
      formule: FormuleId;
      declencheurs: Declencheur[];
      aChiffrer: ElementAChiffrer[];
      /** Vitrine 6-15 pages : rappeler que de 11 à 15 pages, c'est Croissance. */
      noteCroissance11a15: boolean;
    }
  | {
      kind: "soumission";
      selection: SelectionFormule;
    };

export const ORDRE_FORMULES: readonly FormuleId[] = FORMULES.map((f) => f.id);

export function rangFormule(id: FormuleId): number {
  return ORDRE_FORMULES.indexOf(id);
}

export function getFormule(id: FormuleId) {
  return FORMULES.find((f) => f.id === id)!;
}

/** Effet d'une option; une option non classée est « à chiffrer ». */
export function effetOption(id: MultiplierId | SectorModuleId): EffetOption {
  return EFFET_OPTIONS[id] ?? { effet: "aChiffrer" };
}

/**
 * Formule du type de site seul (null : sur soumission). Sert d'indice dans
 * l'étape « type de site ».
 */
export function formuleDuSite(siteType: SiteTypeId): FormuleId | null {
  const c = CORRESPONDANCE_SITE[siteType];
  return c.formule === "soumission" ? null : c.formule;
}

export function recommanderFormule(selection: SelectionFormule): ResultatFormule {
  const site = CORRESPONDANCE_SITE[selection.siteType];
  if (site.formule === "soumission") {
    return { kind: "soumission", selection };
  }

  const declencheurs: Declencheur[] = [];
  if (site.raison) declencheurs.push({ formule: site.formule, raison: site.raison });

  const aChiffrer: ElementAChiffrer[] = [];
  const options: ElementAChiffrer[] = [
    ...selection.multipliers.map((id) => ({ kind: "multiplier" as const, id })),
    ...selection.sectorModules.map((id) => ({ kind: "sectorModule" as const, id })),
  ];
  for (const option of options) {
    if (option.kind === "langue") continue;
    const effet = effetOption(option.id);
    if (effet.effet === "monte") {
      declencheurs.push({ formule: effet.formule, raison: effet.raison });
    } else if (effet.effet === "aChiffrer") {
      aChiffrer.push(option);
    }
  }
  if (selection.languageMode === LANGUE_A_CHIFFRER) aChiffrer.push({ kind: "langue" });

  const rang = Math.max(
    rangFormule(site.formule),
    ...declencheurs.map((d) => rangFormule(d.formule))
  );

  return {
    kind: "formule",
    selection,
    formule: ORDRE_FORMULES[rang],
    declencheurs,
    aChiffrer,
    noteCroissance11a15: Boolean(site.noteCroissance11a15),
  };
}

/**
 * Raisons pour lesquelles une formule ne couvre pas le projet : les
 * déclencheurs qui exigent une formule plus grande. Sans doublon.
 */
export function raisonsNonCouvertes(
  resultat: Extract<ResultatFormule, { kind: "formule" }>,
  formule: FormuleId
): RaisonId[] {
  const rang = rangFormule(formule);
  const raisons = resultat.declencheurs
    .filter((d) => rangFormule(d.formule) > rang)
    .map((d) => d.raison);
  return [...new Set(raisons)];
}

/** Date à laquelle les prix ont été fixés, dans la langue de l'affichage. */
export function formatDatePrixFixes(locale: "fr" | "en"): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${PRIX_FIXES_LE}T12:00:00Z`));
}
