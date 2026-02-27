import type {
  SiteTypeId,
  SocleAddonId,
  MultiplierItem,
  SectorModule,
  MaintenanceTier,
  MaintenanceTierId,
  RecurringServiceId,
  ThirdPartyCostId,
  Sector,
  PriceRange,
} from "./types";

// ══════════════════════════════════════════════════════════════════
// COUCHE 1 — SOCLE COMMUN (Réalisation initiale)
// ══════════════════════════════════════════════════════════════════

export const SOCLE_ITEMS: Record<SiteTypeId, PriceRange> = {
  S01: { min: 2_500, max: 6_000 },    // Site vitrine 1-5 pages
  S02: { min: 5_000, max: 15_000 },   // Site vitrine 6-15 pages
  S03: { min: 8_000, max: 25_000 },   // E-commerce base <100 produits
  S04: { min: 20_000, max: 50_000 },  // E-commerce avancé 100+
  S05: { min: 25_000, max: 80_000 },  // Plateforme sur mesure
  S06: { min: 1_200, max: 3_500 },    // Landing page
};

export const SOCLE_ADDONS: Record<SocleAddonId, PriceRange> = {
  S07: { min: 300, max: 800 },      // Design UI/UX (par page)
  S08: { min: 150, max: 400 },      // Rédaction pro (par page)
  S09: { min: 1_500, max: 4_000 },  // SEO technique de base
  S10: { min: 500, max: 1_500 },    // Photographie pro (demi-journée)
  S11: { min: 2_000, max: 8_000 },  // Vidéo corporative
  S12: { min: 800, max: 5_000 },    // Logo / identité visuelle
};

// ══════════════════════════════════════════════════════════════════
// COUCHE 2 — MULTIPLICATEURS DE COMPLEXITÉ
// ══════════════════════════════════════════════════════════════════

export const MULTIPLIERS: Record<string, MultiplierItem> = {
  M01: { id: "M01", type: "multiplicateur", value: { min: 1.4, max: 1.6 } },   // Bilingue FR/EN
  M02: { id: "M02", type: "multiplicateur", value: { min: 1.8, max: 2.2 } },   // Multilingue 3+
  M03: { id: "M03", type: "ajout_fixe", value: { min: 2_000, max: 8_000 } },   // Réservation en ligne
  M04: { id: "M04", type: "ajout_fixe", value: { min: 3_000, max: 15_000 } },  // Portail client
  M05: { id: "M05", type: "ajout_fixe", value: { min: 1_500, max: 5_000 } },   // Intégration CRM
  M06: { id: "M06", type: "ajout_fixe", value: { min: 2_000, max: 10_000 } },  // Chatbot IA
  M07: { id: "M07", type: "ajout_fixe", value: { min: 1_500, max: 5_000 } },   // Accessibilité SGQRI
  M08: { id: "M08", type: "ajout_fixe", value: { min: 1_000, max: 3_000 } },   // Loi 25
  M09: { id: "M09", type: "ajout_fixe", value: { min: 1_000, max: 4_000 } },   // Formulaires complexes
  M10: { id: "M10", type: "ajout_fixe", value: { min: 1_000, max: 5_000 } },   // Migration données
  M11: { id: "M11", type: "ajout_fixe", value: { min: 500, max: 2_000 } },     // Paiement en ligne
  M12: { id: "M12", type: "ajout_fixe", value: { min: 1_500, max: 5_000 } },   // Animations avancées
  M13: { id: "M13", type: "multiplicateur", value: { min: 1.3, max: 1.5 } },   // Urgence < 4 sem
};

// IDs des multiplicateurs de type "multiplicateur" (appliqués en chaîne)
export const MULTIPLICATIVE_IDS = ["M01", "M02", "M13"] as const;
// IDs des multiplicateurs de type "ajout_fixe" (additionnés après)
export const ADDITIVE_IDS = ["M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12"] as const;

// ══════════════════════════════════════════════════════════════════
// COUCHE 3 — MODULES SECTORIELS
// ══════════════════════════════════════════════════════════════════

export const SECTOR_MODULES: Record<Sector, SectorModule[]> = {
  JUR: [
    { id: "JUR01", price: { min: 500, max: 1_500 } },    // Conformité Barreau QC
    { id: "JUR02", price: { min: 800, max: 2_000 } },    // Architecture domaines pratique
    { id: "JUR03", price: { min: 5_000, max: 15_000 } }, // Portail client confidentiel
    { id: "JUR04", price: { min: 1_500, max: 4_000 } },  // Blog juridique + infolettres
    { id: "JUR05", price: { min: 2_000, max: 6_000 } },  // SEO juridique local
    { id: "JUR06", price: { min: 2_000, max: 8_000 } },  // Intégration Clio
  ],
  MED: [
    { id: "MED01", price: { min: 3_000, max: 10_000 } }, // Prise de RDV en ligne
    { id: "MED02", price: { min: 2_000, max: 5_000 } },  // Conformité Loi 25 santé
    { id: "MED03", price: { min: 5_000, max: 20_000 } }, // Portail patient sécurisé
    { id: "MED04", price: { min: 5_000, max: 15_000 } }, // Intégration DME
    { id: "MED05", price: { min: 1_500, max: 4_000 } },  // Contenu éducatif patients
    { id: "MED06", price: { min: 1_500, max: 4_000 } },  // Multi-praticiens
  ],
  PRO: [
    { id: "PRO01", price: { min: 500, max: 2_000 } },    // Conformité ordre pro
    { id: "PRO02", price: { min: 2_000, max: 8_000 } },  // Calculateurs/simulateurs
    { id: "PRO03", price: { min: 2_000, max: 10_000 } }, // Intégration logiciel métier
    { id: "PRO04", price: { min: 3_000, max: 10_000 } }, // Portail documents clients
    { id: "PRO05", price: { min: 1_500, max: 5_000 } },  // Système soumission en ligne
  ],
  PME: [
    { id: "PME01", price: { min: 1_500, max: 4_000 } },  // Catalogue produits/services
    { id: "PME02", price: { min: 1_000, max: 3_000 } },  // Formulaire soumission
    { id: "PME03", price: { min: 500, max: 1_500 } },    // Google Business/Maps/avis
    { id: "PME04", price: { min: 800, max: 2_500 } },    // Section carrières
    { id: "PME05", price: { min: 1_500, max: 5_000 } },  // Menu en ligne/commande
    { id: "PME06", price: { min: 800, max: 2_500 } },    // Galerie portfolio
    { id: "PME07", price: { min: 500, max: 1_500 } },    // Intégration réseaux sociaux
  ],
};

// ══════════════════════════════════════════════════════════════════
// COUCHE 4A — FORFAITS MAINTENANCE (mensuel)
// ══════════════════════════════════════════════════════════════════

export const MAINTENANCE_TIERS: Record<MaintenanceTierId, MaintenanceTier> = {
  ABN00: { id: "ABN00", price: { min: 50, max: 75 } },     // Micro
  ABN01: { id: "ABN01", price: { min: 75, max: 150 } },    // Essentiel
  ABN02: { id: "ABN02", price: { min: 150, max: 350 } },   // Standard
  ABN03: { id: "ABN03", price: { min: 350, max: 750 } },   // Premium
  ABN04: { id: "ABN04", price: { min: 750, max: 2_000 } }, // Entreprise
};

// Mapping scénario → forfait maintenance
export const SCENARIO_MAINTENANCE: Record<string, MaintenanceTierId> = {
  eco: "ABN01",     // Essentiel
  rec: "ABN02",     // Standard
  premium: "ABN03", // Premium
};

// ══════════════════════════════════════════════════════════════════
// COUCHE 4B — SERVICES RÉCURRENTS OPTIONNELS (mensuel)
// ══════════════════════════════════════════════════════════════════

export const RECURRING_SERVICES: Record<RecurringServiceId, PriceRange> = {
  REC01: { min: 500, max: 2_500 },  // SEO continu
  REC02: { min: 500, max: 2_000 },  // Gestion réseaux sociaux
  REC03: { min: 500, max: 1_500 },  // Publicité numérique
  REC04: { min: 200, max: 800 },    // Infolettre
  REC05: { min: 100, max: 500 },    // Chatbot IA (opération)
  REC06: { min: 200, max: 600 },    // Analyse/rapport analytique
  REC07: { min: 85, max: 200 },     // Support technique étendu (/h)
};

// ══════════════════════════════════════════════════════════════════
// COUCHE 4C — COÛTS TIERS RÉCURRENTS (mensuel, payés par client)
// ══════════════════════════════════════════════════════════════════

export const THIRD_PARTY_COSTS: Record<ThirdPartyCostId, PriceRange> = {
  TIR01: { min: 15, max: 150 },  // Hébergement web
  TIR02: { min: 1, max: 4 },     // Nom de domaine
  TIR03: { min: 5, max: 50 },    // Licence thème/plugin
  TIR04: { min: 0, max: 100 },   // Plateforme email
  TIR05: { min: 0, max: 150 },   // CRM
  TIR06: { min: 0, max: 50 },    // Réservation en ligne
  TIR07: { min: 45, max: 400 },  // E-commerce (Shopify)
  TIR08: { min: 0, max: 25 },    // CDN / sécurité
  TIR09: { min: 0, max: 50 },    // Stockage / media
};

// Baseline coûts tiers (hébergement + domaine + CDN) — toujours inclus
export const BASELINE_THIRD_PARTY: ThirdPartyCostId[] = ["TIR01", "TIR02", "TIR08"];
