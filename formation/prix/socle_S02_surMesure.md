---
id: socle_S02_surMesure
libelle: "Site vitrine 6-15 pages — mode surMesure"
nature: les_deux
valeur_actuelle: 10000
valeur_proposee: 13812.5
unite: forfait
statut: CONTESTE
preuve_type: devis_concurrent
preuve_source: "<dossier client interne>/03_tarification_interne/2026-02-20_grille_tarifaire_web_quebec_2025-2026.docx (PRC-2026-ANALYSIS-QUEBEC v3.0), table 1.2 « Prix Projets — Données Marché QC », certitude [ÉTABLI]"
gradation: graduable
ecart_vs_125h: 90.5
---

# Site vitrine 6-15 pages — mode surMesure

## Valeur dans le code

`SOCLE_ITEMS_BY_MODE.surMesure.S02` = `{ min: 5 000, max: 15 000 }` $ CAD, médiane **10 000 $**.

Le schéma de fiche impose un `number` unique : le champ `valeur_actuelle` porte la médiane,
les deux bornes sont ici.

## Preuve

Marché relevé : Vitrine agence Montréal 3 000-10 000 $+, médiane 6 500 $ / Vitrine agence Ville de Québec 5 000-20 000 $, médiane 10 000 $.

⚠️ La valeur a été **reprise du dépôt avant `9dce874`** lors du travail du 2026-08-29. Le § V du mandat exclut explicitement « un chiffre repris d'une version antérieure du code » : ce chemin ne prouve rien. Seule la concordance avec la table 1,2 ci-dessus compte comme preuve, et elle ne porte que sur la borne basse.

La borne haute de 15 000 $ n'est couverte par aucune ligne de la table 1,2 (qui plafonne à 20 000 $ pour la vitrine agence Ville de Québec, sans dire ce qui distingue les deux bornes).

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Taux horaire effectif implicite

Classe correspondante de la grille du 2026-02-20 : **Vitrine Avancée**, 76-145 h (médiane 110,5 h).

```
10 000 $ ÷ 110,5 h = 90,50 $/h
plancher de viabilité = 120,00 $/h
taux de référence     = 125,00 $/h
```

## Phase 2 — proposition de valeur (en attente d'arbitrage)

Objet de la proposition : **le coût normal de production d'un site vitrine de 6 à 15 pages**,
hors toute remise. La même grandeur vaut pour les deux modes, l'avantage du générateur n'étant
mesuré nulle part — voir [`remise_acquisition`](remise_acquisition.md).

### Calcul

Preuve de type `calcul_horaire` (§ V du mandat) : taux de référence documenté × volume d'heures
documenté.

```
Grille du 2026-02-20, §2.2 « Ventilation par Phase »
classe « Vitrine Avancée »          76 - 145 h

  min  =  76 h × 125 $/h  =   9 500 $
  max  = 145 h × 125 $/h  =  18 125 $
  médiane                 =  13 812 $
```

### Trois recoupements indépendants

| Source | Fourchette | Taux effectif |
|---|---|---:|
| §2.2 × 125 $/h — la proposition | 9 500 - 18 125 $ | 125 $/h par construction |
| §6.2 « Cabinet comptable », 10 pages, forfait publié | 12 000 - 16 000 $ pour 95-130 h | **126 - 123 $/h** |
| §6.6 « OSBL », 8 pages, forfait publié, **facteur 0,75× retiré** | 8 000 - 12 000 $ pour 65-95 h | **123 - 126 $/h** |

Les deux archétypes de vitrine avancée de la grille sortent à **123-126 $/h** une fois leurs
rabais explicites retirés. C'est la démonstration que la grille du propriétaire est bien bâtie
sur 125 $/h — et qu'elle, contrairement au moteur, **affiche ses rabais** : le §6.6 porte la
mention « facteur 0,75× » en toutes lettres. C'est exactement le traitement demandé par
l'arbitrage du 2026-08-29.

Recoupement marché, table 1.2 `[ÉTABLI]` : « Vitrine agence Ville de Québec » 5 000 - 20 000 $,
médiane 10 000 $. La proposition tient dans cette fourchette, dans sa moitié haute — cohérent
avec le positionnement « quartile supérieur Expert/Senior » revendiqué au résumé exécutif de la
grille.

## Ce qui s'inscrirait réellement dans `matrix.ts`

**Aucune valeur ponctuelle n'est à choisir dans la fourchette.** `SOCLE_ITEMS_BY_MODE` ne
stocke pas un montant : il stocke un `PriceRange`, c'est-à-dire les deux bornes.

```ts
S02: { min: 9_500, max: 18_125 },   // 76-145 h × 125 $/h (grille 2026-02-20, §2.2)
```

Les deux littéraux sont **entièrement dérivés** : `76 × 125` et `145 × 125`. Aucun arrondi n'est
appliqué — arrondir 18 125 à 18 000 introduirait précisément l'arbitraire à éviter.

Le point de 13 812,50 $ **n'est écrit nulle part dans le code**. Il est calculé à l'exécution
par `lerp(min, max, t)`, où `t` vaut 0 pour le scénario économique, 0,5 pour le recommandé et 1
pour le premium (`SCENARIO_PERCENTILES`, `calculator.ts` L33-37).

Le champ `valeur_proposee` de cette fiche porte 13812.5 uniquement parce que le § VI du mandat
impose un `number` unique. **C'est une commodité de fiche, pas une valeur destinée au moteur.**

### Où le choix d'un point dans la fourchette se décide vraiment

Il ne se décide pas ici. Le fait que le scénario « recommandé » soit le **milieu arithmétique**
de chaque fourchette relève d'une autre ligne du registre :
[`calc_percentiles_scenarios`](calc_percentiles_scenarios.md), statut `NON_PROUVE`.
`KNOWN_LIMITATIONS.md` le déclare déjà : « C'est une convention de présentation, pas une
distribution observée. »

Autrement dit : cette fiche-ci prouve **la fourchette**. Le choix du point à l'intérieur est un
arbitrage distinct, qui porte sur les trois scénarios de tous les postes à la fois — pas sur
S02.

### Dérivation complète du socle du cas de référence

Entrées : `S02` / refonte / code `nous` / 4 blocs neufs, 6 rhabillés, 21 conservés
(31 au total). Scénario recommandé, donc `t = 0,5`. Fonction `computeSocle`, `calculator.ts`.

| Étape | Actuel — socle 3 000-8 000 | Proposé — socle 9 500-18 125 |
|---|---:|---:|
| `fullBuild = lerp(min, max, 0,5)` | 5 500,00 $ | 13 812,50 $ |
| `partProjet = fullBuild × 0,25` | 1 375,0000 $ | 3 453,1250 $ |
| `poolBlocs = fullBuild − partProjet` | 4 125,0000 $ | 10 359,3750 $ |
| `coutBloc = poolBlocs ÷ 31` | 133,064516 $ | 334,173387 $ |
| 4 blocs neufs — `4 × coutBloc` | 532,2581 $ | 1 336,6935 $ |
| 6 rhabillés — `6 × coutBloc × 0,325` | 259,4758 $ | 651,6381 $ |
| 21 conservés — `21 × 0` | 0,00 $ | 0,00 $ |
| `codeFactor` — code écrit par nous | × 1,0 | × 1,0 |
| **Socle facturé** | **2 166,7339 → 2 167 $** | **5 441,4567 → 5 441 $** |

Le facteur de rhabillage vaut `lerp(0,25 ; 0,40 ; 0,5) = 0,325`. Il reste `NON_PROUVE` — voir
[`refonte_bloc_rhabille`](refonte_bloc_rhabille.md) — et n'est pas touché ici.

### Contrôle : la formule est linéaire en `fullBuild`

`partProjet` et `poolBlocs` sont tous deux proportionnels à `fullBuild`, donc le socle facturé
l'est aussi. Le rapport entre deux socles doit égaler exactement le rapport de leurs
`fullBuild`. Vérifié **sur le moteur réel**, en comparant les modes `genere` (3 000-8 000) et
`surMesure` (5 000-15 000) sur ce même cas :

| Scénario | Socle `genere` | Socle `surMesure` | Rapport observé | Rapport des `fullBuild` |
|---|---:|---:|---:|---:|
| éco | 1 149 $ | 1 915 $ | 1,666667 | 1,666667 |
| recommandé | 2 167 $ | 3 940 $ | 1,818182 | 1,818182 |
| premium | 3 239 $ | 6 073 $ | 1,874961 | 1,875000 |

Les rapports coïncident (le résidu du premium vient de l'arrondi de `baseCost` à l'entier).
L'extrapolation est donc exacte :

```
2 166,7339 $ × (13 812,50 ÷ 5 500) = 5 441,4567 $
écart avec le calcul direct : 0,0000000000 $
```

### Les trois scénarios

| Scénario | Socle actuel | Socle proposé | Facteur |
|---|---:|---:|---:|
| éco (`t = 0`) | 1 149 $ | 3 639 $ | ×3,167 |
| recommandé (`t = 0,5`) | 2 167 $ | 5 441 $ | ×2,511 |
| premium (`t = 1`) | 3 239 $ | 7 338 $ | ×2,266 |

Le facteur n'est pas constant parce que les deux fourchettes n'ont pas le même rapport
min/max : 1 à 2,67 aujourd'hui, 1 à 1,91 dans la proposition. La fourchette proposée est donc
**plus resserrée** que l'actuelle, alors même qu'elle est plus haute.

### Ce que la proposition ne règle pas

- La fourchette reste large — de 1 à 1,91 — parce que la classe « Vitrine Avancée » couvre
  76 à 145 h. C'est l'incertitude réelle de la grille, pas un défaut d'arrondi. Elle reste
  toutefois **plus resserrée que l'actuelle** (1 à 2,67).
  **Segmenter S02 par nombre de pages est explicitement écarté** par l'arbitrage du 2026-08-29 :
  « Ne segmente pas encore S02 par nombre de pages : ce serait une décision distincte. »
- Elle ne dit rien du taux de remise d'acquisition, qui n'est pas prouvable.
- Elle ne mesure pas l'avantage du générateur : elle constate qu'il n'est pas mesuré et
  applique donc la même valeur aux deux modes.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | 6 pages |
| haute | 15 pages |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

La borne haute de 15 000 $ n'a pas de source. Sur quoi la fixer ?
