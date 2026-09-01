---
id: mult_M11
libelle: "Paiement en ligne"
nature: les_deux
valeur_actuelle: 1250
valeur_proposee: null
unite: option
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: binaire
ecart_vs_125h: null
---

# Paiement en ligne

## Valeur dans le code

`MULTIPLIERS.M11` = `{ min: 500 $, max: 2 000 $ }` CAD, médiane **1 250,0 $**.
Type : ajout fixe, non majoré par les multiplicateurs de langue ou d’urgence (limitation 8).

## Preuve

**Aucune.** Origine dans l'historique : commit `97451ed` du 27 février 2026, dont le message dit « Moteur de calcul calibré marché QC » sans citer aucune source. Selon le § V du mandat, « c'est le prix du marché » n'est pas une preuve.

Recherche faite dans la grille du 2026-02-20 : elle ventile par **type de projet** et par
**phase**, jamais par fonctionnalité. Aucune de ses tables ne couvre « paiement en ligne ».
Aucun mandat facturé ne comporte cette ligne.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification — ligne **binaire** (2026-08-30)

Cette ligne n'a pas de degré. Définition unique, sans niveau :

> Une passerelle de paiement est branchée et testée, ou elle ne l'est pas. Un second fournisseur relève d'une ligne distincte, pas d'un niveau supérieur.

**La fourchette actuelle est un écart sans contenu** : rien, ni dans le code ni dans
l'interface, ne dit ce que la borne haute couvre de plus que la borne basse. Elle doit être
remplacée par un prix unique.

Classer la ligne comme binaire **ne prouve pas ce prix** : ça ramène le problème de deux
valeurs à une seule. Le statut de cette fiche ne change pas pour autant.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 1.

## Question au propriétaire

Sur quoi fixer `M11` ? Si cette fonctionnalité a déjà été livrée dans un mandat réel, le
relevé d'heures de ce mandat est la preuve la plus courte à produire. Sinon, elle reste
`NON_PROUVE` et ne devrait pas être présentée à un client comme un montant ferme.
