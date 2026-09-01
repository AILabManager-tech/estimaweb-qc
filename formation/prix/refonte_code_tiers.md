---
id: refonte_code_tiers
libelle: "Surcoût sur un code écrit par un tiers"
nature: refonte
valeur_actuelle: 1.3
valeur_proposee: null
unite: facteur
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: hors_classification
ecart_vs_125h: null
---

# Surcoût sur un code écrit par un tiers

## Valeur dans le code

`REFONTE_FACTORS.codeTiers` = **1,20 – 1,40** (éco / rec / premium interpolés).

## Portée

Applique un surcoût de lecture et de compréhension. Jamais comparé à des heures réelles : aucun mandat de reprise sur code tiers n'a été facturé à ce jour.

## Preuve

**Aucune.** C'est le cas limite 4 du mandat, et il est déjà tranché par `CALIBRATION_MOTEUR.md` :

- la grille du 2026-02-20 **ne comporte aucune section refonte** — vérifié par recherche
  plein texte sur `refonte`, `redesign`, `reprise`, `migration`;
- le seul mandat réellement facturé (février 2026) l'a été avec un **rabais de lancement majeur**, et la facture écrit elle-même que « la structure de base du site [...] provient
  d'un gabarit interne [...] et n'est pas facturée ». Il n'y a rien à mesurer dedans;
- `KNOWN_LIMITATIONS.md` déclare ces facteurs comme conventions depuis le 7 août 2026.

Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Protocole de mesure proposé

Le mandat de refonte en cours est le premier cas réel exploitable. Pour qu'il serve :

1. relever les **heures réellement passées par poste**, pas un total;
2. étiqueter chaque poste `neuf` / `rhabillé` / `projet`, et pour les blocs
   `statique` / `interactif` / `partagé multi-pages`;
3. consigner l'écart poste par poste avec l'estimation initiale.

Deux ou trois mandats ainsi relevés rendent le facteur mesurable. Avant ça, toute valeur
posée ici reste une convention.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Sur quoi fixer `codeTiers` ? Tant qu'aucune reprise sur code tiers n'a été mesurée, toute valeur reste posée.
