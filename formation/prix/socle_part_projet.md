---
id: socle_part_projet
libelle: "Part projet du socle (non divisée par les blocs)"
nature: refonte
valeur_actuelle: 0.25
valeur_proposee: null
unite: facteur
statut: PROUVE
preuve_type: calcul_horaire
preuve_source: "<dossier client interne>/03_tarification_interne/2026-02-20_grille_tarifaire_web_quebec_2025-2026.docx (PRC-2026-ANALYSIS-QUEBEC v3.0), §2.2 « Ventilation par Phase (Heures Estimées) », 4 classes de projet"
gradation: hors_classification
ecart_vs_125h: null
---

# Part projet du socle (non divisée par les blocs)

## Valeur dans le code

`SOCLE_PROJECT_SHARE = 0,25` — part du socle qui n'est jamais divisée par le nombre de blocs.
Introduite le 2026-08-29 (voir `CALIBRATION_MOTEUR.md`).

## Preuve

Phases *Stratégie & Brief*, *QA & Tests* et *Déploiement & Formation* sur le total, §2.2 :

| Classe | Borne basse | Borne haute |
|---|---:|---:|
| Vitrine simple | 21,7 % | 24,3 % |
| Vitrine avancée | 26,3 % | 24,1 % |
| Transactionnel | 26,8 % | 25,1 % |
| Applicatif | 25,6 % | 22,2 % |

**21,7 – 26,8 % sur quatre classes et huit bornes.** Contrôle indépendant sur la ventilation
d'un mandat de refonte réel (16 postes) : 23,1 % à 30,9 % selon le classement des rondes de
révision.

C'est la seule valeur du moteur adossée à un calcul horaire documenté et recoupé par deux
sources indépendantes.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Aucune sur la valeur. Une sur la portée : la part projet est aujourd'hui facturée **en entier**
dès qu'un seul bloc est touché. Une refonte d'un bloc sur trente paie donc le même cadrage
qu'une refonte de vingt blocs. Est-ce voulu ?
