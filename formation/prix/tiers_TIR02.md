---
id: tiers_TIR02
libelle: "Nom de domaine (mensuel)"
nature: les_deux
valeur_actuelle: 2.5
valeur_proposee: null
unite: forfait
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: hors_classification
ecart_vs_125h: null
---

# Nom de domaine (mensuel)

## Valeur dans le code

`THIRD_PARTY_COSTS.TIR02` = `{ min: 1, max: 4 }` $ CAD **par mois**, médiane **2,5 $/mois**.
**Ligne active** : facturée à tous les projets sans que l'utilisateur puisse la retirer (limitation 6).

## Preuve

**Aucune.** Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

La grille du 2026-02-20 ne chiffre que l'hébergement et le compute IA. Aucune de ses tables ne couvre « nom de domaine (mensuel) ».

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Sur quoi fixer `TIR02` ? Un tarif public de fournisseur, daté et capturé, suffirait — c'est la preuve la plus facile à produire de tout le registre.
