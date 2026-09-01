---
id: mult_M13
libelle: "Urgence < 4 semaines"
nature: les_deux
valeur_actuelle: 1.4
valeur_proposee: null
unite: facteur
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: graduable
ecart_vs_125h: null
---

# Urgence < 4 semaines

## Valeur dans le code

`MULTIPLIERS.M13` = `{ min: 1,3, max: 1,5 }`, médiane **1,4**.
Type : multiplicateur chaîné sur le socle.

## Preuve

**Aucune.** Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

Recherche faite dans la grille du 2026-02-20 : elle ventile par **type de projet** et par
**phase**, jamais par fonctionnalité. Aucune de ses tables ne couvre « urgence < 4 semaines ».
Aucun mandat facturé ne comporte cette ligne.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | délai comprimé à quatre semaines |
| haute | délai comprimé à deux semaines, réorganisation du calendrier de production |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Sur quoi fixer `M13` ? Si cette fonctionnalité a déjà été livrée dans un mandat réel, le
relevé d'heures de ce mandat est la preuve la plus courte à produire. Sinon, elle reste
`NON_PROUVE` et ne devrait pas être présentée à un client comme un montant ferme.
