---
id: tiers_TIR01
libelle: "Hébergement web (mensuel)"
nature: les_deux
valeur_actuelle: 82.5
valeur_proposee: null
unite: forfait
statut: CONTESTE
preuve_type: devis_concurrent
preuve_source: "grille du 2026-02-20, §7 « Coût total production » : hébergement/déploiement 5-15 $/mois (vitrine), 10-25 $/mois (e-commerce), 20-60 $/mois (applicatif)"
gradation: hors_classification
ecart_vs_125h: null
---

# Hébergement web (mensuel)

## Valeur dans le code

`THIRD_PARTY_COSTS.TIR01` = `{ min: 15, max: 150 }` $ CAD **par mois**, médiane **82,5 $/mois**.
**Ligne active** : facturée à tous les projets sans que l'utilisateur puisse la retirer (limitation 6).

## Preuve

La borne basse de 15 $/mois concorde avec le haut de la fourchette vitrine. **La borne haute de 150 $/mois dépasse de 2,5× le maximum relevé** (60 $/mois pour un applicatif). Or `TIR01` est facturé à tous les projets, y compris les vitrines, où le marché dit 5-15 $/mois.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Sur le scénario premium, l'hébergement d'une vitrine est chiffré à 150 $/mois contre 5-15 $/mois relevés. Faut-il ramener la borne haute, ou faire dépendre `TIR01` du type de site comme la maintenance ?
