# `formation/` — mémoire du chantier de révision des prix

Une session future doit pouvoir reprendre en lisant ce dossier seul.

## Contenu produit par le mandat

| Fichier | Rôle |
|---|---|
| [`AUDIT_2026-08-29.md`](AUDIT_2026-08-29.md) | Audit de phase 0 : d'où vient chaque nombre, quels gisements de preuve existent, état des tests de départ, reproduction du cas de référence. |
| [`REGISTRE_PRIX.md`](REGISTRE_PRIX.md) | Table agrégée des 86 fiches, compteur par statut, preuve de couverture. |
| [`CLASSIFICATION_LIGNES.md`](CLASSIFICATION_LIGNES.md) | Chaque ligne classée **binaire** ou **graduable**, avec la définition proposée de chaque borne. Répond à « qu'est-ce que le premium a que l'économique n'a pas ». |
| [`BOOTSTRAP_SESSION_SUIVANTE.md`](BOOTSTRAP_SESSION_SUIVANTE.md) | **À lire en premier au démarrage d'une session.** État du chantier, arbitrages rendus, ce qui bloque, hard rules. |
| [`NIVEAUX_PAR_OPTION.md`](NIVEAUX_PAR_OPTION.md) | Les 94 niveaux et leurs définitions. |
| `EstimaWeb_catalogue_2026-08-30.pdf` | Catalogue imprimable, 15 pages. |
| `prix/<id>.md` | Une fiche par ligne de tarif du moteur. |
| `GRILLE_STANDARD.md` | **Pas encore écrit** — phase 3, une fois toutes les fiches arbitrées. |

## Documents d'analyse de la racine — référencés, pas recopiés

Le § VIII du mandat demande de recopier ici tout document mis à jour ailleurs. **Ce mandat n'a
modifié aucun document de la racine** : il n'y a donc rien à recopier, et en dupliquer six qui
divergeront ensuite serait pire que d'y renvoyer.

| Document | Ce qu'il apporte à ce chantier |
|---|---|
| [`../CALIBRATION_MOTEUR.md`](../CALIBRATION_MOTEUR.md) | Arbitrage du 2026-08-29 sur la structure de la formule. Établit que les facteurs de refonte ne se calibrent sur rien. |
| [`../KNOWN_LIMITATIONS.md`](../KNOWN_LIMITATIONS.md) | Les 23 limites déclarées. Plusieurs fiches s'y adossent. |
| [`../CALCULATION_TEST_MATRIX.md`](../CALCULATION_TEST_MATRIX.md) | Vérification arithmétique et cas de refonte épinglés. |
| [`../BOOTSTRAP_REFONTE_MOTEUR.md`](../BOOTSTRAP_REFONTE_MOTEUR.md) | Contexte d'ouverture du chantier. |
| [`../AUDIT_PUBLIC_READINESS.md`](../AUDIT_PUBLIC_READINESS.md) | Audit de préparation publique du 7 août 2026. |
| [`../PROMPT_REFONTE.md`](../PROMPT_REFONTE.md) | Intention du mode refonte. |

Si l'un d'eux est modifié par une phase ultérieure, **c'est à ce moment-là** qu'il sera recopié
ici, avec la date de la copie.

## Où en est le mandat

- **Phase 0** — audit : faite.
- **Phase 1** — inventaire : faite, 86 fiches, aucune valeur proposée.
- **Phase 2** — révision prix par prix : en cours.
  - S02 : fourchette 9 500-18 125 $ et principe validés le 2026-08-29; **écriture dans
    `matrix.ts` non autorisée**.
  - Classification binaire / graduable des 49 lignes vendues : faite le 2026-08-30.
    7 lignes binaires, dont la fourchette est un écart sans contenu (×2,5 à ×4,0).
- Phases 3 à 6 : non commencées.

## Deuxième règle, ajoutée le 2026-08-30

Une fourchette n'est légitime que si on peut **écrire une phrase par borne** disant ce qu'elle
couvre. Si la phrase ne s'écrit pas, la ligne est binaire et doit porter un prix unique. Ce test
a été appliqué aux 49 lignes vendues; 7 l'ont échoué.

Classer une ligne binaire ne prouve pas son prix : ça ramène le problème de deux valeurs à une
seule, et supprime un écart injustifiable.

## Règle qui gouverne tout le registre

`AUX-TARIF-2026-08` est une **sortie** de `src/lib/engine/matrix.ts`, pas une source : son
`LISEZ-MOI.md` l'écrit explicitement. Elle ne peut donc jamais servir à prouver un montant du
moteur. Les trois seuls gisements de preuve disponibles sont détaillés au § 4 de l'audit.
