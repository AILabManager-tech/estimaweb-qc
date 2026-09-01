---
id: mult_M01_genere
libelle: "Supplément bilingue FR/EN — mode genere"
nature: les_deux
valeur_actuelle: 1.2
valeur_proposee: null
unite: facteur
statut: CONTESTE
preuve_type: commit_git
preuve_source: "commit 9dce874 (2026-08-27) « repricer S01/S02 et le multiplicateur bilingue pour positionnement nouvel entrant »"
gradation: graduable
ecart_vs_125h: null
---

# Supplément bilingue FR/EN — mode genere

## Valeur dans le code

`BILINGUAL_MULTIPLIER_BY_MODE.genere` = `{ min: 1,15, max: 1,25 }`, médiane **1,2**.

S'applique au socle seul (limitation 8) — jamais aux ajouts fixes ni aux modules sectoriels.

## Preuve

Le commit documente l'intention (« génération NEXOS, pas duplication manuelle ») mais pas le montant. Il a fait passer le multiplicateur de 1,4-1,6 à 1,15-1,25 dans le même geste que la baisse de S01/S02, donc pour la même raison commerciale. Aucune mesure du temps réel de génération FR/EN n'est citée.

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

Le supplément bilingue en mode généré est-il une mesure du travail, ou une part de la remise d'acquisition ? Si c'est la seconde, il ne devrait pas vivre dans un facteur de coût.
