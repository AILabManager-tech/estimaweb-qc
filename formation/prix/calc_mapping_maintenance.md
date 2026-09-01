---
id: calc_mapping_maintenance
libelle: "Affectation du forfait de maintenance au type de site"
nature: les_deux
valeur_actuelle: 0
valeur_proposee: null
unite: facteur
statut: CONTESTE
preuve_type: commit_git
preuve_source: "commit 97451ed (mapping par scénario) puis modification ultérieure (mapping par type de site), sans commit dédié citant une source"
gradation: hors_classification
ecart_vs_125h: null
---

# Affectation du forfait de maintenance au type de site

## Valeur dans le code

`SITE_TYPE_MAINTENANCE` : `S06→ABN00`, `S01→ABN01`, `S02→ABN02`, `S03→ABN02`, `S04→ABN03`,
`S05→ABN03`. `ABN04` hors périmètre.

Le champ `valeur_actuelle` vaut `0` : cette fiche porte une **table d'affectation**, pas un
montant. C'est une limite du schéma du § VI, signalée plutôt que contournée.

## Preuve

Le mapping d'origine (`97451ed`) liait le forfait au **scénario** (`eco→ABN01`, `rec→ABN02`,
`premium→ABN03`). Il lie aujourd'hui le forfait au **type de site**. Le changement est
cohérent — il évite qu'un client « économique » paie moins de maintenance pour le même site —
et il est déclaré en limitation 7. Mais aucun commit ne cite de source pour l'affectation
retenue, et rien n'explique pourquoi `S03` (e-commerce) partage le palier de `S02` (vitrine)
alors que son socle est trois fois supérieur.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Pourquoi un e-commerce (`S03`, socle 8 000-25 000 $) et une vitrine (`S02`, socle
3 000-8 000 $) partagent-ils le même forfait de maintenance `ABN02` ? C'est le cas limite 3 du
mandat : la valeur peut être bonne, l'affectation ne l'est peut-être pas.
