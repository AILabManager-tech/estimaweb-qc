---
id: addon_S08
libelle: "Rédaction pro (par page)"
nature: neuf
valeur_actuelle: 275
valeur_proposee: null
unite: option
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: graduable
ecart_vs_125h: null
---

# Rédaction pro (par page)

## Valeur dans le code

`SOCLE_ADDONS.S08` = `{ min: 150, max: 400 }` $ CAD, médiane **275 $**.

**Ligne inactive** : ni exposée dans l'interface, ni calculée (limitation 13 de
`KNOWN_LIMITATIONS.md`). Elle ne peut donc pas fausser un prix affiché aujourd'hui — mais elle
serait activée sans preuve si on l'exposait.

## Preuve

Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | page courte, contenu fourni à reformuler |
| haute | page longue, recherche et rédaction à partir de zéro |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

`S08` n'a jamais été vendu ni facturé : aucune donnée réelle n'existe et aucune ligne de la grille du 2026-02-20 ne le couvre. **Cas limite 5 du mandat : je ne peux pas extrapoler.** Sur quoi fixer cette valeur, ou faut-il la retirer du moteur ?
