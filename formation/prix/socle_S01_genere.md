---
id: socle_S01_genere
libelle: "Site vitrine 1-5 pages — mode genere"
nature: les_deux
valeur_actuelle: 2500
valeur_proposee: null
unite: forfait
statut: CONTESTE
preuve_type: commit_git
preuve_source: "commit 9dce874 (2026-08-27) « repricer S01/S02 [...] pour positionnement nouvel entrant »"
gradation: graduable
ecart_vs_125h: 41.67
---

# Site vitrine 1-5 pages — mode genere

## Valeur dans le code

`SOCLE_ITEMS_BY_MODE.genere.S01` = `{ min: 1 500, max: 3 500 }` $ CAD, médiane **2 500 $**.

Le schéma de fiche impose un `number` unique : le champ `valeur_actuelle` porte la médiane,
les deux bornes sont ici.

## Preuve

Le commit `9dce874` documente **l'intention** de la baisse — un positionnement d'acquisition adossé au générateur interne — mais pas le **montant**. Il contredit frontalement la règle 2 de la grille du propriétaire (« Prix plancher = Heures estimées × 120 $ »). Deux sources internes s'opposent : c'est le cas limite 2 du mandat.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Taux horaire effectif implicite

Classe correspondante de la grille du 2026-02-20 : **Vitrine Simple**, 46-74 h (médiane 60 h).

```
2 500 $ ÷ 60 h = 41,67 $/h
plancher de viabilité = 120,00 $/h
taux de référence     = 125,00 $/h
```

⚠️ Lecture à faire avec précaution : les heures de la grille chiffrent une production manuelle. En mode `genere`, l'hypothèse est justement que le générateur réduit ces heures — mais **de combien n'est écrit nulle part**. Ce taux est donc celui qu'on obtiendrait si le travail était fait à la main.

## Arbitrage du propriétaire — 2026-08-29

> « Je veux conserver le principe d'une stratégie d'acquisition, mais elle ne doit pas être
> cachée dans S01/S02. Les valeurs de production doivent représenter le coût normal du
> livrable. Si on décide d'accorder une remise d'acquisition, elle doit apparaître comme une
> remise explicite appliquée au total. Traite les montants anormalement bas de S01/S02 en mode
> `genere` comme un problème de modélisation de la remise, pas comme le coût normal de
> production. »

**Ce que cela change pour cette fiche.** Le montant n'est plus à défendre ou à contester comme
un coût : il est **composite**. Il additionne, sans les distinguer, deux choses de nature
différente :

1. un coût de production en mode généré — jamais mesuré;
2. une remise d'acquisition — jamais déclarée.

C'est le cas limite 3 du mandat, dans sa forme la plus coûteuse : le défaut n'est pas dans la
valeur seule ni dans la formule seule, mais dans le fait qu'une décision commerciale vit dans
une variable de coût. Tant qu'elle y reste, aucune correction de formule ne remonte le prix, et
la règle 4 de la grille du propriétaire — « réduire le scope, jamais le prix » — est
contournée sans que rien ne l'affiche.

**Conséquence à traiter en phase 2.** Une fois la remise sortie, il ne reste **aucune preuve**
d'un écart entre production générée et production manuelle : l'avantage du générateur n'est
chiffré nulle part. La question n'est donc plus « quelle valeur pour le socle `genere` », mais
« un socle `genere` distinct a-t-il encore une raison d'exister ». Voir la fiche
[`remise_acquisition`](remise_acquisition.md).

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | 1 page publiée |
| haute | 5 pages |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Le principe est arbitré, il reste deux chiffres à produire :

1. **le coût normal de production** d'un site vitrine 1-5 pages — traité en phase 2, proposition adossée à un calcul horaire;
2. **le taux et les conditions de la remise d'acquisition** — aucune preuve n'est possible, c'est une décision commerciale pure. Voir [`remise_acquisition`](remise_acquisition.md).

Tant que le premier n'est pas fixé, le second ne peut pas s'appliquer : une remise se calcule sur un prix.
