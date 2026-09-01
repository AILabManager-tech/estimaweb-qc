# Sur quoi calibre-t-on le moteur EstimaWeb — arbitrage

**Document interne. Non livré avec l'application, non destiné à un client.**
Écrit le 2026-08-28, en réponse à la question centrale de `BOOTSTRAP_REFONTE_MOTEUR.md`.

---

## La réponse en une phrase

La question « sur quoi calibre-t-on » en contient trois, qui n'ont pas la même
réponse et qu'il faut cesser de traiter ensemble :

| Couche | Se calibre sur | Action |
|---|---|---|
| **Structure de la formule** | rien — elle se **démontre** fausse | corriger maintenant |
| **Niveau du socle** | la grille interne du 2026-02-20 + l'historique git | corriger maintenant |
| **Facteurs de refonte** | **rien aujourd'hui** | ne pas toucher, mesurer |

---

## Couche 1 — La structure : trois défauts prouvables sans aucune donnée

### 1.1 La dilution par les blocs conservés

Sortie du moteur réel, mêmes entrées à un paramètre près : 4 blocs neufs,
6 rhabillés, `PRO`/`S02`/bilingue/refonte/code `nous`. Seul le nombre de blocs
conservés varie.

| Blocs conservés | Total blocs | Socle facturé | Scénario recommandé |
|---:|---:|---:|---:|
| 0 | 10 | 3 273 $ | 7 600 $ |
| 5 | 15 | 2 182 $ | 6 095 $ |
| 10 | 20 | 1 636 $ | 5 342 $ |
| **21** | **31** | **1 056 $** | **4 540 $** |
| 30 | 40 | 818 $ | 4 212 $ |
| 50 | 60 | 545 $ | 3 835 $ |
| 90 | 100 | 327 $ | 3 535 $ |

**Le travail est identique dans les sept lignes. Le socle varie d'un facteur 10.**
Plus le site déjà en place est gros, moins le travail neuf coûte cher. Aucune
mesure n'est nécessaire pour rejeter ça : c'est une erreur de modèle.

La docstring de `computeSocle()` justifie la division par le total en disant que
l'infrastructure existante « est portée par les blocs conservés et n'est donc
jamais refacturée ». L'intention est juste. La mise en œuvre ne fait pas ça :
elle dilue le travail **neuf** dans le site ancien.

### 1.2 La part « projet » n'est pas proportionnelle aux blocs touchés

Le socle contient deux natures de travail que la formule confond :

- **du travail par bloc** — design, développement, contenu : proportionnel aux
  blocs touchés ;
- **du travail de projet** — cadrage, assurance qualité, non-régression, mise en
  ligne : il porte sur le **mandat et le site entier**, pas sur la fraction de
  blocs refaits.

En divisant tout par le nombre total de blocs, la formule multiplie la part
projet par 10/31 = 32 % sur le cas réel. Or les tests de non-régression portent
sur les onze pages, pas sur les dix blocs.

### 1.3 Le double comptage bloc / module sectoriel

Sur le cas réel, le quiz de diagnostic et le calculateur sont :

- comptés parmi les **6 blocs rhabillés** du socle (E03, blocs 5 et 6) ;
- **et** facturés une seconde fois via `PRO02` « Calculateurs/simulateurs »
  rhabillé, soit 1 625 $ (E01).

Le même travail est facturé deux fois. Ce n'est pas un problème de niveau, c'est
une règle manquante : un module sectoriel déjà déclaré comme bloc ne doit pas
être facturé en plus.

---

## Couche 2 — Le niveau du socle : une seule source externe existe

### 2.1 La grille interne du 2026-02-20

`00_admin/03_tarification_interne/` du dossier client 01 — grille
`PRC-2026-ANALYSIS-QUEBEC v3.0`. C'est la **seule source indépendante
d'EstimaWeb** : six archétypes chiffrés à la fois en dollars **et en heures**, et
quatre classes de projet ventilées en six phases.

| Archétype (grille 2026-02-20) | Grille $ | Heures | $/h | ID | EstimaWeb actuel | Avant `9dce874` | Écart au milieu |
|---|---:|---:|---:|:--:|---:|---:|---:|
| Landing page (1 p) | 2 500–4 500 | 20–35 | 125–129 | S06 | 1 200–3 500 | *(inchangé)* | 1,49× |
| Vitrine simple (5 p) | 5 500–7 000 | 46–58 | 120–121 | S01 | 1 500–3 500 | 2 500–6 000 | **2,50×** |
| Vitrine avancée (10 p) | 12 000–16 000 | 95–130 | 126–123 | S02 | 3 000–8 000 | 5 000–15 000 | **2,55×** |
| Transactionnel (~50 prod.) | 14 000–22 000 | 120–180 | 117–122 | S03 | 8 000–25 000 | *(inchangé)* | 1,09× |
| Applicatif (15 p + système) | 35 000–55 000 | 280–440 | 125–125 | S05 | 25 000–80 000 | *(inchangé)* | 0,86× |

**Le constat décisif : l'écart n'est pas global.** S03 et S05 concordent avec la
grille interne (1,09× et 0,86×). L'écart de 2,5× porte exactement sur S01 et S02
— les deux lignes que le commit `9dce874` a baissées « pour positionnement
nouvel entrant », en même temps que `M01` bilingue passait de 1,4-1,6 à
1,15-1,25.

Ce n'est donc pas un biais du moteur. C'est une **décision commerciale
d'acquisition, appliquée à un socle qui sert aussi à chiffrer du montage manuel.**

### 2.2 Les valeurs « montage manuel » n'ont pas à être inventées

Elles sont dans l'historique git, avant `9dce874` :

```
S01 : 2 500 –  6 000       M01 bilingue : 1,4 – 1,6
S02 : 5 000 – 15 000
```

Corroborées par la grille du 2026-02-20 ci-dessus (qui est même plus haute pour
S02). Restaurer ces valeurs sur un **second axe** — mode de production
`généré` / `sur mesure` — ne fabrique aucune valeur normative.

### 2.3 La part « projet » : 25 %, corroborée par deux sources indépendantes

Grille interne, § 2.2 « Ventilation par phase » — part des phases *Stratégie &
Brief*, *QA & Tests*, *Déploiement & Formation* dans le total :

| Classe | Borne basse | Borne haute |
|---|---:|---:|
| Vitrine simple | 21,7 % | 24,3 % |
| Vitrine avancée | 26,3 % | 24,1 % |
| Transactionnel | 26,8 % | 25,1 % |
| Applicatif | 25,6 % | 22,2 % |

**21,7 – 26,8 % sur quatre classes et huit bornes.** Remarquablement stable.

Contrôle indépendant sur la ventilation humaine du mandat en cours (E04,
16 postes) : passation + assurance qualité + tests de non-régression + révisions
= 2 500 $ / 8 100 $ = **30,9 %** ; sans les révisions, **23,1 %**.

Les deux sources se recoupent. **25 %** est une convention, mais une convention
*sourcée* — ce que les facteurs actuels ne sont pas.

---

## Couche 3 — Les facteurs de refonte : ne se calibrent sur rien. Ne pas y toucher.

`blocRhabille` 0,25-0,40 · `codeTiers` 1,20-1,40 · marge d'imprévus 15 % ·
surcoût d'un bloc neuf inséré dans un site vivant.

- La grille interne du 2026-02-20 **n'a aucune section refonte**. Vérifié.
- Il n'existe **aucune facturation réelle exploitable**. P09 : le seul mandat
  facturé (février 2026) l'a été avec un rabais de lancement majeur, et la
  facture elle-même écrit que « la structure de base du site […] n'est pas
  facturée ». Il n'y a rien à mesurer dedans.
- Le seul relevé disponible est une **estimation**, pas des heures passées.

Les remplacer aujourd'hui reviendrait à échanger des conventions contre d'autres
conventions, avec la même confiance injustifiée. **On les laisse, on les déclare,
on les mesure.**

---

## Ce qu'on ne fait pas, et pourquoi

**Piste 2 du bootstrap — « reconstruire par le bas », chiffrer par type de
bloc.** Écartée pour l'instant. Elle introduit une valeur libre par catégorie de
bloc alors qu'on dispose de **n = 1** mandat. C'est le chemin le plus rapide vers
*plus* de conventions, aussi peu fondées. À reprendre quand trois ou quatre
refontes auront été mesurées.

**Piste 1 seule — mesurer, ne rien changer.** Insuffisante. Les trois défauts de
structure de la couche 1 sont faux aujourd'hui et le resteront quelles que soient
les mesures à venir.

**Retenu : piste 3 + correction de structure maintenant, piste 1 lancée en
parallèle, piste 2 reportée.**

---

## Ordre de grandeur obtenu — sorties du moteur après correction

Cas réel, scénario recommandé, relevé en appelant `calculateEstimation()`.

| Configuration | Total réalisation |
|---|---:|
| Avant correction | **4 540 $** |
| Structure corrigée, mode `genere`, `PRO02` rhabillé | 6 074 $ |
| Structure corrigée, mode `surMesure`, `PRO02` rhabillé | 9 880 $ |
| Structure corrigée, mode `surMesure`, `PRO02` à l'état `bloc` | **8 011 $** |
| *Référence humaine (E04, 16 postes, 64,8 h)* | *8 100 $* |

Deux lectures, toutes deux importantes :

1. **Les deux corrections sont nécessaires et ni l'une ni l'autre ne suffit.** La
   structure seule reste sous le plancher de viabilité. Le socle seul garderait
   la dilution.
2. **Le résidu de 1 869 $ entre les deux dernières lignes est entièrement la
   règle de recouvrement bloc/module.** C'est une déclaration de périmètre, pas
   un nombre à mesurer : l'état `bloc` la rend explicite au lieu de la laisser
   implicite.

La proximité de 8 011 $ avec 8 100 $ n'est **pas** une validation : un seul cas,
et le classement de `PRO02` est un choix de l'utilisateur. Elle indique un ordre
de grandeur redevenu plausible, rien de plus.

---

## Ce qui a été implémenté le 29 août 2026

| Correction | Où | Exposé dans l'interface |
|---|---|:--:|
| Axe `productionMode` (`genere` / `surMesure`), socles et supplément bilingue distincts | `matrix.ts`, `calculator.ts`, `schema.ts` | non |
| Socle scindé en part projet 25 % non divisée / part blocs divisée | `calculator.ts` (`computeSocle`) | — |
| Part projet nulle si aucun bloc n'est touché | `calculator.ts` | — |
| État d'option `bloc` — non-recouvrement bloc / module | `types.ts`, `schema.ts`, `calculator.ts`, `FeaturesStep.tsx`, `messages/` | oui |
| Facteurs de refonte inchangés, statut de convention déclaré | `matrix.ts`, `KNOWN_LIMITATIONS.md` | — |

**Aucun montant publié ne change.** `genere` est le défaut et le seul mode
atteignable depuis l'interface; les valeurs de `SOCLE_ITEMS` et de `MULTIPLIERS`
sont identiques au caractère près. La grille officielle **AUX-TARIF-2026-08**,
générée depuis `matrix.ts`, n'a donc pas à être régénérée. Elle devra l'être le
jour où `surMesure` sera exposé — et ce jour-là, c'est une décision de
positionnement.

Vérifications : `tsc --noEmit` et `eslint --max-warnings=0` propres,
148 tests unitaires verts (dont 9 nouveaux dans
`src/lib/engine/__tests__/calibration.test.ts`), 9 tests Playwright verts,
`next build` réussi. Les seuls montants de référence à avoir bougé sont ceux du
cas de refonte épinglé, dont la mise à jour est documentée dans
`CALCULATION_TEST_MATRIX.md`.

---

## Conséquence à trancher avant toute modification de `matrix.ts`

La grille officielle **AUX-TARIF-2026-08** (PDF + classeur 10 onglets, en vigueur
depuis le 2026-08-26) est **générée depuis `matrix.ts`**. Toute modification de la
matrice impose de régénérer les deux, sinon trois sources divergent.

Et `estimaweb-qc.vercel.app` est public. Ajouter un axe `mode de production` avec
`généré` par défaut **ne change aucun montant affiché aujourd'hui** — c'est la
raison de le faire ainsi. Mais exposer le mode `sur mesure` dans l'interface est
une décision de positionnement, pas une correction de bug.

---

## Protocole de mesure à démarrer maintenant

Le mandat de refonte en cours (16 postes, chiffrage au dossier client)
est le **premier cas réel exploitable**. Pour qu'il serve à quelque chose :

1. Relever les **heures réellement passées par poste**, pas un total.
2. Étiqueter chaque poste : `neuf` / `rhabillé` / `projet`, et pour les blocs,
   `statique` / `interactif` / `partagé multi-pages`.
3. Consigner l'écart poste par poste avec l'estimation E04.

Deux ou trois mandats ainsi relevés rendent `blocRhabille` mesurable, ainsi que
le surcoût d'un bloc neuf inséré dans un site vivant. Avant ça, tout chiffre posé
sur ces facteurs reste une convention et doit s'annoncer comme telle.
