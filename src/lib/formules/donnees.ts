/**
 * ═══════════════════════════════════════════════════════════════════
 *  FORMULES D'ABONNEMENT — SOURCE UNIQUE
 * ═══════════════════════════════════════════════════════════════════
 *
 * Ce fichier est la seule source des prix et de la correspondance entre
 * les réponses de l'assistant et la formule mensuelle recommandée.
 * Pour ajuster une formule, un prix ou le classement d'une option,
 * on modifie ce fichier et rien d'autre (les textes affichés, eux,
 * sont dans messages/fr.json et messages/en.json, sous « formules »).
 *
 * Source des prix : la page d'offre d'Auxo Systems, prix fixés le
 * 7 octobre 2026. Engagement de 36 mois, avant taxes, en dollars
 * canadiens, 0 $ de frais de départ.
 *
 * Le moteur ponctuel (src/lib/engine) n'est pas utilisé ici : il reste
 * la grille officielle interne.
 */

import type { MultiplierId, SectorModuleId, SiteTypeId } from "@/lib/engine/types";

// ── Les trois formules, de la plus petite à la plus grande ──────────
// L'ordre du tableau fait foi : une formule « monte » vers la suivante.
export const FORMULES = [
  { id: "depart", prixMensuel: 249, pagesMax: 5 },
  { id: "pro", prixMensuel: 399, pagesMax: 10 },
  { id: "croissance", prixMensuel: 899, pagesMax: 15 },
] as const;

export type FormuleId = (typeof FORMULES)[number]["id"];

/** Conditions communes à toutes les formules. */
export const ENGAGEMENT_MOIS = 36;
export const FRAIS_DE_DEPART = 0;
/** Date à laquelle Auxo Systems a fixé ces prix (affichée dans les notes). */
export const PRIX_FIXES_LE = "2026-10-07";

// ── Raisons pour lesquelles une formule ne suffit pas ───────────────
// Chaque raison a un texte court dans messages/*.json, sous
// « formules.raisons.<clé> » (ex. « l'outil interactif »). Il s'affiche
// sur les formules trop petites : « ne couvre pas : … ».
export type RaisonId =
  | "plusDe5Pages"
  | "animations"
  | "googleBusiness"
  | "outilInteractif"
  | "priseDeRendezVous"
  | "suiviSeo";

// ── Type de site → formule de départ ────────────────────────────────
// « soumission » : le projet dépasse les formules; aucun prix affiché,
// Auxo le chiffre avec le client.
export type CorrespondanceSite =
  | { formule: FormuleId; raison?: RaisonId; noteCroissance11a15?: boolean }
  | { formule: "soumission" };

export const CORRESPONDANCE_SITE: Record<SiteTypeId, CorrespondanceSite> = {
  S06: { formule: "depart" }, // Landing page
  S01: { formule: "depart" }, // Vitrine 1 à 5 pages
  // Vitrine 6 à 15 pages : Pro (jusqu'à 10 pages). On précise à l'écran
  // que de 11 à 15 pages, c'est la formule Croissance.
  S02: { formule: "pro", raison: "plusDe5Pages", noteCroissance11a15: true },
  S03: { formule: "soumission" }, // E-commerce basique
  S04: { formule: "soumission" }, // E-commerce avancé
  S05: { formule: "soumission" }, // Plateforme sur mesure
};

// ── Options de l'assistant → effet sur la formule ───────────────────
// - « monte »    : la formule recommandée est au moins celle indiquée;
// - « comprise » : déjà incluse dans toute formule, aucun effet;
// - « aChiffrer »: la formule reste affichée, l'option est listée dans
//   « À chiffrer avec vous, en plus de la formule ».
// Une option absente de cette table est traitée comme « aChiffrer ».
export type EffetOption =
  | { effet: "monte"; formule: FormuleId; raison: RaisonId }
  | { effet: "comprise" }
  | { effet: "aChiffrer" };

type OptionId = MultiplierId | SectorModuleId;

const MONTE_PRO = (raison: RaisonId): EffetOption => ({ effet: "monte", formule: "pro", raison });
const MONTE_CROISSANCE = (raison: RaisonId): EffetOption => ({
  effet: "monte",
  formule: "croissance",
  raison,
});
const COMPRISE: EffetOption = { effet: "comprise" };
const A_CHIFFRER: EffetOption = { effet: "aChiffrer" };

export const EFFET_OPTIONS: Partial<Record<OptionId, EffetOption>> = {
  // Monte à Pro au minimum
  M12: MONTE_PRO("animations"), //          Animations avancées
  PME03: MONTE_PRO("googleBusiness"), //    Google Business / Maps / avis

  // Monte à Croissance
  PRO02: MONTE_CROISSANCE("outilInteractif"), //   Calculateurs / simulateurs
  M03: MONTE_CROISSANCE("priseDeRendezVous"), //   Réservation en ligne
  MED01: MONTE_CROISSANCE("priseDeRendezVous"), // Prise de RDV en ligne
  JUR05: MONTE_CROISSANCE("suiviSeo"), //          SEO juridique local → suivi SEO continu

  // Comprises dans toute formule
  M08: COMPRISE, //   Loi 25
  MED02: COMPRISE, // Loi 25 données santé
  JUR01: COMPRISE, // Conformité Barreau
  JUR02: COMPRISE, // Architecture domaines de pratique
  JUR04: COMPRISE, // Blog juridique + infolettres
  MED05: COMPRISE, // Contenu éducatif patients
  MED06: COMPRISE, // Multi-praticiens
  PRO01: COMPRISE, // Conformité ordre professionnel
  PME01: COMPRISE, // Catalogue produits/services
  PME04: COMPRISE, // Section carrières
  PME06: COMPRISE, // Galerie portfolio
  PME07: COMPRISE, // Intégration réseaux sociaux

  // À chiffrer à part, en plus de la formule
  M04: A_CHIFFRER, //   Portail client
  M05: A_CHIFFRER, //   Intégration CRM
  M06: A_CHIFFRER, //   Chatbot IA (Auxo offre aussi des agents IA)
  M07: A_CHIFFRER, //   Accessibilité SGQRI 008
  M09: A_CHIFFRER, //   Formulaires complexes
  M10: A_CHIFFRER, //   Migration de données
  M11: A_CHIFFRER, //   Paiement en ligne
  JUR03: A_CHIFFRER, // Portail client confidentiel
  JUR06: A_CHIFFRER, // Intégration Clio
  MED03: A_CHIFFRER, // Portail patient sécurisé
  MED04: A_CHIFFRER, // Intégration DME
  PRO03: A_CHIFFRER, // Intégration logiciel métier
  PRO04: A_CHIFFRER, // Portail documents clients
  PRO05: A_CHIFFRER, // Système de soumission en ligne
  PME02: A_CHIFFRER, // Formulaire de soumission
  PME05: A_CHIFFRER, // Menu en ligne / commande
};

/** Options pour lesquelles on rappelle qu'Auxo offre aussi des agents IA. */
export const OPTIONS_AGENTS_IA: readonly OptionId[] = ["M06"];

// ── Langues ─────────────────────────────────────────────────────────
// Une langue ou français + anglais : compris. Trois langues ou plus :
// à chiffrer à part.
export const LANGUE_A_CHIFFRER = "multilingual" as const;

// Neuf ou refonte : même prix. Urgence : aucun effet. Ces deux questions
// ne sont donc plus posées par l'assistant.
