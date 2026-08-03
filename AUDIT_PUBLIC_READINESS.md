# Audit de préparation publique — EstimaWeb QC

Date : 3 août 2026  
Branche : `audit/estimaweb-public-readiness`  
Verdict : **PRÊT AVEC RÉSERVES**

L’application est techniquement présentable comme outil gratuit Auxo Systems, à condition de conserver partout son positionnement d’estimation indicative. La réserve bloquante pour toute affirmation de « données de marché actuelles » demeure la validation humaine de la grille tarifaire, qui n’a aucune source externe conservée.

## 1. Fonctionnement réel actuel

Parcours réel :

`démarrage → secteur → type de site → fonctionnalités/modules → langues/urgence → calcul → résultat détaillé → PDF ou modification → nouvelle estimation`

- Le bouton de démarrage fait défiler jusqu’à l’assistant déjà rendu sur la page.
- Le secteur limite les types de sites disponibles. Seul `PME` expose les types commerce électronique.
- Le changement de secteur réinitialise le type de site et les modules sectoriels incompatibles.
- Les fonctionnalités et modules sont optionnels et peuvent être sélectionnés/désélectionnés.
- La dernière étape permet d’activer indépendamment bilingue, multilingue et urgence.
- Le calcul produit trois points : économique (minimum), recommandé (milieu) et premium (maximum).
- Le résultat détaille réalisation, maintenance, coûts tiers, année 1 et récurrent annuel.
- « Modifier mes réponses » conserve les réponses et retourne au début; « Recommencer » efface tout.
- Un rafraîchissement ou une nouvelle navigation efface l’état. Aucun résultat n’est persisté ni partageable par URL.
- Le PDF est généré localement dans le navigateur. Aucune réponse ni donnée personnelle n’est transmise.

## 2. Inventaire technique

| Élément | État constaté |
|---|---|
| Architecture | Next.js 16 App Router, pages statiques `/fr` et `/en`, React 19, état local `useReducer` |
| Assistant | 5 étapes, composants accessibles par rôles radio/checkbox, navigation précédent/suivant |
| Modèle | 6 socles, 13 multiplicateurs, 24 modules sectoriels, 5 forfaits maintenance, 9 coûts tiers |
| Validation | Schéma Zod strict à l’entrée du calculateur; IDs, doublons et appartenance sectorielle vérifiés |
| Calcul | Fonction pure `calculateEstimation`; aucune dépendance réseau ou serveur |
| Traductions | Deux catalogues complets FR/EN avec résolution de locale testée |
| PDF | `@react-pdf/renderer`, A4, contenu localisé et généré côté client |
| Tests | Vitest pour matrice/calcul/validation/wizard/PDF; Playwright pour les parcours réels |
| Vercel | URL existante active; en-têtes centralisés dans Next, CSP sans `unsafe-eval` en production |
| Données | Aucune API, base de données, analytics, cookie, stockage local ou formulaire de collecte |

### Règles de calcul

Pour chaque scénario, avec `t = 0 / 0,5 / 1` :

1. `socle = interpolation(plage du type de site, t)`;
2. `chaîne = bilingue × multilingue × urgence` lorsque ces options sont actives;
3. `fonctionnalités = coût de la chaîne + somme des ajouts fixes M03–M12`;
4. `modules = somme des modules du secteur`;
5. `imprévus = 15 % × (socle après chaîne + ajouts + modules)`;
6. `réalisation = sous-total + imprévus`, arrondi au dollar;
7. `mensuel = forfait maintenance du scénario + hébergement/domaine/CDN de base`;
8. `année 1 = réalisation + 12 × mensuel`.

Les montants sont en CAD, sans décimales. Le format numérique suit la langue (`fr-CA` ou `en-CA`), sans modifier le calcul.

### Origine des valeurs

- Les valeurs sont apparues avec le premier commit du projet le **27 février 2026**.
- Le code déclarait une référence « marché QC 2025 », mais le dépôt ne contient aucune étude, facture, URL, note méthodologique ou date de collecte permettant de la vérifier.
- Cette absence est maintenant explicitée dans l’interface, le PDF, le README et `MARKET_DATA_METADATA`.
- Aucune valeur tarifaire ni formule métier n’a été changée pendant l’audit.

### Fonctions documentées ou modélisées mais absentes

- Le README affirmait des données de marché réelles/calibrées : affirmation non démontrable, retirée.
- Le formulaire de contact obligatoire ne transmettait rien : retiré plutôt que de demander des renseignements personnels sans usage.
- `SOCLE_ADDONS` contient design, rédaction, SEO, photo, vidéo et identité, mais aucune étape ne les expose et le calculateur ne les utilise pas.
- `RECURRING_SERVICES` est défini mais inutilisé.
- Les coûts tiers optionnels TIR03–TIR07/TIR09 ne dépendent pas des fonctionnalités choisies.
- L’ancien CTA promettait un devis gratuit et une réponse sous 24 h sans mécanisme associé : remplacé par un simple lien courriel Auxo.

## 3. Baseline technique

État initial :

- `npm ci` : réussi;
- `npm run lint` : échec, configuration ESLint absente et invite interactive;
- `npx tsc --noEmit` : réussi;
- `npm test` : 25 tests réussis;
- `npm run build` : réussi sous Next 14;
- `npm audit` : 17 vulnérabilités, dont 1 critique et 12 élevées.

État final :

- `npm run lint` : réussi, zéro avertissement;
- `npm run typecheck` : réussi;
- `npm test` : 47 tests réussis;
- `npm run test:e2e` : 6 parcours Playwright réussis;
- `npm run build` : réussi, 8 pages/ressources statiques produites;
- `npm audit` : zéro vulnérabilité connue.

Les dépendances majeures ont été modernisées : Next 16.3, React 19.2, next-intl 4.13, React PDF 4.5 et Vitest 3.2.

## 4. Parcours testés

### Français

- Scénario contrôlé PME, commerce basique, réservation, paiement, Google Business, bilingue.
- Sélection/désélection d’une fonctionnalité.
- Bouton suivant désactivé sans secteur ou type de site.
- Navigation précédent/suivant et conservation des réponses.
- Modification depuis le résultat, retrait du paiement et recalcul exact.
- Téléchargement PDF réel.
- Rafraîchissement depuis le résultat et retour à un état vide.

### Anglais

- Scénario professions réglementées, plateforme sur mesure, portail client, CRM et intégration métier.
- Totaux et format monétaire anglais vérifiés.
- Téléchargement PDF anglais réel.
- Libellés, progression, CTA, avertissements et lien de confidentialité vérifiés.

### États et formats

- Parcours de tous les écrans à 375×812, 768×1024 et 1440×900.
- Aucun débordement horizontal détecté.
- Navigation clavier des radios avec flèches, Home et End; activation native Entrée/Espace.
- Navigation directe `/fr/results` : 404, aucun résultat incomplet fabriqué.
- Console : aucune erreur pendant les parcours finaux.
- Chargement local de développement observé : 778 ms; aucune mesure de production n’a été simulée.

## 5. Bogues trouvés et corrections appliquées

| Problème | Correction |
|---|---|
| Lint non exécutable | ESLint 9 configuré avec une commande non interactive |
| Dépendances vulnérables/obsolètes | Mise à niveau contrôlée; audit final à zéro |
| Zod déclaré mais inutilisé | Validation stricte branchée à l’entrée du calculateur |
| Collecte obligatoire de nom/courriel sans transmission | Étape et composants supprimés |
| Progression partiellement française en anglais | Libellés courts traduits |
| `/en` retombait en français après migration next-intl | Résolution via `requestLocale` et `setRequestLocale` |
| Devise formatée en français dans l’interface EN | Format `en-CA` ajouté |
| Aucun retour éditable depuis les résultats | Ajout « Modifier mes réponses » avec recalcul |
| Cartes résultat trop étroites et montants collés | Conteneur élargi, grille responsive et valeurs non sécables |
| PDF toujours français, ancien éditeur, sans date ni options complètes | PDF FR/EN Auxo, date, options, avertissement et source ajoutés |
| Nom PDF opaque par timestamp | Nom stable avec locale et date ISO |
| Promesses et statistiques sans preuve | Retirées ou remplacées par des faits vérifiables |
| Liens Mark Systems et vieux courriel | Remplacés par Auxo Systems et `info@auxosystems.ca` |
| Radios sans navigation par flèches | Modèle clavier de radiogroupe ajouté |
| Nom accessible du bouton final différent du texte visible | Libellé ARIA synchronisé |
| Produit `1,5 × 2 × 1,4` évalué à `4,199999…`, causant un arrondi 1 $ trop bas | Décimales normalisées avant les arrondis monétaires |
| Hiérarchie de titres incomplète dans les cartes | Nom du scénario promu en `h3` |
| En-têtes Next/Vercel dupliqués et CSP `unsafe-eval` en production | Configuration centralisée; `unsafe-eval` limité au développement |
| Métadonnées partielles | Canonical, alternates, OG, Twitter, favicon, robots et sitemap ajoutés |
| Échafaudage documentaire généré par Next dev | `agentRules: false`; aucun fichier d’agent ajouté au projet |

## 6. Exactitude des calculs

- Sept scénarios contrôlés à valeurs codées en dur comparent chaque composante attendue à la sortie observée.
- Les scénarios couvrent minimum, petit vitrine, bilingue, combinaison inhabituelle, commerce, intégrations/application et maximum.
- Les 24 combinaisons secteur × type de site au maximum d’options ont été vérifiées pour valeurs finies, non négatives et cohérence des récurrents.
- `année 1 = réalisation + récurrent annuel`, `récurrent annuel = mensuel × 12` et `mensuel = maintenance + tiers` sont garantis par tests.
- L’interface FR contrôlée a produit exactement `16 330 / 36 800 / 59 225 $` de réalisation.
- L’interface EN contrôlée a produit exactement `81,363 $` pour le scénario recommandé de l’application sur mesure.

Voir `CALCULATION_TEST_MATRIX.md` pour la table de vérité complète.

## 7. État du PDF

Trois PDF ont été réellement téléchargés et inspectés : commerce FR, application EN et projet maximal FR.

- noms téléchargés : `estimaweb-qc-{fr|en}-AAAA-MM-JJ.pdf`;
- A4, une page dans les trois cas, y compris le maximum;
- accents, apostrophes, montants et dates extraits correctement avec `pdftotext`;
- rendu visuel contrôlé après rasterisation;
- secteur, type, fonctionnalités, modules, langues et urgence présents;
- montants identiques à l’interface et à la matrice;
- avertissement non contractuel, limite des sources et identité Auxo présents;
- tests automatisés FR, EN et maximum garantissant un fichier `%PDF` valide.

## 8. État FR/EN et changements visuels

- Les deux locales ont un parcours complet et un PDF propre.
- Les textes visibles Mark Systems ont été remplacés lorsqu’ils représentaient l’éditeur.
- Palette : ivoire minéral, vert forêt, bleu pétrole et charbon.
- Surfaces claires avec relief discret, boutons solides, hiérarchie simplifiée.
- Le produit reste autonome; Auxo est visible dans l’en-tête, le pied de page, le PDF et le lien « Un outil gratuit par Auxo Systems ».
- Le visuel Open Graph est volontairement bilingue; les titres et descriptions sociales restent localisés par route.

## 9. Préparation publique

- URL existante EstimaWeb et liens Auxo FR/EN vérifiés HTTP 200 le 3 août 2026.
- Aucun faux volume d’utilisateurs ni promesse de délai ne subsiste.
- Aucun analytics, cookie ou stockage de réponses; aucune bannière de consentement requise dans l’état actuel.
- La politique de confidentialité Auxo est liée même si l’outil ne collecte rien.
- Favicon, Open Graph, Twitter, robots, sitemap, canonical et alternates sont présents.
- Les cibles tactiles principales font au moins 44 px; un lien d’évitement et des focus visibles sont présents.
- Aucun déploiement, push ou fusion n’a été effectué.

## 10. Décisions humaines requises

1. Faire valider et sourcer la grille tarifaire par une personne responsable avant toute affirmation de représentativité du marché.
2. Décider du traitement des options qui se chevauchent, notamment bilingue + multilingue et portail/réservation génériques + sectoriels.
3. Décider si les ajouts design/contenu et services récurrents inutilisés doivent être exposés ou retirés du modèle.
4. Décider si le commerce électronique doit ajouter automatiquement un coût de plateforme tiers.
5. Préciser le traitement des taxes, actuellement absent.

## Verdict

**PRÊT AVEC RÉSERVES.** Le produit est fonctionnel, bilingue, testable, cohérent visuellement et suffisamment transparent pour une présentation publique gratuite Auxo Systems. Il ne doit pas être présenté comme un devis ni comme un reflet validé du marché 2026 tant que la grille n’a pas été revue et sourcée humainement.
