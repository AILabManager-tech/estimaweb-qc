---
id: recurrent_REC07
libelle: "Support technique étendu (/h)"
nature: les_deux
valeur_actuelle: 142.5
valeur_proposee: null
unite: forfait
statut: CONTESTE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: hors_classification
ecart_vs_125h: null
---

# Support technique étendu (/h)

## Valeur dans le code

`RECURRING_SERVICES.REC07` = `{ min: 85, max: 200 }` $ CAD, médiane **142 $**.

**Ligne inactive** : `REC01`-`REC07` ne sont jamais calculés (limitation 14).

⚠️ `REC07` porte un **conflit de périmètre documenté** avec les socles et la maintenance (limitation 16). Il a en outre déjà servi, à tort, d'ancrage de taux de développement dans une soumission — c'est un taux de **support**, pas de production. L'erreur est consignée dans les preuves du mandat client (pièce P10, erreur E3).

## Preuve

**Aucune.** Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Deux questions : `REC07` doit-il rester dans la matrice alors que son périmètre chevauche la maintenance ? Et sa fourchette 85-200 $/h contredit le taux de référence de 125 $/h — laquelle des deux fait foi pour du support ?
