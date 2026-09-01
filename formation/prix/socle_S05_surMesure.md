---
id: socle_S05_surMesure
libelle: "Plateforme sur mesure — mode surMesure"
nature: les_deux
valeur_actuelle: 52500
valeur_proposee: null
unite: forfait
statut: CONTESTE
preuve_type: devis_concurrent
preuve_source: "<dossier client interne>/03_tarification_interne/2026-02-20_grille_tarifaire_web_quebec_2025-2026.docx (PRC-2026-ANALYSIS-QUEBEC v3.0), table 1.2, certitude [ÉTABLI]"
gradation: graduable
ecart_vs_125h: 139.07
---

# Plateforme sur mesure — mode surMesure

## Valeur dans le code

`SOCLE_ITEMS_BY_MODE.surMesure.S05` = `{ min: 25 000, max: 80 000 }` $ CAD, médiane **52 500 $**.

Le schéma de fiche impose un `number` unique : le champ `valeur_actuelle` porte la médiane,
les deux bornes sont ici.

## Preuve

Marché relevé : Sur mesure sans CMS 30 000 $+, sans borne haute publiée. La borne basse du moteur (25 000 $) est **sous** le plancher marché de 30 000 $, et la borne haute de 80 000 $ n'a aucune source : la table 1,2 ne publie pas de borne haute pour ce segment.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Taux horaire effectif implicite

Classe correspondante de la grille du 2026-02-20 : **Applicatif**, 215-540 h (médiane 377,5 h).

```
52 500 $ ÷ 377,5 h = 139,07 $/h
plancher de viabilité = 120,00 $/h
taux de référence     = 125,00 $/h
```

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | application sur mesure à périmètre fermé, un rôle d'utilisateur |
| haute | plusieurs rôles, API publiée, traitements asynchrones |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Deux questions : la borne basse doit-elle remonter à 30 000 $ (plancher marché) ? Et d'où vient la borne haute de 80 000 $ ?
