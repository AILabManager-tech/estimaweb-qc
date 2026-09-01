---
id: addon_S07
libelle: "Design UI/UX (par page)"
nature: neuf
valeur_actuelle: 550
valeur_proposee: null
unite: option
statut: CONTESTE
preuve_type: grille_officielle
preuve_source: "<dossier client interne>/03_tarification_interne/2026-02-20_grille_tarifaire_web_quebec_2025-2026.docx (PRC-2026-ANALYSIS-QUEBEC v3.0), §2.3 « Coût par Page Additionnelle » + KNOWN_LIMITATIONS.md limitation 16"
gradation: graduable
ecart_vs_125h: null
---

# Design UI/UX (par page)

## Valeur dans le code

`SOCLE_ADDONS.S07` = `{ min: 300, max: 800 }` $ CAD, médiane **550 $**.

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
| basse | page gabarit reprenant un modèle existant |
| haute | page composite, éléments dessinés spécifiquement |

Ces deux phrases **n'existent nulle part aujourd'hui** — ni dans le code, ni dans l'interface,
ni dans le PDF. Tant qu'elles ne sont pas affichées, la fourchette reste invérifiable pour le
client comme pour nous.
Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 2.

## Question au propriétaire

`S07` a un conflit de périmètre documenté avec les socles (limitation 16 de `KNOWN_LIMITATIONS.md`) : le design par page est déjà compris dans le socle. Le §2.3 de la grille du 2026-02-20 chiffre par ailleurs une page Headless/Next.js à 600-1 000 $ (simple) ou 1 200-2 500 $ (complexe) — soit au-dessus de 300-800 $, mais ces montants couvrent la page entière, pas le seul design. **Faut-il retirer S07, ou le redéfinir hors du périmètre du socle ?**
