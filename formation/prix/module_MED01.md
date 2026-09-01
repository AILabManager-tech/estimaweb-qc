---
id: module_MED01
libelle: "Prise de rendez-vous en ligne"
nature: les_deux
valeur_actuelle: 6500
valeur_proposee: null
unite: option
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: graduable
ecart_vs_125h: null
---

# Prise de rendez-vous en ligne

## Valeur dans le code

`SECTOR_MODULES` — `MED01` = `{ min: 3 000, max: 10 000 }` $ CAD, médiane **6 500 $**.
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
| basse | un praticien, un calendrier |
| haute | plusieurs praticiens, salles, rappels SMS, gestion des annulations |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Sur quoi fixer `MED01` ? Ce module a-t-il déjà été livré dans un mandat réel ? Si non, c'est le
cas limite 5 du mandat — aucune donnée n'existe et je ne peux pas extrapoler.
