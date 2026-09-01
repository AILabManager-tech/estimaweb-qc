---
id: remise_acquisition
libelle: "Remise d'acquisition — nouvel entrant"
nature: les_deux
valeur_actuelle: 0
valeur_proposee: null
unite: facteur
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune — décision commerciale, aucune preuve n'est possible par nature"
gradation: hors_classification
ecart_vs_125h: null
---

# Remise d'acquisition — nouvel entrant

## Valeur dans le code

**Aucune.** Cette ligne n'existe pas dans le moteur. `valeur_actuelle: 0` signifie ici
« absente », pas « nulle ».

C'est le fond du problème : la remise existe bel et bien — le commit `9dce874` l'applique — mais
elle est **dissoute** dans les socles `SOCLE_ITEMS_BY_MODE.genere.S01` et `.S02` et dans
`BILINGUAL_MULTIPLIER_BY_MODE.genere`. Elle n'a ni nom, ni taux, ni plafond, ni date de fin.

## Pourquoi cette fiche existe

Arbitrage du propriétaire du 2026-08-29 : la stratégie d'acquisition est conservée, mais elle
doit devenir **une remise explicite appliquée au total**, conforme au § IV du mandat
(« application d'un facteur ou d'un rabais : sur le total, jamais poste par poste »).

Trois choses deviennent alors vraies, qui sont fausses aujourd'hui :

| | Aujourd'hui | Une fois la remise sortie |
|---|---|---|
| Le coût de production | invisible, mélangé à la remise | lisible, défendable, mesurable |
| La remise | invisible, permanente, sans conditions | affichée, bornée, révocable |
| La règle « réduire le scope, jamais le prix » | contournée sans trace | applicable, puisqu'il y a un prix plein |

## Preuve

**Aucune, et il n'y en aura jamais.** Un taux de remise commerciale ne se mesure pas : il se
décide. Le § V du mandat ne prévoit aucune catégorie de preuve qui puisse couvrir ça — ce n'est
ni un mandat facturé, ni un calcul horaire, ni un devis concurrent.

La seule chose qui soit prouvable, c'est **ce sur quoi la remise s'applique** : le coût normal
de production. C'est l'objet des fiches [`socle_S01_genere`](socle_S01_genere.md) et
[`socle_S02_genere`](socle_S02_genere.md), traitées en phase 2.

## Ce qui reste sans base une fois la remise sortie

L'écart entre `genere` et `surMesure` était censé mesurer l'avantage du générateur interne sur
le temps de production. **Cet avantage n'est chiffré nulle part** — ni dans la grille du
2026-02-20, ni dans un commit, ni dans un mandat facturé. Le commit `9dce874` l'invoque
(« L'avantage de coût NEXOS [...] réduit fortement le temps de production ») sans le mesurer.

Donc, une fois la remise retirée des socles, il ne reste **aucune preuve** justifiant deux
socles distincts. Deux issues cohérentes, et une seule question :

- **soit** `genere` et `surMesure` portent la même valeur tant que l'avantage du générateur
  n'est pas mesuré, et la remise seule fait la différence de prix affiché;
- **soit** l'avantage est mesuré — un mandat généré, heures relevées, comparé à un mandat monté
  à la main — et l'écart devient un chiffre défendable.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Trois décisions, dans cet ordre :

1. **La remise s'applique-t-elle au total, avant ou après la marge d'imprévus de 15 % ?**
   Avant, elle réduit aussi la marge; après, elle ne touche que le prix affiché.
2. **Quel taux, quel plafond, quelles conditions de sortie ?** Une remise d'acquisition sans
   date de fin n'est pas une remise, c'est un prix.
3. **La remise doit-elle être visible du client ?** L'afficher rend le prix plein crédible et
   la remise valorisante; la masquer revient à la situation actuelle, avec un prix plein qui
   n'existe nulle part.

Aucune valeur n'est proposée : le § V n'offre aucune preuve recevable pour un taux commercial,
et le § XI interdit de le remplacer par une valeur « raisonnable ».
