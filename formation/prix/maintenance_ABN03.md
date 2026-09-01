---
id: maintenance_ABN03
libelle: "Maintenance Premium (mensuel)"
nature: les_deux
valeur_actuelle: 550
valeur_proposee: null
unite: forfait
statut: CONTESTE
preuve_type: devis_concurrent
preuve_source: "grille du 2026-02-20, table 1.2 : « Maintenance mensuelle — 50 $/mois (bas), 400 $/mois (haut), 150 $/mois (médiane) », certitude [ÉTABLI]; et §3.1 : « Abonnement mensuel — modèle classique 50 $-150 $ (maintenance) »"
gradation: hors_classification
ecart_vs_125h: null
---

# Maintenance Premium (mensuel)

## Valeur dans le code

`MAINTENANCE_TIERS.ABN03` = `{ min: 350, max: 750 }` $ CAD **par mois**, médiane **550 $/mois**.
Le palier est imposé par le type de site, pas choisi par l'utilisateur (limitation 7).

## Preuve

La borne haute de **750 $/mois dépasse la borne haute marché de 400 $/mois** relevée en table 1,2. Deux sources internes s'opposent : c'est le cas limite 2 du mandat.

À noter, la même grille décrit en §3.2 des paliers d'abonnement « Partner » à 297 / 597 / 997 $/mois — mais ce sont des forfaits de **croissance** (SEO, banque d'heures, A/B testing), pas de la maintenance. Les confondre serait justifier un prix de maintenance par le prix d'un autre service.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

La borne haute de 750 $/mois sort du marché relevé. Est-ce assumé (un palier de service supérieur non décrit dans la grille), ou faut-il la ramener sous 400 $ ?
