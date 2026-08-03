# Matrice de validation des calculs

Date : 3 août 2026

## Méthode

Les résultats attendus ci-dessous ont été recalculés indépendamment à partir des valeurs de `matrix.ts`, puis codés en dur dans les tests. Chaque ligne utilise :

`socle + complexité/fonctionnalités + modules + imprévus = réalisation; mensuel; année 1`

Les colonnes « observé » proviennent de `calculateEstimation`; les scénarios commerce FR et application EN ont aussi été comparés à l’interface et au PDF.

Abréviations : `Éco` économique, `Rec` recommandé, `Pre` premium.

## Table de vérité

| Cas | Entrées | Niveau | Attendu | Observé (réalisation / mois / année 1) | Statut |
|---|---|---:|---|---|---|
| Petit vitrine | PME, S01, aucune option | Éco | `2 500 + 0 + 0 + 375 = 2 875; 91; 3 967` | `2 875 / 91 / 3 967` | Conforme |
|  |  | Rec | `4 250 + 0 + 0 + 638 = 4 888; 348; 9 064` | `4 888 / 348 / 9 064` | Conforme |
|  |  | Pre | `6 000 + 0 + 0 + 900 = 6 900; 929; 18 048` | `6 900 / 929 / 18 048` | Conforme |
| Site bilingue | JUR, S02, bilingue | Éco | `5 000 + 2 000 + 0 + 1 050 = 8 050; 91; 9 142` | `8 050 / 91 / 9 142` | Conforme |
|  |  | Rec | `10 000 + 5 000 + 0 + 2 250 = 17 250; 348; 21 426` | `17 250 / 348 / 21 426` | Conforme |
|  |  | Pre | `15 000 + 9 000 + 0 + 3 600 = 27 600; 929; 38 748` | `27 600 / 929 / 38 748` | Conforme |
| Minimum | PME, S06, aucune option | Éco | `1 200 + 0 + 0 + 180 = 1 380; 91; 2 472` | `1 380 / 91 / 2 472` | Conforme |
|  |  | Rec | `2 350 + 0 + 0 + 353 = 2 703; 348; 6 879` | `2 703 / 348 / 6 879` | Conforme |
|  |  | Pre | `3 500 + 0 + 0 + 525 = 4 025; 929; 15 173` | `4 025 / 929 / 15 173` | Conforme |
| Combinaison inhabituelle | PME, S06, bilingue + multilingue + urgent | Éco | `1 200 + 2 731 + 0 + 590 = 4 521; 91; 5 613` | `4 521 / 91 / 5 613` | Conforme à la logique actuelle |
|  |  | Rec | `2 350 + 7 520 + 0 + 1 481 = 11 351; 348; 15 527` | `11 351 / 348 / 15 527` | Conforme à la logique actuelle |
|  |  | Pre | `3 500 + 14 980 + 0 + 2 772 = 21 252; 929; 32 400` | `21 252 / 929 / 32 400` | Conforme à la logique actuelle |
| Commerce contrôlé | PME, S03, M03 + M11 + PME03, bilingue | Éco | `8 000 + 5 700 + 500 + 2 130 = 16 330; 91; 17 422` | `16 330 / 91 / 17 422` | Conforme UI/PDF |
|  |  | Rec | `16 500 + 14 500 + 1 000 + 4 800 = 36 800; 348; 40 976` | `36 800 / 348 / 40 976` | Conforme UI/PDF |
|  |  | Pre | `25 000 + 25 000 + 1 500 + 7 725 = 59 225; 929; 70 373` | `59 225 / 929 / 70 373` | Conforme UI/PDF |
| Application/intégrations | PRO, S05, M04 + M05 + PRO03 | Éco | `25 000 + 4 500 + 2 000 + 4 725 = 36 225; 91; 37 317` | `36 225 / 91 / 37 317` | Conforme PDF |
|  |  | Rec | `52 500 + 12 250 + 6 000 + 10 613 = 81 363; 348; 85 539` | `81 363 / 348 / 85 539` | Conforme UI/PDF |
|  |  | Pre | `80 000 + 20 000 + 10 000 + 16 500 = 126 500; 929; 137 648` | `126 500 / 929 / 137 648` | Conforme PDF |
| Maximum sélectionnable | MED, S05, M03–M12, MED01–MED06, trois drapeaux | Éco | `25 000 + 71 900 + 18 000 + 17 235 = 132 135; 91; 133 227` | `132 135 / 91 / 133 227` | Conforme PDF |
|  |  | Rec | `52 500 + 206 500 + 38 000 + 44 550 = 341 550; 348; 345 726` | `341 550 / 348 / 345 726` | Conforme PDF |
|  |  | Pre | `80 000 + 404 400 + 58 000 + 81 360 = 623 760; 929; 634 908` | `623 760 / 929 / 634 908` | Conforme PDF |

## Récurrents fixes par scénario

| Niveau | Maintenance | Tiers de base | Mensuel | Annuel |
|---|---:|---:|---:|---:|
| Économique | 75 | 16 | 91 | 1 092 |
| Recommandé | 250 | 98 | 348 | 4 176 |
| Premium | 750 | 179 | 929 | 11 148 |

Ces montants sont identiques pour tous les types de projets. Ils ne dépendent pas des fonctionnalités sélectionnées.

## Cas non représentables

| Demande | Résultat attendu | Résultat observé | Statut |
|---|---|---|---|
| Projet avec design explicite | Option et coût dédiés | Aucun contrôle; S07 existe mais est inutilisé | Non représentable |
| Projet avec contenu explicite | Option et coût dédiés | Aucun contrôle; S08 existe mais est inutilisé | Non représentable |
| Maintenance choisie par l’utilisateur | Niveau sélectionnable | Niveau assigné automatiquement par scénario | Non représentable |
| Commerce avec coût Shopify/TIR07 | Dépendance automatique possible | TIR07 défini mais jamais ajouté | Décision métier requise |

## Invariants automatisés

- Entrées inconnues, dupliquées ou appartenant à un autre secteur : rejet Zod.
- Valeurs négatives, infinies ou `NaN` : aucune dans les 24 combinaisons secteur × type testées au maximum.
- `mensuel = maintenance + tiers`.
- `récurrent annuel = mensuel × 12`.
- `année 1 = réalisation + récurrent annuel`.
- Les mêmes entrées donnent les mêmes nombres en FR et EN; seule la présentation de la devise change.
