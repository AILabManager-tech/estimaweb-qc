---
id: socle_S01_surMesure
libelle: "Site vitrine 1-5 pages — mode surMesure"
nature: les_deux
valeur_actuelle: 4250
valeur_proposee: null
unite: forfait
statut: CONTESTE
preuve_type: devis_concurrent
preuve_source: "<dossier client interne>/03_tarification_interne/2026-02-20_grille_tarifaire_web_quebec_2025-2026.docx (PRC-2026-ANALYSIS-QUEBEC v3.0), table 1.2 « Prix Projets — Données Marché QC », certitude [ÉTABLI]"
gradation: graduable
ecart_vs_125h: 70.83
---

# Site vitrine 1-5 pages — mode surMesure

## Valeur dans le code

`SOCLE_ITEMS_BY_MODE.surMesure.S01` = `{ min: 2 500, max: 6 000 }` $ CAD, médiane **4 250 $**.

Le schéma de fiche impose un `number` unique : le champ `valeur_actuelle` porte la médiane,
les deux bornes sont ici.

## Preuve

Marché relevé : Vitrine simple (template) 1 000-3 000 $, médiane 2 000 $ / Vitrine custom WordPress 2 500-10 000 $, médiane 5 000 $.

⚠️ La valeur a été **reprise du dépôt avant `9dce874`** lors du travail du 2026-08-29. Le § V du mandat exclut explicitement « un chiffre repris d'une version antérieure du code » : ce chemin ne prouve rien. Seule la concordance avec la table 1,2 ci-dessus compte comme preuve, et elle ne porte que sur la borne basse.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Taux horaire effectif implicite

Classe correspondante de la grille du 2026-02-20 : **Vitrine Simple**, 46-74 h (médiane 60 h).

```
4 250 $ ÷ 60 h = 70,83 $/h
plancher de viabilité = 120,00 $/h
taux de référence     = 125,00 $/h
```

## Arbitrage du propriétaire — 2026-08-29

> « Ne valide aucune valeur uniquement parce qu'elle existait auparavant dans le moteur. »

Fiche rétrogradée de `PROUVE` à `CONTESTE`. La borne basse de 2 500 $ coïncide exactement avec
le plancher « Vitrine custom WordPress » de la table 1.2, ce qui est une vraie concordance.
**La borne haute de 6 000 $ n'a aucune source** : la même ligne marché monte à 10 000 $, et
rien n'explique où s'arrête le périmètre de S01. Une borne prouvée sur deux ne fait pas une
fiche prouvée.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | 1 page publiée |
| haute | 5 pages |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

D'où vient la borne haute de 6 000 $ ? Et le socle `surMesure` de S01 doit-il, comme celui de
S02, être dérivé d'un calcul horaire depuis 125 $/h plutôt que d'une borne marché ?
