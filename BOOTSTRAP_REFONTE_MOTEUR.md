# Bootstrap — refonte du moteur d'évaluation EstimaWeb

**Écrit le 2026-08-28, à la fin d'une session qui a exposé le problème.**
Coller ce fichier au démarrage de la nouvelle session.

---

## Le mandat

Le moteur d'évaluation d'EstimaWeb produit des prix qui ne tiennent pas devant un
mandat réel. Reprendre sa conception. **Pas le corriger à la marge : comprendre
pourquoi il se trompe, puis décider ce qu'on reconstruit.**

---

## Ce qui a été établi, à ne pas re-dériver

Ces constats sont mesurés, avec les sources. Les reprendre tels quels.

### 1. Le moteur sous-évalue massivement un mandat de reprise

Cas test : refonte de la page d'accueil d'un site vitrine bilingue de 11 pages,
écrit par nous, sur maquette externe. Entrées : `PRO` / `S02` / bilingue / refonte /
code `nous` / 4 blocs neufs, 6 réhabillés, 21 conservés.

| Paramétrage | Sortie (scénario recommandé) | Rapporté à 64,8 h |
|---|---:|---:|
| Nominal | **4 540 $** | 70 $/h |
| Site déclaré à 10 blocs *(faux)* | 7 599 $ | 117 $/h |
| Les 10 blocs déclarés **entièrement neufs** | 5 532 $ | 85 $/h |

Le plancher de viabilité de la grille est de **120 $/h**. **Aucun paramétrage
honnête du moteur ne l'atteint** — même en déclarant tout neuf.

L'arithmétique du moteur est juste : le socle recalculé à la main concorde au cent
près. **Le problème est dans la calibration, pas dans le code.**

### 2. Trois causes identifiées, toutes documentées par le moteur lui-même

**a) Le socle chiffre de la génération, pas du montage.**
`matrix.ts` : `S02: { min: 3_000, max: 8_000 }, // Site vitrine 6-15 pages (généré via NEXOS)`.
Et le commit `9dce874` : « repricer S01/S02 **pour positionnement nouvel entrant** ».
Ces socles portent une décision commerciale d'acquisition. Les appliquer à du
travail manuel sur maquette tierce transporte cette décision là où elle n'a rien
à faire.

**b) Le moteur suppose des blocs de poids comparable.**
`KNOWN_LIMITATIONS.md`, mot pour mot : « Le découpage en blocs suppose des sections
de poids comparable. Le coût d'un bloc est le socle divisé par le nombre de blocs.
Une page dont une section pèse beaucoup plus que les autres sera donc mal
représentée. » C'est le cœur du problème : une refonte touche les blocs **lourds**
et conserve les blocs **légers**. Le moteur leur donne le même poids.

**c) Les facteurs de refonte sont des conventions, jamais mesurées.**
`REFONTE_FACTORS` : rhabillage 0,25-0,40 · code tiers 1,20-1,40. `KNOWN_LIMITATIONS.md`
le dit : « Aucune n'a été comparée à des heures réellement passées. » Idem pour la
marge d'imprévus de 15 %.

### 3. Un manque de modélisation non encore corrigé

**Un bloc neuf en refonte ne coûte pas le même prix qu'un bloc neuf en
construction.** Le moteur les facture à l'identique. Insérer un bloc dans un site
vivant impose de lire l'existant, de ne rien casser ailleurs, de respecter les
adresses et le référencement. Écart estimé sur le cas réel : **+38 %**.

### 4. Erreurs de méthode commises pendant la session — à ne pas refaire

- **`REC07` n'est pas un taux de développement.** C'est « Support technique étendu
  (/h) », un service récurrent, et `KNOWN_LIMITATIONS.md` signale un conflit de
  périmètre documenté dessus. Il avait servi d'ancrage de taux. Faux.
- **Ne jamais inverser un facteur de la grille** pour reconstituer un prix. En
  dérivant un « prix si c'était neuf » par `prix_refonte ÷ 0,325` ligne par ligne,
  un en-tête ressortait à 1 540 $ contre 625 $ pour une bannière pleine largeur
  bien plus complexe. Les facteurs vont dans un sens, pas dans l'autre.
- **La ventilation se dérive du prix final, jamais l'inverse.** Aucun rabais,
  aucun facteur ne s'applique poste par poste.

---

## Le problème de fond, à trancher avant de coder

**Tous les facteurs du moteur sont des conventions posées. Aucune n'est mesurée.**

Reprogrammer EstimaWeb sans données réelles ne ferait que remplacer des conventions
par d'autres conventions — avec la même confiance injustifiée. C'est la question
centrale de la prochaine session :

> **Sur quoi calibre-t-on ?**

Trois pistes, à évaluer :

1. **Mesurer.** Noter les heures réelles sur les prochains mandats, par type de
   bloc et par nature (neuf / reprise). Le mandat client en cours est justement un
   cas de refonte : c'est la première donnée réelle disponible. Lente mais solide.
2. **Reconstruire par le bas.** Abandonner le socle global divisé par blocs.
   Chiffrer par **type de bloc** (bloc statique, bloc interactif, élément partagé
   multi-pages) avec un poids propre. Demande de décider des catégories.
3. **Séparer les socles.** Un socle « génération assistée » et un socle « montage
   sur mesure ». Le mélange actuel est la cause racine de a).

---

## La contradiction centrale — c'est elle qu'il faut trancher

*(Ajouté le 2026-08-30.)*

Deux affirmations circulent dans ce dossier. **Elles ne peuvent pas être vraies
ensemble.**

| | Affirmation | Conséquence si elle est vraie |
|---|---|---|
| **A** | Le socle S02 sous-évalue : il chiffre de la génération, pas du montage manuel sur maquette externe. | Il faut deux socles distincts. La ventilation à 64,8 h tient. |
| **B** | NEXOS bâtit cette page en une heure, plus 3 à 4 h de vérification derrière. | Le socle S02 est **bien calibré**. C'est la ventilation à 64,8 h qui est fausse, d'un facteur ~10. |

Le socle porte déjà l'avantage NEXOS, écrit dans le code :

```ts
S01: { min: 1_500, max: 3_500 },    // Site vitrine 1-5 pages (généré via NEXOS)
S02: { min: 3_000, max: 8_000 },    // Site vitrine 6-15 pages (généré via NEXOS)
```

Et le commit `9dce874` l'a répercuté une seconde fois : « repricer S01/S02 pour
positionnement nouvel entrant ».

**Ne pas trancher cette question par le raisonnement.** Les deux camps ont des
arguments, et personne n'a de mesure. C'est exactement ce qui a produit le
problème d'évaluation.

## Le pari, à vérifier sur le mandat en cours

**Énoncé, posé le 2026-08-30 :** sur ce mandat précis, **la vérification prendra
plus de temps que la génération.**

Le raisonnement derrière — à falsifier, pas à croire : les contraintes de ce mandat
sont celles qu'un générateur ne voit pas. Reproduire une maquette externe au pixel,
ne rien casser sur onze pages, tenir la parité bilingue, remettre au vert une suite
de tests qui vérifie des libellés précis. Un générateur produit du plausible ; ici,
c'est le conforme qui est demandé.

### Ce qu'il faut chronométrer — trois compteurs séparés

| Compteur | Ce qu'on mesure |
|---|---|
| **T1 — génération** | Temps NEXOS seul, du brief au premier rendu |
| **T2 — correction** | Temps passé à réparer ce qu'il a produit de travers |
| **T3 — manquant** | Temps passé sur ce qu'il n'a pas produit du tout |

Noter aussi, séparément, ce qui relève du **transversal** : contenus bilingues,
adaptation mobile, non-régression sur les onze pages, mise en ligne. Ce sont les
postes que le socle ne couvre pas et qui pèsent 3 750 $ sur 8 100 $ dans la
ventilation actuelle.

### Les deux issues, décidées d'avance

- **Si T2 + T3 > T1** *(le pari tient)* → le générateur ne couvre pas la reprise
  sur maquette externe. Il faut **deux socles** : « génération assistée » et
  « montage sur mesure ». Piste 3 de la section précédente.
- **Si T2 + T3 < T1** *(le pari tombe)* → le socle S02 est bon, et c'est la
  ventilation détaillée qui surestime. Il faut alors comprendre pourquoi elle
  arrive à 64,8 h, et probablement revoir la façon de chiffrer à la main, pas le
  moteur.

Dans les deux cas, **une mesure tranche**. C'est la seule sortie du problème : tous
les facteurs du moteur sont aujourd'hui des conventions, et en ajouter une de plus
ne réglerait rien.

### Pourquoi ça presse

Ce mandat passe **une seule fois**. C'est le premier cas de refonte réelle
disponible, et la donnée la moins chère à obtenir : il suffit de noter les heures
pendant qu'on travaille de toute façon. Une fois le mandat livré sans mesure, il
faut attendre le suivant.

---

## Où sont les choses

| Quoi | Chemin |
|---|---|
| Moteur | `~/02_projects/estimaweb-qc/src/lib/engine/` — `matrix.ts` (grille), `calculator.ts` (formule), `schema.ts`, `compatibility.ts` |
| Limites déclarées | `~/02_projects/estimaweb-qc/KNOWN_LIMITATIONS.md` — **à lire en entier** |
| Intention du mode refonte | `~/02_projects/estimaweb-qc/PROMPT_REFONTE.md` |
| Grille complète extraite + simulateur Excel | Dossier client interne, hors de ce dépôt |
| Analyse du cas réel | Même dossier client : `E01` (paramétrage) et `E02` (sensibilité, **la pièce décisive**) |
| Règles de tarification | `~/.claude/projects/-home-gear-code/memory/reference_tarification_officielle.md` |

Le classeur Excel **reproduit le moteur exactement** (vérifié : sort 4 540 $ sur le
cas réel, comme l'application). Il sert à tester une recalibration sans toucher au
code.

---

## Hard rules

- **Aucun `git push`, aucun déploiement.** Rien n'est commité sans demande explicite.
- **Aucun nom, courriel ou téléphone de client** dans le code, un commit, un test,
  une démo ou une mémoire. Les slugs de dossier existants sont acceptables.
- **Ne jamais afficher un taux horaire ni un nombre d'heures** dans un document
  client. Taux de référence interne : **125 $/h**, plancher de viabilité **120 $/h**.
- **Ne jamais fabriquer une valeur normative.** Si un facteur n'est pas mesuré, le
  dire. Une convention s'annonce comme telle.
- Français du Québec, tutoiement, réponses courtes.

---

## Première étape suggérée

**Ne pas ouvrir le code tout de suite.**

1. Lire `KNOWN_LIMITATIONS.md` en entier, puis `E02`.
2. **Mettre en place les trois compteurs du pari avant de démarrer le mandat
   client.** C'est irréversible : si le mandat est livré sans mesure, la donnée est
   perdue jusqu'au prochain.
3. Trancher la contradiction A/B, puis la question « sur quoi calibre-t-on ».

Le code vient après. Reprogrammer le moteur avant d'avoir la mesure reviendrait à
remplacer des conventions par d'autres conventions.
