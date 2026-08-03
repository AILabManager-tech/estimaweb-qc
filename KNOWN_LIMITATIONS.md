# Limites connues

Date : 3 août 2026

## À décider avant de qualifier les prix de « marché actuel »

1. **Grille non sourcée.** Les valeurs ont été ajoutées le 27 février 2026 avec une référence déclarée 2025, sans source externe conservée. Elles doivent être validées et documentées humainement.
2. **Taxes absentes.** TPS/TVQ ne sont ni calculées ni explicitement incluses/exclues dans le modèle. Le positionnement public doit être clarifié.
3. **Points, pas fourchettes affichées.** Économique/recommandé/premium représentent min/milieu/max de la grille, pas une soumission ni un intervalle de confiance.

## Logique métier volontairement inchangée

4. **Bilingue et multilingue peuvent être cumulés.** Le moteur multiplie M01 × M02 si les deux sont cochés. Cette combinaison peut représenter un double comptage, mais aucune preuve ne permettait de changer la formule.
5. **Options génériques et sectorielles peuvent se chevaucher.** Exemples : réservation + prise de RDV médicale, portail client + portail patient. Les deux coûts sont additionnés sans déduplication.
6. **Commerce réservé au secteur PME.** Les secteurs juridique, médical et professions réglementées ne peuvent pas choisir S03/S04.
7. **Coûts tiers non liés aux choix.** Le calcul inclut toujours hébergement, domaine et CDN seulement. Shopify/TIR07, CRM, courriel, réservation et stockage restent absents même si une fonctionnalité correspondante est cochée.
8. **Récurrents fixes.** Maintenance et coûts tiers sont assignés par scénario; l’utilisateur ne peut pas les choisir ni les retirer.

## Données présentes mais inactives

9. `SOCLE_ADDONS` S07–S12 : design par page, rédaction, SEO, photo, vidéo et identité visuelle ne sont ni exposés ni calculés.
10. `RECURRING_SERVICES` REC01–REC07 : SEO continu, réseaux sociaux, publicité, infolettre, chatbot, analytics et support ne sont jamais calculés.
11. La matrice conserve plusieurs coûts tiers optionnels qui ne sont jamais utilisés.

## Produit et exploitation

12. **Aucune persistance.** Un rafraîchissement efface les réponses; il n’existe ni sauvegarde, ni partage par URL, ni historique.
13. **Aucune collecte.** C’est favorable à la vie privée, mais aucun lead ni rapport n’arrive chez Auxo. Le CTA ouvre seulement le client courriel de l’utilisateur.
14. **Pas de devis.** Le PDF et l’écran sont indicatifs et non contractuels; un cadrage humain reste nécessaire.
15. **Performance production non rebaselinée.** Le build et le chargement local sont sains, mais aucun déploiement n’a été fait et les Core Web Vitals de l’URL publique actuelle n’ont pas été comparés après ces changements.
16. **Accessibilité non certifiée.** Navigation clavier, rôles, focus, titres, cibles tactiles et responsive ont été testés; il ne s’agit pas d’un audit WCAG formel avec technologies d’assistance réelles.
17. **Domaine produit à confirmer.** L’URL existante `estimaweb-qc.vercel.app` répond, mais une éventuelle URL Auxo personnalisée demeure une décision de publication.

## Recommandation

Publier seulement avec les avertissements actuels. La prochaine intervention utile n’est pas un changement de code : c’est une revue humaine documentée de la grille, des chevauchements d’options, des taxes et des coûts tiers.
