---
id: calc_percentiles_scenarios
libelle: "Choix des trois points éco / recommandé / premium"
nature: les_deux
valeur_actuelle: 0.5
valeur_proposee: null
unite: facteur
statut: NON_PROUVE
preuve_type: AUCUNE
preuve_source: "aucune"
gradation: hors_classification
ecart_vs_125h: null
---

# Choix des trois points éco / recommandé / premium

## Valeur dans le code

`calculator.ts` L33-37 : `{ eco: 0, rec: 0,5, premium: 1 }`. Le percentile est appliqué
**uniformément à tous les postes** du projet.

## Preuve

**Aucune.** `KNOWN_LIMITATIONS.md` le déclare : « **Le choix des trois points (minimum, milieu,
maximum)** suppose que tous les postes d'un projet se situent simultanément au même niveau de
la grille. C'est une convention de présentation, pas une distribution observée. »

La grille du 2026-02-20 recommande bien de « toujours proposer trois options » (§5), mais ne
dit **pas** qu'elles doivent être les bornes et le milieu de chaque ligne.

La grille officielle `AUX-TARIF-2026-08` ne peut pas servir de preuve ici : son `LISEZ-MOI.md` dit mot pour mot « Les montants proviennent du moteur EstimaWeb (`~/02_projects/estimaweb-qc/src/lib/engine/matrix.ts`) ». La citer reviendrait à prouver le moteur par lui-même.

## Classification (2026-08-30)

**Hors classification binaire / graduable.** Cette ligne n'est pas une prestation vendue à un
client : c'est un coefficient, un forfait récurrent à paliers, un coût de fournisseur ou un
mécanisme de calcul. Voir [`../CLASSIFICATION_LIGNES.md`](../CLASSIFICATION_LIGNES.md) § 3.

## Question au propriétaire

Le scénario « recommandé » est le milieu arithmétique de chaque fourchette. Rien ne dit que
c'est le prix le plus probable — c'est le prix le plus **médian**. Faut-il le garder tel quel,
ou le définir comme un scénario de périmètre (ce qui est inclus) plutôt que de percentile ?
