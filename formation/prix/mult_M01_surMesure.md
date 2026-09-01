---
id: mult_M01_surMesure
libelle: "Supplément bilingue FR/EN — mode surMesure"
nature: les_deux
valeur_actuelle: 1.5
valeur_proposee: null
unite: facteur
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: graduable
ecart_vs_125h: null
---

# Supplément bilingue FR/EN — mode surMesure

## Valeur dans le code

`BILINGUAL_MULTIPLIER_BY_MODE.surMesure` = `{ min: 1,4, max: 1,6 }`, médiane **1,5**.

S'applique au socle seul (limitation 8) — jamais aux ajouts fixes ni aux modules sectoriels.

## Preuve

Valeur créée au commit `97451ed` sans source, puis **reprise telle quelle** le 2026-08-29 depuis l'état du dépôt avant `9dce874`. Le § V du mandat exclut explicitement « un chiffre repris d'une version antérieure du code » : ce chemin ne prouve rien, et je dois le signaler comme un défaut du travail du 2026-08-29. La grille du 2026-02-20 ne contient aucune ligne sur un supplément multilingue.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | contenu court, traduction et remontage FR/EN sur peu de blocs |
| haute | contenu dense sur toutes les pages, adaptation culturelle, deux arborescences |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Sur quoi fixer le supplément bilingue en montage manuel ? Un relevé d'heures sur la traduction et le remontage FR/EN d'un mandat réel suffirait — c'est mesurable, contrairement aux facteurs de refonte.
