---
id: mult_M02
libelle: "Multilingue 3+ langues"
nature: les_deux
valeur_actuelle: 2
valeur_proposee: null
unite: facteur
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: graduable
ecart_vs_125h: null
---

# Multilingue 3+ langues

## Valeur dans le code

`MULTIPLIERS.M02` = `{ min: 1,8, max: 2,2 }`, médiane **2,0**.
Type : multiplicateur chaîné sur le socle.

## Preuve

**Aucune.** Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

Recherche faite dans la grille du 2026-02-20 : elle ventile par **type de projet** et par
**phase**, jamais par fonctionnalité. Aucune de ses tables ne couvre « multilingue 3+ langues ».
Aucun mandat facturé ne comporte cette ligne.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | trois langues |
| haute | six langues ou plus, gestion des variantes régionales |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Sur quoi fixer `M02` ? Si cette fonctionnalité a déjà été livrée dans un mandat réel, le
relevé d'heures de ce mandat est la preuve la plus courte à produire. Sinon, elle reste
`NON_PROUVE` et ne devrait pas être présentée à un client comme un montant ferme.
