---
id: maintenance_ABN00
libelle: "Maintenance Micro (mensuel)"
nature: les_deux
valeur_actuelle: 62.5
valeur_proposee: null
unite: forfait
statut: PROUVE
preuve_type: devis_concurrent
preuve_source: "grille du 2026-02-20, table 1.2 : « Maintenance mensuelle — 50 $/mois (bas), 400 $/mois (haut), 150 $/mois (médiane) », certitude [ÉTABLI]; et §3.1 : « Abonnement mensuel — modèle classique 50 $-150 $ (maintenance) »"
gradation: hors_classification
ecart_vs_125h: null
---

# Maintenance Micro (mensuel)

## Valeur dans le code

`MAINTENANCE_TIERS.ABN00` = `{ min: 50, max: 75 }` $ CAD **par mois**, médiane **62 $/mois**.
Le palier est imposé par le type de site, pas choisi par l'utilisateur (limitation 7).

## Preuve

La fourchette `50-75 $/mois` tient entièrement dans la fourchette marché 50-400 $/mois relevée en table 1,2, de certitude [ÉTABLI].

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Aucune. Confirmer pour passer en `VALIDE_PROPRIETAIRE`.
