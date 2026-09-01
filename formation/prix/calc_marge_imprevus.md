---
id: calc_marge_imprevus
libelle: "Marge d'imprévus appliquée au sous-total"
nature: les_deux
valeur_actuelle: 0.15
valeur_proposee: null
unite: facteur
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: hors_classification
ecart_vs_125h: null
---

# Marge d'imprévus appliquée au sous-total

## Valeur dans le code

`calculator.ts` L268 : `const contingency = normalizeDecimal(subtotal * 0,15);`
Appliquée au **sous-total**, jamais poste par poste — conforme au § IV du mandat.

## Portée

Ce n'est pas une ligne mineure : 15 % du sous-total, c'est **592 $ sur le cas de référence à
4 540 $**, davantage que le socle refait lui-même (1 056 $).

## Preuve

**Aucune.** `KNOWN_LIMITATIONS.md` le déclare déjà mot pour mot : « **La marge d'imprévus de
15 %** est une constante posée, sans justification chiffrée documentée. »

La grille du 2026-02-20 ne mentionne aucune marge d'imprévus. Aucun mandat facturé n'en isole
une.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Sur quoi fixer la marge d'imprévus ? Elle est mesurable **rétrospectivement** : l'écart entre
les heures estimées et les heures réellement passées sur un mandat livré *est* la marge
d'imprévus observée. C'est la même mesure que celle proposée pour les facteurs de refonte, et
elle donnerait les deux d'un coup.
