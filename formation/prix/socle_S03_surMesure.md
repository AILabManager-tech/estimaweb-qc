---
id: socle_S03_surMesure
libelle: "E-commerce base (<100 produits) — mode surMesure"
nature: les_deux
valeur_actuelle: 16500
valeur_proposee: null
unite: forfait
statut: PROUVE
preuve_type: devis_concurrent
preuve_source: "<dossier client interne>/03_tarification_interne/2026-02-20_grille_tarifaire_web_quebec_2025-2026.docx (PRC-2026-ANALYSIS-QUEBEC v3.0), table 1.2, certitude [ÉTABLI]"
gradation: graduable
ecart_vs_125h: 94.29
---

# E-commerce base (<100 produits) — mode surMesure

## Valeur dans le code

`SOCLE_ITEMS_BY_MODE.surMesure.S03` = `{ min: 8 000, max: 25 000 }` $ CAD, médiane **16 500 $**.

Le schéma de fiche impose un `number` unique : le champ `valeur_actuelle` porte la médiane,
les deux bornes sont ici.

## Preuve

Marché relevé : E-commerce (WooCommerce) 6 000-25 000 $, médiane 12 000 $. La borne haute du moteur coïncide exactement avec la borne haute marché.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Taux horaire effectif implicite

Classe correspondante de la grille du 2026-02-20 : **Transactionnel**, 123-227 h (médiane 175 h).

```
16 500 $ ÷ 175 h = 94,29 $/h
plancher de viabilité = 120,00 $/h
taux de référence     = 125,00 $/h
```

## Classification — ligne **graduable** (2026-08-30)

La fourchette décrit un livrable qui change réellement. Définitions proposées :

| Borne | Ce qu'elle couvre |
|---|---|
| basse | catalogue simple, moins de 25 produits, une passerelle de paiement |
| haute | jusqu'à 100 produits, variantes, taxes TPS/TVQ, gestion des stocks |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

Aucune. La valeur est couverte par une source marché externe et datée. Confirmer pour passer en `VALIDE_PROPRIETAIRE`.
