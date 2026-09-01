---
id: socle_S06_genere
libelle: "Landing page — mode genere"
nature: les_deux
valeur_actuelle: 2350
valeur_proposee: null
unite: forfait
statut: CONTESTE
preuve_type: devis_concurrent
preuve_source: "<dossier client interne>/03_tarification_interne/2026-02-20_grille_tarifaire_web_quebec_2025-2026.docx (PRC-2026-ANALYSIS-QUEBEC v3.0), exemple §6.5 « Landing Page — Conseiller Financier » : 2 500-4 500 $ pour 20-35 h"
gradation: graduable
ecart_vs_125h: 85.45
---

# Landing page — mode genere

## Valeur dans le code

`SOCLE_ITEMS_BY_MODE.genere.S06` = `{ min: 1 200, max: 3 500 }` $ CAD, médiane **2 350 $**.

Le schéma de fiche impose un `number` unique : le champ `valeur_actuelle` porte la médiane,
les deux bornes sont ici.

## Preuve

Aucune ligne « landing page » dans la table 1,2; l'exemple §6.5 donne 2 500-4 500 $ pour 20-35 h. Le moteur est **sous** le marché aux deux bornes (1 200 contre 2 500, 3 500 contre 4 500). L'exemple §6.5 donne en plus les heures, ce qui rend le taux effectif directement calculable.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Taux horaire effectif implicite

Classe correspondante de la grille du 2026-02-20 : **Landing (§6.5)**, 20-35 h (médiane 27,5 h).

```
2 350 $ ÷ 27,5 h = 85,45 $/h
plancher de viabilité = 120,00 $/h
taux de référence     = 125,00 $/h
```

⚠️ Lecture à faire avec précaution : les heures de la grille chiffrent une production manuelle. En mode `genere`, l'hypothèse est justement que le générateur réduit ces heures — mais **de combien n'est écrit nulle part**. Ce taux est donc celui qu'on obtiendrait si le travail était fait à la main.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | une page longue, formulaire simple |
| haute | une page longue, tests A/B, suivi analytique, intégration de prise de rendez-vous |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

La landing page doit-elle être alignée sur 2 500-4 500 $ (marché + heures documentées), ou reste-t-elle volontairement sous le marché ?
