---
id: module_PRO01
libelle: "Conformité ordre professionnel"
nature: les_deux
valeur_actuelle: 1250
valeur_proposee: null
unite: option
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: binaire
ecart_vs_125h: null
---

# Conformité ordre professionnel

## Valeur dans le code

`SECTOR_MODULES` — `PRO01` = `{ min: 500, max: 2 000 }` $ CAD, médiane **1 250 $**.
Secteur : professionnel ou PME.

## Preuve

**Aucune.** Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

La grille du 2026-02-20 ne comporte aucune ventilation sectorielle : ses six archétypes (§6.1
à §6.6) sont des types de site, pas des métiers réglementés. Aucun mandat facturé ne comporte
cette ligne.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification — ligne **binaire** (2026-08-30)

Cette ligne n'a pas de degré. Définition unique, sans niveau :

> Les exigences de l'ordre professionnel sont respectées, ou elles ne le sont pas.

**La fourchette actuelle est un écart sans contenu** : rien, ni dans le code ni dans
l'interface, ne dit ce que la borne haute couvre de plus que la borne basse. Elle doit être
remplacée par un prix unique.

Classer la ligne comme binaire **ne prouve pas ce prix** : ça ramène le problème de deux
valeurs à une seule. Le statut de cette fiche ne change pas pour autant.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 1.

## Question au propriétaire

Sur quoi fixer `PRO01` ? Ce module a-t-il déjà été livré dans un mandat réel ? Si non, c'est le
cas limite 5 du mandat — aucune donnée n'existe et je ne peux pas extrapoler.
