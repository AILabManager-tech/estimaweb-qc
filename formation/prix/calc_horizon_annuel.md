---
id: calc_horizon_annuel
libelle: "Horizon de 12 mois pour le récurrent affiché"
nature: les_deux
valeur_actuelle: 12
valeur_proposee: null
unite: facteur
statut: PROUVE
preuve_type: calcul_horaire
preuve_source: "arithmétique : 12 mois = 1 an, aucune décision tarifaire"
gradation: hors_classification
ecart_vs_125h: null
---

# Horizon de 12 mois pour le récurrent affiché

## Valeur dans le code

`calculator.ts` L297 : `const roundedAnnual = roundedMonthly * 12;`

## Preuve

Conversion d'unité, pas un prix. Un an compte douze mois. Aucun arbitrage tarifaire n'est
porté par ce nombre.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Aucune sur la valeur. Une sur la présentation : la grille du 2026-02-20 raisonne en **24 mois**
pour son modèle « Partner » (§3.1), pas en 12. Si l'estimateur doit un jour parler
d'engagement, l'horizon affiché devra suivre.
