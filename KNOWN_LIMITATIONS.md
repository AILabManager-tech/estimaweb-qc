# Limites connues

Date : 3 août 2026

## Positionnement tarifaire définitif

1. **Grille interne, pas une mesure du marché.** La grille tarifaire appartient à Auxo Systems et a été révisée le 3 août 2026. Elle n’est pas issue d’une étude externe et ne doit pas être présentée comme représentative de l’ensemble du marché québécois.
2. **Montants avant taxes.** EstimaWeb ne calcule ni TPS, ni TVQ, ni TVH, ni autre taxe. Les taxes applicables seront déterminées dans une éventuelle soumission officielle selon le lieu du client.
3. **Points indicatifs.** Économique, recommandé et premium représentent le minimum, le milieu et le maximum de la grille interne. Ce ne sont ni des intervalles de confiance, ni une soumission contractuelle.

## Logique active

4. **Normalisation conservatrice.** Les remplacements et inclusions définis dans `src/lib/engine/compatibility.ts` retirent le coût générique. Les cumuls conservés sont limités à des travaux dont la différence fonctionnelle est explicitée dans l’interface et `docs/OPTION_COMPATIBILITY_MATRIX.md`.
5. **Commerce réservé au secteur PME.** Les secteurs juridique, médical et professions réglementées ne peuvent ni sélectionner ni soumettre directement S03/S04 au calculateur.
6. **Coûts tiers non liés aux choix.** Le calcul inclut toujours hébergement, domaine et CDN seulement. Les licences Shopify, CRM, courriel, réservation et stockage ne sont pas ajoutées automatiquement.
7. **Récurrents fixes.** Maintenance et coûts tiers de base sont assignés par scénario; l’utilisateur ne peut pas les choisir ni les retirer.

## Données présentes mais inactives

8. `SOCLE_ADDONS` S07-S12 : design par page, rédaction, SEO, photo, vidéo et identité ne sont ni exposés ni calculés.
9. `RECURRING_SERVICES` REC01-REC07 : SEO continu, réseaux sociaux, publicité, infolettre, chatbot, analytics et support ne sont jamais calculés.
10. TIR03-TIR07 et TIR09 restent inactifs. Aucun fournisseur ni coût tiers additionnel n’est imposé.
11. S07 et REC07 conservent un conflit de périmètre documenté avec les socles et la maintenance. Ils ne doivent pas être activés avant une décision métier.

## Produit et exploitation

12. **Aucune persistance.** Un rafraîchissement efface les réponses; il n’existe ni sauvegarde, ni partage par URL, ni historique.
13. **Aucune collecte.** Aucun lead ni rapport n’arrive chez Auxo. Le CTA ouvre seulement le client courriel de l’utilisateur.
14. **Pas de soumission.** Un cadrage humain reste nécessaire pour confirmer le périmètre, les taxes et le prix contractuel.
15. **Performance production non rebaselinée.** Le build et les parcours locaux sont sains; aucun déploiement n’a été effectué dans cette mission.
16. **Accessibilité non certifiée.** Navigation clavier, rôles, focus, explications des options désactivées et responsive sont testés, sans constituer un audit WCAG formel avec technologies d’assistance réelles.
17. **Domaine produit à confirmer.** `estimaweb-qc.vercel.app` existe; une éventuelle URL Auxo personnalisée demeure une décision de publication.

## Ambiguïtés restantes

Aucune ambiguïté bloquante ne demeure parmi les options actuellement sélectionnables. Les périmètres CRM, Clio, DME et logiciel métier ont été rendus distincts dans les textes; toute activation future des éléments inactifs doit repasser par le registre de compatibilité avant publication.
