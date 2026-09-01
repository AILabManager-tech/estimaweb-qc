---
id: mult_M07
libelle: "Accessibilité SGQRI"
nature: les_deux
valeur_actuelle: 3250
valeur_proposee: null
unite: option
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: graduable
ecart_vs_125h: null
---

# Accessibilité SGQRI

## Valeur dans le code

`MULTIPLIERS.M07` = `{ min: 1 500 $, max: 5 000 $ }` CAD, médiane **3 250,0 $**.
Type : ajout fixe, non majoré par les multiplicateurs de langue ou d’urgence (limitation 8).

## Preuve

**Aucune.** Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

Recherche faite dans la grille du 2026-02-20 : elle ventile par **type de projet** et par
**phase**, jamais par fonctionnalité. Aucune de ses tables ne couvre « accessibilité sgqri ».
Aucun mandat facturé ne comporte cette ligne.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | SGQRI 008 niveau A |
| haute | SGQRI 008 niveau AA, audit avec technologies d'assistance |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Sur quoi fixer `M07` ? Si cette fonctionnalité a déjà été livrée dans un mandat réel, le
relevé d'heures de ce mandat est la preuve la plus courte à produire. Sinon, elle reste
`NON_PROUVE` et ne devrait pas être présentée à un client comme un montant ferme.
