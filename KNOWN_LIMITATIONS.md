# Limites connues

Date : 7 août 2026 (révision après audit de fiabilité)

## Positionnement tarifaire définitif

1. **Grille interne, pas une mesure du marché.** La grille tarifaire appartient à Auxo Systems et a été révisée le 3 août 2026. Elle n’est pas issue d’une étude externe et ne doit pas être présentée comme représentative de l’ensemble du marché québécois.
2. **Montants avant taxes.** EstimaWeb ne calcule ni TPS, ni TVQ, ni TVH, ni autre taxe. Les taxes applicables seront déterminées dans une éventuelle soumission officielle selon le lieu du client.
3. **Points indicatifs.** Économique, recommandé et premium représentent le minimum, le milieu et le maximum de la grille interne. Ce ne sont ni des intervalles de confiance, ni une soumission contractuelle.

## Logique active

4. **Normalisation conservatrice.** Les remplacements et inclusions définis dans `src/lib/engine/compatibility.ts` retirent le coût générique. Les cumuls conservés sont limités à des travaux dont la différence fonctionnelle est explicitée dans l’interface et `docs/OPTION_COMPATIBILITY_MATRIX.md`.
5. **Commerce réservé au secteur PME.** Les secteurs juridique, médical et professions réglementées ne peuvent ni sélectionner ni soumettre directement S03/S04 au calculateur.
6. **Coûts tiers non liés aux choix.** Le calcul inclut toujours hébergement, domaine et CDN seulement. Les licences Shopify, CRM, courriel, réservation et stockage ne sont pas ajoutées automatiquement.
7. **Récurrents assignés, non choisis.** Le forfait de maintenance est déterminé par le type de site (S06 → ABN00, S01 → ABN01, S02/S03 → ABN02, S04/S05 → ABN03); le scénario ne choisit que le percentile à l’intérieur de ce forfait, comme pour tous les autres postes. Les coûts tiers de base sont identiques pour tous les projets. L’utilisateur ne peut ni choisir ni retirer ces montants. ABN04 reste hors périmètre de l’estimateur.
8. **Portée des multiplicateurs.** Les suppléments de langue (M01/M02) et d’urgence (M13) s’appliquent au socle seul. Les ajouts fixes et les modules sectoriels ne sont pas majorés : ils sont déjà chiffrés pour leur propre périmètre. Le taux effectif d’un projet varie donc selon sa composition, ce que l’écran de résultat et le PDF signalent.
9. **Refonte chiffrée bloc par bloc.** Une refonte ne se calcule pas par un facteur global appliqué au neuf : chaque section porte son état (neuve, rhabillée, conservée), et chaque ajout ou module sectoriel porte le sien. L’infrastructure existante — routing, i18n, hébergement, composants partagés — n’est jamais refacturée : elle est portée par les blocs conservés, dont le coût est nul.

## Données présentes mais inactives

10. `SOCLE_ADDONS` S07-S12 : design par page, rédaction, SEO, photo, vidéo et identité ne sont ni exposés ni calculés.
11. `RECURRING_SERVICES` REC01-REC07 : SEO continu, réseaux sociaux, publicité, infolettre, chatbot, analytics et support ne sont jamais calculés.
12. TIR03-TIR07 et TIR09 restent inactifs. Aucun fournisseur ni coût tiers additionnel n’est imposé.
13. S07 et REC07 conservent un conflit de périmètre documenté avec les socles et la maintenance. Ils ne doivent pas être activés avant une décision métier.

## Produit et exploitation

14. **Aucune persistance.** Un rafraîchissement efface les réponses; il n’existe ni sauvegarde, ni partage par URL, ni historique.
15. **Aucune collecte.** Aucun lead ni rapport n’arrive chez Auxo. Le CTA ouvre seulement le client courriel de l’utilisateur.
16. **Pas de soumission.** Un cadrage humain reste nécessaire pour confirmer le périmètre, les taxes et le prix contractuel.
17. **Performance production non rebaselinée.** Le build et les parcours locaux sont sains; aucun déploiement n’a été effectué dans cette mission.
18. **Accessibilité non certifiée.** Navigation clavier, rôles, focus, explications des options désactivées et responsive sont testés, sans constituer un audit WCAG formel avec technologies d’assistance réelles.
19. **Domaine produit à confirmer.** `estimaweb-qc.vercel.app` existe; une éventuelle URL Auxo personnalisée demeure une décision de publication.

## Ambiguïtés restantes

Aucune ambiguïté bloquante ne demeure parmi les options actuellement sélectionnables. Les périmètres CRM, Clio, DME et logiciel métier ont été rendus distincts dans les textes; toute activation future des éléments inactifs doit repasser par le registre de compatibilité avant publication.

## Ce que l’audit du 7 août 2026 n’a pas pu démontrer

- **La justesse de la grille tarifaire elle-même.** L’audit a vérifié l’arithmétique appliquée *sur* la grille, jamais les montants de la grille. Ceux-ci relèvent d’une décision commerciale d’Auxo Systems et ne sont vérifiables par aucune source externe.
- **La marge d’imprévus de 15 %** est une constante posée, sans justification chiffrée documentée.
- **Les facteurs de refonte** (`REFONTE_FACTORS` dans `src/lib/engine/matrix.ts`) sont des conventions posées, au même titre que la marge de 15 %, et non des mesures : rhabillage d’un bloc à 25-40 % du coût d’un bloc neuf, surcoût de 20-40 % sur un code écrit par un tiers. Aucune n’a été comparée à des heures réellement passées; elles sont à revalider dès qu’un volume suffisant de refontes réelles le permet.
- **Le découpage en blocs suppose des sections de poids comparable.** Le coût d’un bloc est le socle divisé par le nombre de blocs. Une page dont une section pèse beaucoup plus que les autres sera donc mal représentée, dans un sens comme dans l’autre.
- **Le choix des trois points (minimum, milieu, maximum)** suppose que tous les postes d’un projet se situent simultanément au même niveau de la grille. C’est une convention de présentation, pas une distribution observée.
- **Le comportement en production** n’est pas rebaseliné : aucun déploiement n’a eu lieu.
- **La complétude du registre de compatibilité** est vérifiée par un compte figé (7 remplacements, 8 inclusions, 17 cumuls, 2 conflits) : une règle supprimée est détectée, une règle jamais écrite ne l’est pas.
