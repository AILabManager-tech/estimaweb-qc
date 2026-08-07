# Matrice de validation des calculs

Date : 7 août 2026 (révision après audit de fiabilité)

## Méthode

Les résultats attendus ci-dessous ont été recalculés indépendamment à partir des valeurs inchangées de `matrix.ts`, puis codés en dur dans les tests. Le schéma Zod normalise les remplacements et inclusions avant que le calculateur applique :

`socle + complexité/fonctionnalités + modules + imprévus de 15 % = réalisation; mensuel; année 1`

Les colonnes observées proviennent de `calculateEstimation`. Les parcours commerce FR et application EN sont aussi vérifiés dans l’interface et dans un PDF réel.

Abréviations : `Éco` économique, `Rec` recommandé, `Pre` premium.

## Table de vérité

| Cas | Entrées normalisées | Niveau | Attendu | Observé réalisation / mois / année 1 | Statut |
|---|---|---:|---|---|---|
| Petit vitrine | PME, S01, une langue, aucune option | Éco | `2 500 + 0 + 0 + 375 = 2 875; 91; 3 967` | `2 875 / 91 / 3 967` | Conforme |
|  |  | Rec | `4 250 + 0 + 0 + 638 = 4 888; 211; 7 420` | `4 888 / 211 / 7 420` | Conforme |
|  |  | Pre | `6 000 + 0 + 0 + 900 = 6 900; 329; 10 848` | `6 900 / 329 / 10 848` | Conforme |
| Site bilingue | JUR, S02, exactement deux langues | Éco | `5 000 + 2 000 + 0 + 1 050 = 8 050; 166; 10 042` | `8 050 / 166 / 10 042` | Conforme |
|  |  | Rec | `10 000 + 5 000 + 0 + 2 250 = 17 250; 348; 21 426` | `17 250 / 348 / 21 426` | Conforme |
|  |  | Pre | `15 000 + 9 000 + 0 + 3 600 = 27 600; 529; 33 948` | `27 600 / 529 / 33 948` | Conforme |
| Minimum | PME, S06, une langue, aucune option | Éco | `1 200 + 0 + 0 + 180 = 1 380; 66; 2 172` | `1 380 / 66 / 2 172` | Conforme |
|  |  | Rec | `2 350 + 0 + 0 + 353 = 2 703; 161; 4 635` | `2 703 / 161 / 4 635` | Conforme |
|  |  | Pre | `3 500 + 0 + 0 + 525 = 4 025; 254; 7 073` | `4 025 / 254 / 7 073` | Conforme |
| Multilingue urgent | PME, S06, trois langues ou plus, urgent | Éco | `1 200 + 1 608 + 0 + 421 = 3 229; 66; 4 021` | `3 229 / 66 / 4 021` | Conforme |
|  |  | Rec | `2 350 + 4 230 + 0 + 987 = 7 567; 161; 9 499` | `7 567 / 161 / 9 499` | Conforme |
|  |  | Pre | `3 500 + 8 050 + 0 + 1 733 = 13 283; 254; 16 331` | `13 283 / 254 / 16 331` | Conforme |
| Commerce contrôlé | PME, S03, M03 + PME03, bilingue; M11 fourni puis normalisé | Éco | `8 000 + 5 200 + 500 + 2 055 = 15 755; 166; 17 747` | `15 755 / 166 / 17 747` | Conforme UI/PDF |
|  |  | Rec | `16 500 + 13 250 + 1 000 + 4 613 = 35 363; 348; 39 539` | `35 363 / 348 / 39 539` | Conforme UI/PDF |
|  |  | Pre | `25 000 + 23 000 + 1 500 + 7 425 = 56 925; 529; 63 273` | `56 925 / 529 / 63 273` | Conforme UI/PDF |
| Application/intégrations | PRO, S05, M04 + M05 + PRO03 | Éco | `25 000 + 4 500 + 2 000 + 4 725 = 36 225; 366; 40 617` | `36 225 / 366 / 40 617` | Conforme PDF |
|  |  | Rec | `52 500 + 12 250 + 6 000 + 10 613 = 81 363; 648; 89 139` | `81 363 / 648 / 89 139` | Conforme UI/PDF |
|  |  | Pre | `80 000 + 20 000 + 10 000 + 16 500 = 126 500; 929; 137 648` | `126 500 / 929 / 137 648` | Conforme PDF |
| Maximum normalisé | MED, S05, M03-M12, MED01-MED06, multilingue, urgent; M03/M04/M08 retirés | Éco | `25 000 + 42 500 + 18 000 + 12 825 = 98 325; 366; 102 717` | `98 325 / 366 / 102 717` | Conforme PDF |
|  |  | Rec | `52 500 + 117 000 + 38 000 + 31 125 = 238 625; 648; 246 401` | `238 625 / 648 / 246 401` | Conforme PDF |
|  |  | Pre | `80 000 + 220 000 + 58 000 + 53 700 = 411 700; 929; 422 848` | `411 700 / 929 / 422 848` | Conforme PDF |

## Preuve de suppression des doubles comptages

| Entrée brute | Normalisation attendue | Résultat observé | Statut |
|---|---|---|---|
| MED + M03 + MED01 | Retire M03, conserve MED01 | Identique à MED01 seul | Conforme |
| JUR + M04 + JUR03 | Retire M04, conserve JUR03 | Identique à JUR03 seul | Conforme |
| MED + M08 + MED02 | Retire M08, conserve MED02 | Identique à MED02 seul | Conforme |
| PME + M09 + PME02 | Retire M09, conserve PME02 | Identique à PME02 seul | Conforme |
| PRO + M09 + PRO05 | Retire M09, conserve PRO05 | Identique à PRO05 seul | Conforme |
| PME + S03 + PME01 + PME05 + M11 | Retire les trois capacités déjà incluses dans S03 | Identique à S03 seul | Conforme |
| PME + S01 + PME05 + M11 | Retire M11, conserve PME05 | Identique à PME05 seul | Conforme |
| PME + S01 + PME05 + PME01 | Retire PME01, conserve PME05 | Identique à PME05 seul | Conforme |

Les 15 règles de remplacement/inclusion sont testées une par une. Les 17 cumuls explicitement autorisés sont aussi soumis au calculateur et les deux options doivent subsister. La suppression de n'importe laquelle de ces règles fait échouer la suite.

## Récurrents par type de site

Le forfait de maintenance suit l'ampleur du projet; le scénario ne choisit que le percentile à l'intérieur du forfait, comme pour tous les autres postes. Les coûts tiers de base (16 / 98 / 179) restent identiques pour tous les projets.

| Type de site | Forfait | Mensuel éco | Mensuel rec | Mensuel premium |
|---|---|---:|---:|---:|
| S06 Landing page | ABN00 (50-75) | 66 | 161 | 254 |
| S01 Vitrine 1-5 pages | ABN01 (75-150) | 91 | 211 | 329 |
| S02 Vitrine 6-15 pages | ABN02 (150-350) | 166 | 348 | 529 |
| S03 E-commerce base | ABN02 (150-350) | 166 | 348 | 529 |
| S04 E-commerce avancé | ABN03 (350-750) | 366 | 648 | 929 |
| S05 Plateforme sur mesure | ABN03 (350-750) | 366 | 648 | 929 |

ABN04 (entreprise) reste hors périmètre de l'estimateur.

### Plausibilité vérifiée

Sur les 18 combinaisons secteur × type, projet nu, le récurrent annuel reste inférieur à la réalisation dans les trois scénarios. Ratio maximal observé : **0,76** (landing page premium). Avant la révision du 7 août 2026, ce ratio atteignait **2,77** : une landing page facturée 4 025 $ recevait 11 148 $ de récurrent annuel. Cet invariant est verrouillé par un test automatisé.

## Cas non représentables

| Demande | Résultat attendu | Résultat observé | Statut |
|---|---|---|---|
| Projet avec design explicite | Option et coût dédiés | S07 existe, mais reste inactif | Non représentable, volontaire |
| Projet avec contenu explicite | Option et coût dédiés | S08 existe, mais reste inactif | Non représentable, volontaire |
| Maintenance choisie par l’utilisateur | Niveau sélectionnable | Niveau déterminé par le type de site | Non représentable, volontaire |
| Commerce avec licence Shopify/TIR07 | Dépendance automatique | TIR07 défini mais jamais ajouté | Non activé; aucun fournisseur imposé |
| Taxes | Montant fiscal selon lieu | Aucune taxe calculée | Exclusion métier définitive |

## Invariants automatisés

- Entrées inconnues, dupliquées, hors secteur ou secteur/type incohérent : rejet Zod.
- L’ancien objet à deux booléens linguistiques : rejet strict.
- Un seul enum `languageMode` : `single`, `bilingual` ou `multilingual`.
- Remplacements et inclusions : normalisés avant toute somme.
- Ordre des identifiants : canonique et déterministe.
- Valeurs négatives, infinies ou `NaN` : aucune dans les 18 combinaisons secteur × type valides au maximum normalisé.
- `mensuel = maintenance + tiers`.
- `récurrent annuel = mensuel × 12`.
- `année 1 = réalisation + récurrent annuel`.
- Les mêmes entrées donnent les mêmes nombres en FR et EN; seule la présentation change.
- La somme des quatre lignes affichées (socle, complexité, modules, marge) égale exactement le total de réalisation montré, sur les 18 combinaisons secteur × type au maximum normalisé, dans les trois modes linguistiques et avec ou sans urgence.
- Toute plage de la grille a une moyenne entière : c'est le prérequis de l'invariant précédent, désormais testé pour empêcher qu'un futur montant impair désaligne silencieusement le total et ses lignes.
- Le récurrent annuel reste inférieur à la réalisation sur tout le catalogue.
- La normalisation est idempotente : renormaliser une sélection déjà normalisée ne change rien.
- Une option masquée par un choix ultérieur est restituée si ce choix est abandonné; le wizard conserve l'intention de l'utilisateur et ne normalise qu'à l'affichage et au calcul.
