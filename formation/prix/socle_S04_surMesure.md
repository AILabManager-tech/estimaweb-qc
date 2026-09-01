---
id: socle_S04_surMesure
libelle: "E-commerce avancé (100+ produits) — mode surMesure"
nature: les_deux
valeur_actuelle: 35000
valeur_proposee: null
unite: forfait
statut: PROUVE
preuve_type: devis_concurrent
preuve_source: "<dossier client interne>/03_tarification_interne/2026-02-20_grille_tarifaire_web_quebec_2025-2026.docx (PRC-2026-ANALYSIS-QUEBEC v3.0), table 1.2, certitude [ÉTABLI]"
gradation: graduable
ecart_vs_125h: null
---

# E-commerce avancé (100+ produits) — mode surMesure

## Valeur dans le code

`SOCLE_ITEMS_BY_MODE.surMesure.S04` = `{ min: 20 000, max: 50 000 }` $ CAD, médiane **35 000 $**.

Le schéma de fiche impose un `number` unique : le champ `valeur_actuelle` porte la médiane,
les deux bornes sont ici.

## Preuve

Marché relevé : Site avancé (CRM, API) 10 000-50 000 $, médiane 25 000 $. La borne haute du moteur coïncide exactement avec la borne haute marché.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Taux horaire effectif implicite

Aucune classe de la grille du 2026-02-20 ne correspond nettement à ce segment. Taux effectif non calculable sans inventer un volume d'heures — laissé à `null`.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | 100 produits, variantes et promotions |
| haute | catalogue étendu, comptes clients, logistique et intégrations tierces |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Aucune. La valeur est couverte par une source marché externe et datée. Confirmer pour passer en `VALIDE_PROPRIETAIRE`.
