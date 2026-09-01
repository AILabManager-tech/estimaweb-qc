---
id: refonte_bloc_conserve
libelle: "Bloc conservé — jamais refacturé"
nature: refonte
valeur_actuelle: 0
valeur_proposee: null
unite: facteur
statut: PROUVE
preuve_type: grille_officielle
preuve_source: "KNOWN_LIMITATIONS.md limitation 9 — règle d'exclusion, décision de périmètre"
gradation: hors_classification
ecart_vs_125h: null
---

# Bloc conservé — jamais refacturé

## Valeur dans le code

`REFONTE_FACTORS.blocConserve` = **0** (éco / rec / premium interpolés).

## Portée

Seul facteur de la famille qui ne soit pas une estimation : zéro est une **règle**, pas une mesure. Un bloc auquel on ne touche pas n'est pas facturé. C'est la règle d'exclusion, déclarée en limitation 9.

## Preuve

Règle de périmètre, pas une estimation : `REFONTE_FACTORS.blocConserve` vaut zéro parce que le travail n a pas lieu. Déclarée en limitation 9 de `KNOWN_LIMITATIONS.md`.



## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Aucune sur la valeur. Confirmer que la règle d'exclusion reste absolue.
