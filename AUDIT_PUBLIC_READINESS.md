# Rapport consolidé de préparation publique — EstimaWeb QC

Date : 3 août 2026, révisé le 7 août 2026  
Branche : `audit/estimaweb-public-readiness`  
Statut final : **PRÊT POUR LIVRAISON PUBLIQUE**, après correction des défauts relevés le 7 août 2026 (voir § 12).

## 1. Fonctionnement réel

Parcours :

`démarrage → secteur → type de site → fonctionnalités/modules → langue/urgence → validation et normalisation → calcul → résultat détaillé → PDF ou modification → nouvelle estimation`

- Le secteur détermine les modules disponibles et les types de site permis.
- Le type de site est un choix unique; S03/S04 sont réservés au secteur PME.
- Les fonctions génériques et modules sectoriels sont sélectionnables au clavier ou à la souris.
- Les options redondantes restent explicites dans l’interface, mais sont désactivées avec une raison accessible lorsqu’elles sont déjà remplacées ou incluses.
- Le mode linguistique est un enum unique : une langue, bilingue exactement deux langues, ou multilingue trois langues ou plus.
- Le calculateur revalide et renormalise toute entrée, même lors d’un appel direct hors interface.
- Le résultat montre la sélection finale normalisée et trois scénarios : économique, recommandé et premium.
- Le PDF reçoit le même objet `EstimationResult`; il ne peut donc pas réintroduire une option retirée.
- Un rafraîchissement efface l’état. Aucun résultat ni renseignement personnel n’est transmis ou persisté.

## 2. Décisions métier appliquées

### Taxes et positionnement

Formulation FR appliquée à l’interface, au PDF et à la documentation :

> Estimations basées sur la grille tarifaire interne d’Auxo Systems. Montants indicatifs en dollars canadiens, avant taxes. Cette estimation ne constitue pas une soumission contractuelle.

Équivalent EN :

> Estimates based on Auxo Systems’ internal pricing grid. Indicative amounts in Canadian dollars, before taxes. This estimate does not constitute a contractual quote.

- Aucune TPS, TVQ, TVH ou autre taxe n’est calculée.
- Les taxes applicables sont renvoyées à une éventuelle soumission officielle selon le lieu du client.
- `MARKET_DATA_METADATA` identifie maintenant la grille interne Auxo Systems, révisée le `2026-08-03`, en CAD, avant taxes et non contractuelle.
- Toute affirmation de prix actuels du marché, de données 2025/2026 ou d’étude externe a été retirée.

### Langues

| Avant | Après |
|---|---|
| Deux booléens indépendants | Un enum `languageMode` |
| Bilingue et multilingue pouvaient coexister | Un seul mode est représentable |
| M01 × M02 pouvait être chaîné | M01 ou M02, jamais les deux |
| Test maximal avec les deux drapeaux | Test maximal multilingue seulement |

## 3. Inventaire des chevauchements et décisions

Le registre `src/lib/engine/compatibility.ts` contient 3 groupes mutuellement exclusifs, 7 remplacements, 8 inclusions, 17 cumuls explicitement autorisés et 2 conflits métier.

### Remplacements

| Générique | Spécialisé conservé | Capacité | Décision |
|---|---|---|---|
| M03 Réservation | MED01 RDV médical | Prise de rendez-vous | REMPLACEMENT |
| M04 Portail client | JUR03 Portail confidentiel | Portail juridique | REMPLACEMENT |
| M04 Portail client | MED03 Portail patient | Portail santé | REMPLACEMENT |
| M04 Portail client | PRO04 Portail documents | Portail professionnel | REMPLACEMENT |
| M08 Loi 25 | MED02 Loi 25 santé | Protection des données santé | REMPLACEMENT |
| M09 Formulaire complexe | PME02 Formulaire de soumission | Demande de soumission PME | REMPLACEMENT |
| M09 Formulaire complexe | PRO05 Système de soumission | Soumission professionnelle | REMPLACEMENT |

### Inclusions

| Élément porteur | Élément retiré | Capacité | Décision |
|---|---|---|---|
| S03 E-commerce basique | PME01 Catalogue | Catalogue boutique | INCLUSION |
| S04 E-commerce avancé | PME01 Catalogue | Catalogue boutique | INCLUSION |
| S03 E-commerce basique | M11 Paiement | Checkout boutique | INCLUSION |
| S04 E-commerce avancé | M11 Paiement | Checkout boutique | INCLUSION |
| S03 E-commerce basique | PME05 Menu/commande | Flux de commande | INCLUSION |
| S04 E-commerce avancé | PME05 Menu/commande | Flux de commande | INCLUSION |
| PME05 Menu/commande | M11 Paiement | Checkout du même parcours | INCLUSION |

### Cumuls à risque conservés

- réservation + paiement : agenda et passerelle de paiement distincts;
- portail client + commerce : portail métier distinct du compte boutique;
- CRM + Clio/DME/logiciel métier : CRM ventes/marketing distinct du système sectoriel;
- migration + intégration : import ponctuel distinct d’une connexion active;
- accessibilité + conformité Barreau/ordre : obligations différentes;
- formulaire distinct + calculateur : parcours et implémentations différents;
- RDV médical + multi-praticiens : agenda et architecture d’équipe distincts.

Les libellés FR/EN ont été précisés pour rendre ces différences défendables. La liste complète, y compris les options sans chevauchement, figure dans `docs/OPTION_COMPATIBILITY_MATRIX.md`.

### Conflits métier rejetés

- S03/S04 avec JUR, MED ou PRO;
- tout module sectoriel utilisé avec un autre secteur.

## 4. Comportement avant / après

| Cas | Avant | Après |
|---|---|---|
| Sélection générique puis spécialisée | Deux identifiants et deux coûts | Générique retiré immédiatement |
| Clic sur une générique déjà remplacée | Sélection possible | `aria-disabled`, aucun changement, raison visible |
| Changement vers S03/S04 | Options commerce antérieures conservées | Catalogue, commande et paiement retirés |
| Appel direct redondant | Somme brute | Entrée Zod transformée en sélection normalisée |
| Appel direct incohérent | Certaines combinaisons passaient | Rejet explicite |
| Résultat | Totaux seulement | Résumé complet de la sélection normalisée |
| PDF | Reprenait l’entrée calculée | Reprend uniquement l’entrée normalisée |

## 5. Exactitude des calculs

- Les montants unitaires de `SOCLE_ITEMS`, `SOCLE_ADDONS`, `MULTIPLIERS`, `SECTOR_MODULES`, `MAINTENANCE_TIERS`, `RECURRING_SERVICES` et `THIRD_PARTY_COSTS` n’ont pas changé.
- La formule générale, la marge de 15 %, les scénarios et les arrondis n’ont pas changé.
- Les scénarios sans redondance gardent leurs résultats codés en dur : petit vitrine, bilingue, minimum et application/intégrations.
- Le commerce contrôlé passe de `16 330 / 36 800 / 59 225 $` à `15 755 / 35 363 / 56 925 $` parce que M11 est désormais inclus dans S03.
- Le maximum médical brut retire M03, M04 et M08, déjà remplacés par MED01, MED03 et MED02.
- Les 14 règles de remplacement/inclusion produisent exactement le même objet que la sélection spécialisée/incluse seule.
- Les 17 cumuls autorisés conservent les deux capacités.
- Les 18 combinaisons secteur × type valides au maximum normalisé restent finies, non négatives et cohérentes.

Voir `CALCULATION_TEST_MATRIX.md` pour les entrées, résultats attendus, résultats observés et statuts.

## 6. Interface FR/EN

- Les deux catalogues exposent les mêmes trois modes linguistiques et la même logique de compatibilité.
- Les 24 modules sectoriels ont maintenant un objectif fonctionnel FR et EN.
- Les descriptions du commerce précisent que catalogue et paiement sont inclus.
- Les descriptions CRM, Clio, DME et logiciel métier distinguent les systèmes.
- Les explications d’option désactivée sont visibles et reliées par `aria-describedby`.
- Les boutons à rôle checkbox restent atteignables au clavier; Entrée/Espace ne peuvent pas réactiver une option bloquée.
- Le résultat présente secteur, type, fonctions, modules, langue et urgence normalisés.
- Les parcours 375×812, 768×1024 et 1440×900 n’ont aucun débordement horizontal.

## 7. PDF

Trois rapports ont été générés après les changements :

| Scénario | Locale | Taille | Pages | Sélection normalisée vérifiée |
|---|---:|---:|---:|---|
| Commerce redondant en entrée | FR | 6 424 octets | 1 A4 | M03 + PME03; M11 absent |
| Application/intégrations | EN | 6 362 octets | 1 A4 | M04 + M05 + PRO03 |
| Maximum médical | FR | 6 692 octets | 1 A4 | M03/M04/M08 absents |

- `pdftotext` confirme les accents, dates, libellés, montants et mentions fiscales FR/EN.
- Les réalisations recommandées extraites sont `35 363 $`, `$81,363` et `238 625 $`.
- Le scénario maximal a été rasterisé et inspecté : aucune coupure, aucun chevauchement et aucune seconde page vide.
- Le pied de page précise maintenant « avant taxes » / “before taxes”.
- Les tests PDF génèrent les locales FR/EN et le scénario maximal à partir d’un scénario valide.

## 8. Éléments inactifs

- `SOCLE_ADDONS` S07-S12 restent non exposés et non calculés.
- `RECURRING_SERVICES` REC01-REC07 restent non exposés et non calculés.
- TIR03-TIR07/TIR09 restent inactifs; aucun fournisseur ou coût n’a été ajouté.
- ABN00/ABN04 restent inutilisés; ABN01-ABN03 demeurent assignés automatiquement aux trois scénarios.
- S07 et REC07 sont classés CONFLIT MÉTIER avant activation, faute de périmètre distinct du socle ou de la maintenance.

## 9. Fichiers modifiés

### Moteur et modèle

- `src/lib/engine/compatibility.ts`
- `src/lib/engine/types.ts`
- `src/lib/engine/schema.ts`
- `src/lib/engine/calculator.ts`
- `src/lib/engine/matrix.ts`

### Interface et textes

- `src/hooks/useWizard.ts`
- `src/components/wizard/WizardContainer.tsx`
- `src/components/wizard/steps/BilingualStep.tsx`
- `src/components/wizard/steps/FeaturesStep.tsx`
- `src/components/wizard/steps/ResultsStep.tsx`
- `src/components/wizard/steps/SiteTypeStep.tsx`
- `src/components/ui/CheckboxGroup.tsx`
- `src/components/ui/RadioGroup.tsx`
- `src/components/results/TransparencyNotes.tsx`
- `messages/fr.json`
- `messages/en.json`

### PDF, tests et documentation

- `src/lib/pdf/EstimationPDF.tsx`
- tests Vitest sous `src/lib/**/__tests__` et `src/hooks/__tests__`
- `e2e/wizard.spec.ts`
- `playwright.config.ts`
- `README.md`
- `CALCULATION_TEST_MATRIX.md`
- `KNOWN_LIMITATIONS.md`
- `docs/OPTION_COMPATIBILITY_MATRIX.md`
- `AUDIT_PUBLIC_READINESS.md`

## 10. Validations exécutées

| Commande / contrôle | Résultat final |
|---|---|
| `npm ci` | Réussi, 580 paquets installés, 0 vulnérabilité |
| `npm run lint` | Réussi, 0 avertissement |
| `npm run typecheck` | Réussi |
| `npm test` | 108 tests réussis, 8 fichiers |
| `npm run test:e2e` | 8 parcours réussis |
| `npm run build` | Réussi, 8 pages/ressources statiques |
| `npm audit` | 0 vulnérabilité |
| PDF réels | 3/3 générés et inspectés |
| Console navigateur | Aucune erreur dans les parcours finaux |

## 11. Ambiguïtés et limites restantes

Aucune ambiguïté bloquante ne demeure dans les options actuellement sélectionnables. Les limites produit restantes sont documentées dans `KNOWN_LIMITATIONS.md` : absence de persistance, récurrents fixes, options inactives, coûts tiers statiques, pas d’audit WCAG certifié et aucune mesure de production après déploiement.

La grille est une décision interne Auxo Systems. Le produit ne prétend plus représenter le marché québécois. Toute activation future d’une option inactive doit ajouter sa règle au registre avant exposition.

## 12. Audit de fiabilité du 7 août 2026

Un audit indépendant a réexaminé la chaîne complète, sans faire confiance au présent rapport. Méthode : reconstruction d'un **oracle en arithmétique exacte** écrit depuis la spécification et non depuis le code, confronté au moteur sur **31 332 combinaisons** (18 paires secteur × type, 3 modes linguistiques, urgence, tous les singletons, toutes les paires d'options, sous-ensembles aléatoires), puis test de mutation par suppression réelle de chaque règle.

### Ce que l'audit a confirmé

Aucun écart entre le moteur et l'oracle, aucune divergence de normalisation, aucune violation de l'invariant d'affichage. Chaque règle de compatibilité supprimée fait échouer la suite. Les affirmations de confidentialité sont exactes : aucun appel réseau, aucune télémétrie, aucun stockage, CSP `connect-src 'self'`. Le PDF consomme le même objet `EstimationResult` que l'écran : aucune divergence n'est structurellement possible.

### Ce que l'audit a invalidé, et qui est corrigé

| Défaut | Constat | Correction |
|---|---|---|
| Récurrents disproportionnés | Une landing page premium facturée 4 025 $ recevait 11 148 $ de récurrent annuel (ratio 2,77). Le chiffre était exact, la recommandation qu'il portait ne l'était pas. | Le forfait de maintenance suit désormais le type de site. Ratio maximal ramené à **0,76**, verrouillé par un test sur tout le catalogue. |
| Perte silencieuse d'une option | Cocher le paiement en ligne, passer sur une boutique puis revenir à une vitrine faisait disparaître l'option sans avertissement : **1 437 $ de sous-estimation**. | L'état conserve l'intention; la normalisation devient une projection. Vérifié au niveau du reducer et dans un navigateur réel. |
| Échec silencieux du PDF | `try/finally` sans `catch` : le bouton se réactivait sans fichier ni message. | `catch` explicite, message d'erreur affiché, chemin d'échec couvert par un test. |
| Aucun filet d'erreur | Ni error boundary, ni garde sur le type de site : un état incohérent levait une `ZodError` non capturée. | `error.tsx` bilingue et garde dans le reducer. |
| Catalogue facturé deux fois | `PME01` + `PME05` n'étaient classés par aucune règle alors qu'ils recouvrent le même catalogue. | Règle d'inclusion ajoutée (8 inclusions). |
| Normalisation à passe unique | Une future règle en cascade aurait échoué silencieusement. | Normalisation en point fixe, idempotence testée. |
| Étiquettes sur-affirmées | « Équilibre optimal qualité/prix » pour un simple milieu de grille. | Étiquettes calibrées sur ce qu'elles décrivent réellement. |

### Ce qui reste non démontré

La justesse de la grille tarifaire elle-même n'est ni auditée ni auditable : c'est une décision commerciale d'Auxo Systems. La marge de 15 %, le choix des trois points de la grille et la complétude du registre de compatibilité relèvent du même statut. Voir `KNOWN_LIMITATIONS.md`.

## Verdict

**PRÊT, avec un périmètre explicite.** EstimaWeb QC peut être livré publiquement comme outil gratuit Auxo Systems : grille tarifaire interne, montants indicatifs en dollars canadiens avant taxes, aucune soumission contractuelle. Aucun double comptage sémantique connu ne subsiste parmi les options sélectionnables, et les montants récurrents sont désormais proportionnés à l'ampleur du projet.

L'outil est fiable comme **comparateur indicatif de scénarios sur la grille interne**. Il ne constitue pas une prévision du coût réel d'un projet : un cadrage humain reste nécessaire pour confirmer le périmètre, les taxes et le prix contractuel.
