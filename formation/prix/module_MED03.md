---
id: module_MED03
libelle: "Portail patient sécurisé"
nature: les_deux
valeur_actuelle: 12500
valeur_proposee: null
unite: option
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: graduable
ecart_vs_125h: null
---

# Portail patient sécurisé

## Valeur dans le code

`SECTOR_MODULES` — `MED03` = `{ min: 5 000, max: 20 000 }` $ CAD, médiane **12 500 $**.
Secteur : médical.

## Preuve

**Aucune.** Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

La grille du 2026-02-20 ne comporte aucune ventilation sectorielle : ses six archétypes (§6.1
à §6.6) sont des types de site, pas des métiers réglementés. Aucun mandat facturé ne comporte
cette ligne.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | consultation de résultats |
| haute | messagerie sécurisée, dépôt de documents, authentification renforcée |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Sur quoi fixer `MED03` ? Ce module a-t-il déjà été livré dans un mandat réel ? Si non, c'est le
cas limite 5 du mandat — aucune donnée n'existe et je ne peux pas extrapoler.
