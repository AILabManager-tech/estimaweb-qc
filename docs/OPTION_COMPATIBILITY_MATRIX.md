# Matrice de compatibilité des options

Date de décision : 3 août 2026

Source exécutable : `src/lib/engine/compatibility.ts`

Portée : toutes les options sélectionnables et tous les éléments tarifaires actuellement inactifs.

## Principes appliqués

- **MUTUELLEMENT EXCLUSIVES** : un seul choix du groupe est représentable.
- **REMPLACEMENT** : le module spécialisé est conservé et l’option générique est retirée avant calcul.
- **INCLUSION** : la capacité est déjà comprise dans le type de site ou le module retenu; son coût séparé est retiré.
- **CUMUL AUTORISÉ** : les travaux, systèmes ou obligations sont distincts et restent facturables ensemble.
- **CONFLIT MÉTIER** : l’entrée est rejetée par le calculateur.

La normalisation est déterministe. Elle s’exécute dans le reducer du wizard et de nouveau dans le schéma Zod à l’entrée du calculateur. Le résultat et le PDF reçoivent uniquement les identifiants normalisés. Aucun montant unitaire ni aucune formule générale n’a été modifié.

## Groupes de choix uniques

| Identifiant | Nom FR | Nom EN | Catégorie | Secteur applicable | Objectif fonctionnel | Options potentiellement équivalentes | Relation retenue | Interface | Calculateur | Justification |
|---|---|---|---|---|---|---|---|---|---|---|
| JUR | Juridique | Legal | Secteur | Tous | Charger les modules juridiques | MED, PRO, PME | MUTUELLEMENT EXCLUSIVES | Radiogroupe, un seul secteur | Enum unique; modules hors secteur rejetés | Un projet reçoit une seule matrice sectorielle |
| MED | Médical / Santé | Medical / Health | Secteur | Tous | Charger les modules santé | JUR, PRO, PME | MUTUELLEMENT EXCLUSIVES | Radiogroupe, un seul secteur | Enum unique; modules hors secteur rejetés | Évite de mélanger deux catalogues sectoriels |
| PRO | Professions réglementées | Regulated professions | Secteur | Tous | Charger les modules professionnels | JUR, MED, PME | MUTUELLEMENT EXCLUSIVES | Radiogroupe, un seul secteur | Enum unique; modules hors secteur rejetés | Les modules correspondent à un seul contexte réglementaire |
| PME | PME générale | General SME | Secteur | Tous | Charger les modules PME et le commerce | JUR, MED, PRO | MUTUELLEMENT EXCLUSIVES | Radiogroupe, un seul secteur | Enum unique | Seul ce secteur expose S03 et S04 |
| S01 | Site vitrine 1-5 pages | Showcase site 1-5 pages | Type de site | Tous | Présentation simple | S02-S06 | MUTUELLEMENT EXCLUSIVES | Radiogroupe filtré par secteur | Un seul `siteType` | Un seul socle de réalisation est facturé |
| S02 | Site vitrine 6-15 pages | Showcase site 6-15 pages | Type de site | Tous | Présentation structurée | S01, S03-S06 | MUTUELLEMENT EXCLUSIVES | Radiogroupe filtré par secteur | Un seul `siteType` | Le volume de pages distingue ce socle de S01 |
| S03 | E-commerce basique | Basic e-commerce | Type de site | PME | Boutique de moins de 100 produits | PME01, PME05, M11 | INCLUSION | Catalogue, commande et paiement affichés désactivés | Retire PME01, PME05 et M11 | Une boutique inclut catalogue, commande et paiement pour le même parcours |
| S04 | E-commerce avancé | Advanced e-commerce | Type de site | PME | Boutique 100+ produits et inventaire | PME01, PME05, M11 | INCLUSION | Catalogue, commande et paiement affichés désactivés | Retire PME01, PME05 et M11 | Le socle avancé inclut les mêmes capacités de commerce de base |
| S05 | Plateforme sur mesure | Custom platform | Type de site | Tous | Application web dédiée | M04, M09, PRO02 | CUMUL AUTORISÉ | Options fonctionnelles restent disponibles | Ajoute les capacités retenues | Le socle finance l’architecture; il ne présume pas le portail, formulaire ou calculateur concret |
| S06 | Landing page | Landing page | Type de site | Tous | Page unique de conversion | S01-S05 | MUTUELLEMENT EXCLUSIVES | Radiogroupe | Un seul `siteType` | Un socle distinct suffit |
| LANG-SINGLE | Une langue | One language | Langue | Tous | Aucun supplément linguistique | LANG-BILINGUAL, LANG-MULTILINGUAL | MUTUELLEMENT EXCLUSIVES | Un radiogroupe à trois choix | `languageMode=single`, aucun multiplicateur | Un projet conserve toujours un seul mode linguistique |
| LANG-BILINGUAL | Bilingue, exactement deux langues | Bilingual, exactly two languages | Langue | Tous | Deux versions linguistiques | LANG-SINGLE, LANG-MULTILINGUAL | MUTUELLEMENT EXCLUSIVES | Remplace le choix précédent | Applique M01 seulement | Bilingue ne signifie jamais trois langues ou plus |
| LANG-MULTILINGUAL | Multilingue, trois langues ou plus | Multilingual, three or more languages | Langue | Tous | Trois versions linguistiques ou plus | LANG-SINGLE, LANG-BILINGUAL | MUTUELLEMENT EXCLUSIVES | Remplace le choix précédent | Applique M02 seulement | M01 et M02 ne peuvent plus être chaînés |

## Fonctionnalités génériques et urgence

| Identifiant | Nom FR | Nom EN | Catégorie | Secteur applicable | Objectif fonctionnel | Options potentiellement équivalentes | Relation retenue | Interface | Calculateur | Justification |
|---|---|---|---|---|---|---|---|---|---|---|
| M03 | Réservation en ligne | Online booking | Fonction générique | Tous | Prise de rendez-vous | MED01; M11 | REMPLACEMENT par MED01; CUMUL AUTORISÉ avec M11 | Désactivée si MED01 est retenu | Retirée si MED01 est présent | Le module médical couvre le même agenda; le paiement est un travail distinct |
| M04 | Portail client | Client portal | Fonction générique | Tous | Espace client sécurisé | JUR03, MED03, PRO04; S03/S04 | REMPLACEMENT par le portail sectoriel; CUMUL AUTORISÉ avec le commerce | Désactivée si un portail sectoriel est retenu | Retirée avec JUR03, MED03 ou PRO04 | Un seul portail pour le même espace; un portail métier peut toutefois être distinct d’un compte boutique |
| M05 | Intégration CRM | CRM integration | Fonction générique | Tous | Connecter un CRM ventes/marketing | JUR06, MED04, PRO03 | CUMUL AUTORISÉ | Disponible; description limite le CRM à ventes/marketing | Coûts additionnés | Clio, DME et logiciel métier sont d’autres systèmes concrets |
| M06 | Chatbot IA | AI chatbot | Fonction générique | Tous | Construire un assistant conversationnel | REC05 inactif | CUMUL AUTORISÉ | Disponible | Coût initial seulement | Construction initiale et exploitation mensuelle sont distinctes |
| M07 | Accessibilité SGQRI 008 | SGQRI 008 accessibility | Conformité | Tous | Conformité d’accessibilité gouvernementale | JUR01, PRO01 | CUMUL AUTORISÉ | Disponible | Coûts additionnés | Accessibilité et règles d’un ordre professionnel couvrent des obligations différentes |
| M08 | Conformité Loi 25 | Law 25 compliance | Conformité | Tous | Mesures générales de protection des renseignements | MED02 | REMPLACEMENT | Désactivée si MED02 est retenu | Retirée si MED02 est présent | MED02 est la mise en œuvre spécialisée pour les données de santé |
| M09 | Formulaires complexes | Complex forms | Fonction générique | Tous | Workflows conditionnels non spécialisés | PME02, PRO05; PRO02 | REMPLACEMENT par PME02/PRO05; CUMUL AUTORISÉ avec PRO02 | Désactivée si un module de soumission est retenu | Retirée avec PME02 ou PRO05 | Le module de soumission comprend son formulaire; un calculateur reste une autre application |
| M10 | Migration de données | Data migration | Service initial | Tous | Importer des données existantes | M05, JUR06, MED04, PRO03 | CUMUL AUTORISÉ | Disponible | Coûts additionnés | Une migration ponctuelle n’est pas une intégration active entre systèmes |
| M11 | Paiement en ligne | Online payment | Fonction générique | Tous | Intégrer un flux de paiement autonome | S03, S04, PME05; M03 | INCLUSION dans commerce/commande; CUMUL AUTORISÉ avec réservation | Désactivée si S03, S04 ou PME05 est retenu | Retirée pour S03, S04 ou PME05 | Le même checkout ne doit pas être facturé deux fois; réservation et paiement restent deux capacités |
| M12 | Animations avancées | Advanced animations | Présentation | Tous | Micro-interactions et animation | S07 inactif | CUMUL AUTORISÉ | Disponible | Coût additionné | L’animation est distincte du travail de design statique |
| M13 | Livraison urgente | Urgent delivery | Multiplicateur | Tous | Comprimer l’échéancier sous quatre semaines | Tous les autres choix | CUMUL AUTORISÉ | Oui/non indépendant | Appliqué une fois après le mode linguistique | Le supplément porte sur le délai, pas sur une capacité déjà facturée |

## Modules sectoriels

| Identifiant | Nom FR | Nom EN | Catégorie | Secteur | Objectif fonctionnel | Options potentiellement équivalentes | Relation retenue | Interface | Calculateur | Justification |
|---|---|---|---|---|---|---|---|---|---|---|
| JUR01 | Conformité Barreau du Québec | Quebec Bar compliance | Module sectoriel | JUR | Respecter les règles de présentation juridique | M07, M08 | CUMUL AUTORISÉ | Sélection libre | Additionné | Règles du Barreau, accessibilité et vie privée sont distinctes |
| JUR02 | Architecture domaines de pratique | Practice areas architecture | Module sectoriel | JUR | Structurer la navigation par domaine | S02 | CUMUL AUTORISÉ | Sélection libre | Additionné | Le socle détermine le volume; le module détermine l’architecture juridique |
| JUR03 | Portail client confidentiel | Confidential client portal | Module sectoriel | JUR | Échanges juridiques sécurisés | M04 | REMPLACEMENT | Sa sélection retire puis désactive M04 | M04 normalisé hors entrée | Même portail, exigences juridiques spécialisées |
| JUR04 | Blog juridique + infolettres | Legal blog + newsletters | Module sectoriel | JUR | Mise en place éditoriale juridique | REC04 inactif, S08 inactif | CUMUL AUTORISÉ si les services récurrents sont un jour activés | Sélection libre | Additionné | Mise en place initiale et production récurrente ne sont pas le même travail |
| JUR05 | SEO juridique local | Local legal SEO | Module sectoriel | JUR | Visibilité locale juridique | S09, REC01 inactifs | CUMUL AUTORISÉ | Sélection libre | Additionné | SEO local sectoriel, SEO technique et service continu peuvent avoir des périmètres distincts |
| JUR06 | Intégration Clio | Clio integration | Module sectoriel | JUR | Connecter le logiciel de pratique juridique | M05, M10 | CUMUL AUTORISÉ | Sélection libre; texte précise la distinction | Additionné | Clio n’est pas le CRM marketing; migration et connexion active sont distinctes |
| MED01 | Prise de RDV en ligne | Online appointment booking | Module sectoriel | MED | Agenda clinique | M03; M11; MED06 | REMPLACEMENT de M03; CUMUL AUTORISÉ avec paiement et multi-praticiens | Sa sélection retire puis désactive M03 | M03 normalisé hors entrée | Même réservation que M03, avec contexte clinique |
| MED02 | Conformité Loi 25 données santé | Law 25 compliance for health data | Module sectoriel | MED | Vie privée adaptée aux données de santé | M08 | REMPLACEMENT | Sa sélection retire puis désactive M08 | M08 normalisé hors entrée | Version spécialisée de la même conformité |
| MED03 | Portail patient sécurisé | Secure patient portal | Module sectoriel | MED | Espace patient protégé | M04 | REMPLACEMENT | Sa sélection retire puis désactive M04 | M04 normalisé hors entrée | Même capacité de portail, spécialisée santé |
| MED04 | Intégration DME | EMR integration | Module sectoriel | MED | Connecter le dossier médical électronique | M05, M10 | CUMUL AUTORISÉ | Sélection libre | Additionné | DME, CRM marketing et migration sont des travaux distincts |
| MED05 | Contenu éducatif patients | Patient educational content | Module sectoriel | MED | Contenus spécialisés santé | S08 inactif | REMPLACEMENT si S08 était activé pour le même contenu | Sélection libre aujourd’hui | Additionné aujourd’hui | Le contenu patient remplace toute rédaction générique du même contenu |
| MED06 | Multi-praticiens | Multi-practitioner | Module sectoriel | MED | Profils et structure pour plusieurs praticiens | MED01 | CUMUL AUTORISÉ | Sélection libre | Additionné | Architecture d’équipe et agenda clinique sont deux travaux |
| PRO01 | Conformité ordre professionnel | Professional order compliance | Module sectoriel | PRO | Règles propres à l’ordre | M07, M08 | CUMUL AUTORISÉ | Sélection libre | Additionné | Obligations professionnelles, accessibilité et vie privée sont distinctes |
| PRO02 | Calculateurs / simulateurs | Calculators / simulators | Module sectoriel | PRO | Calcul interactif propre au métier | M09 | CUMUL AUTORISÉ | Sélection libre | Additionné | Un calculateur et un formulaire distinct peuvent coexister |
| PRO03 | Intégration logiciel métier | Business software integration | Module sectoriel | PRO | Connecter ERP/comptabilité/système métier non CRM | M05, M10 | CUMUL AUTORISÉ | Sélection libre; description exclut le CRM | Additionné | Systèmes et travaux différents |
| PRO04 | Portail documents clients | Client document portal | Module sectoriel | PRO | Échange documentaire sécurisé | M04 | REMPLACEMENT | Sa sélection retire puis désactive M04 | M04 normalisé hors entrée | Même portail appliqué aux documents professionnels |
| PRO05 | Système de soumission en ligne | Online quote system | Module sectoriel | PRO | Parcours complet de soumission | M09 | REMPLACEMENT | Sa sélection retire puis désactive M09 | M09 normalisé hors entrée | Le système comprend déjà son formulaire conditionnel |
| PME01 | Catalogue produits/services | Product/service catalog | Module sectoriel | PME | Catalogue autonome hors boutique | S03, S04 | INCLUSION | Désactivé pour S03/S04 | Retiré pour S03/S04 | La boutique comprend déjà son catalogue |
| PME02 | Formulaire de soumission | Quote request form | Module sectoriel | PME | Demande conditionnelle de soumission | M09 | REMPLACEMENT | Sa sélection retire puis désactive M09 | M09 normalisé hors entrée | Le module comprend son workflow de formulaire |
| PME03 | Google Business / Maps / avis | Google Business / Maps / reviews | Module sectoriel | PME | Présence locale Google | Aucun | CUMUL AUTORISÉ | Sélection libre | Additionné | Capacité indépendante |
| PME04 | Section carrières | Careers section | Module sectoriel | PME | Postes et candidatures | M09 | CUMUL AUTORISÉ | Sélection libre | Additionné | La section peut être informative; un autre formulaire complexe peut exister |
| PME05 | Menu en ligne / commande | Online menu / ordering | Module sectoriel | PME | Menu, commande et checkout | S03, S04, M11 | INCLUSION dans S03/S04 et inclut M11 | Désactivé pour S03/S04; sa sélection désactive M11 | Retiré pour S03/S04; retire M11 ailleurs | Un seul parcours de commande et de paiement est facturé |
| PME06 | Galerie portfolio | Portfolio gallery | Module sectoriel | PME | Présenter les réalisations | Aucun | CUMUL AUTORISÉ | Sélection libre | Additionné | Capacité indépendante |
| PME07 | Intégration réseaux sociaux | Social media integration | Module sectoriel | PME | Connecter les réseaux sociaux | REC02 inactif | CUMUL AUTORISÉ | Sélection libre | Additionné | Intégration initiale et gestion mensuelle sont distinctes |

## Éléments inactifs ou non sélectionnables

Ces éléments restent dans la matrice sans nouveau contrôle et sans nouveau coût calculé. Les relations indiquent le traitement requis avant toute activation future.

| Identifiant | Nom FR | Nom EN | Catégorie | Secteur | Objectif | Équivalent potentiel | Relation retenue | Interface | Calculateur | Justification |
|---|---|---|---|---|---|---|---|---|---|---|
| S07 | Design UI/UX par page | UI/UX design per page | `SOCLE_ADDONS` inactif | Tous | Design détaillé | S02, S05 | CONFLIT MÉTIER avant activation | Absent | Ignoré | Le niveau de design déjà inclus dans les socles doit être défini avant de le facturer |
| S08 | Rédaction professionnelle par page | Professional copywriting per page | `SOCLE_ADDONS` inactif | Tous | Rédiger le contenu | MED05, JUR04 | REMPLACEMENT pour le même contenu | Absent | Ignoré | Une rédaction spécialisée ne doit pas être doublée par une ligne générique |
| S09 | SEO technique de base | Basic technical SEO | `SOCLE_ADDONS` inactif | Tous | Optimisation technique initiale | JUR05, REC01 | CUMUL AUTORISÉ | Absent | Ignoré | Technique, local sectoriel et exploitation continue sont défendables séparément |
| S10 | Photographie professionnelle | Professional photography | `SOCLE_ADDONS` inactif | Tous | Produire des photos | Aucun | CUMUL AUTORISÉ | Absent | Ignoré | Production distincte |
| S11 | Vidéo corporative | Corporate video | `SOCLE_ADDONS` inactif | Tous | Produire une vidéo | Aucun | CUMUL AUTORISÉ | Absent | Ignoré | Production distincte |
| S12 | Logo / identité visuelle | Logo / visual identity | `SOCLE_ADDONS` inactif | Tous | Créer l’identité | S07 | CUMUL AUTORISÉ | Absent | Ignoré | Identité et design d’interface ne sont pas le même livrable |
| REC01 | SEO continu | Ongoing SEO | `RECURRING_SERVICES` inactif | Tous | Optimisation mensuelle | JUR05, S09 | CUMUL AUTORISÉ | Absent | Ignoré | Service continu distinct de l’implantation initiale |
| REC02 | Gestion réseaux sociaux | Social media management | `RECURRING_SERVICES` inactif | Tous | Gérer les réseaux | PME07 | CUMUL AUTORISÉ | Absent | Ignoré | Gestion continue distincte de l’intégration |
| REC03 | Publicité numérique | Digital advertising | `RECURRING_SERVICES` inactif | Tous | Gérer les campagnes | Aucun | CUMUL AUTORISÉ | Absent | Ignoré | Service indépendant |
| REC04 | Infolettre | Newsletter operations | `RECURRING_SERVICES` inactif | Tous | Produire les envois | JUR04 | CUMUL AUTORISÉ | Absent | Ignoré | Opération mensuelle distincte de la mise en place |
| REC05 | Opération chatbot IA | AI chatbot operations | `RECURRING_SERVICES` inactif | Tous | Exploiter le chatbot | M06 | CUMUL AUTORISÉ | Absent | Ignoré | Exploitation distincte de la construction |
| REC06 | Analyse / rapport analytique | Analytics / reporting | `RECURRING_SERVICES` inactif | Tous | Produire les rapports | Aucun | CUMUL AUTORISÉ | Absent | Ignoré | Service indépendant |
| REC07 | Support technique étendu | Extended technical support | `RECURRING_SERVICES` inactif | Tous | Support horaire | ABN00-ABN04 | CONFLIT MÉTIER avant activation | Absent | Ignoré | Le support compris dans chaque maintenance n’est pas défini |
| TIR01 | Hébergement web | Web hosting | Coût tiers automatique | Tous | Héberger le site | Aucun | CUMUL AUTORISÉ | Non sélectionnable | Inclus dans la base mensuelle | Dépense tierce distincte de la réalisation |
| TIR02 | Nom de domaine | Domain name | Coût tiers automatique | Tous | Fournir le domaine | Aucun | CUMUL AUTORISÉ | Non sélectionnable | Inclus dans la base mensuelle | Dépense tierce distincte |
| TIR03 | Licence thème/plugin | Theme/plugin licence | Coût tiers inactif | Tous | Licence logicielle | Fonctions initiales | CUMUL AUTORISÉ | Absent | Ignoré | Licence externe, mais aucun déclencheur métier n’est décidé |
| TIR04 | Plateforme courriel | Email platform | Coût tiers inactif | Tous | Diffusion courriel | JUR04, REC04 | CUMUL AUTORISÉ | Absent | Ignoré | Licence externe distincte du travail de contenu |
| TIR05 | CRM | CRM licence | Coût tiers inactif | Tous | Licence CRM | M05 | CUMUL AUTORISÉ | Absent | Ignoré | Licence externe distincte de l’intégration |
| TIR06 | Réservation | Booking licence | Coût tiers inactif | Tous | Licence d’agenda | M03, MED01 | CUMUL AUTORISÉ | Absent | Ignoré | Licence externe distincte de l’implantation |
| TIR07 | E-commerce | E-commerce licence | Coût tiers inactif | PME | Licence de plateforme | S03, S04 | CUMUL AUTORISÉ | Absent | Ignoré | Coût fournisseur possible, mais aucun fournisseur n’est imposé |
| TIR08 | CDN / sécurité | CDN / security | Coût tiers automatique | Tous | Livraison et protection | Aucun | CUMUL AUTORISÉ | Non sélectionnable | Inclus dans la base mensuelle | Dépense tierce distincte |
| TIR09 | Stockage / médias | Storage / media | Coût tiers inactif | Tous | Stockage externe | S10, S11 | CUMUL AUTORISÉ | Absent | Ignoré | Dépense externe non déclenchée sans décision métier |
| ABN00 | Maintenance micro | Micro maintenance | Maintenance non utilisée | Tous | Maintenance mensuelle | ABN01-ABN04 | MUTUELLEMENT EXCLUSIVES | Non sélectionnable | Ignorée | Un seul forfait pourrait s’appliquer |
| ABN01 | Maintenance essentielle | Essential maintenance | Maintenance automatique | Tous | Scénario économique | ABN00, ABN02-ABN04 | MUTUELLEMENT EXCLUSIVES | Non sélectionnable | Assignée à `eco` | Un forfait par scénario |
| ABN02 | Maintenance standard | Standard maintenance | Maintenance automatique | Tous | Scénario recommandé | ABN00-ABN01, ABN03-ABN04 | MUTUELLEMENT EXCLUSIVES | Non sélectionnable | Assignée à `rec` | Un forfait par scénario |
| ABN03 | Maintenance premium | Premium maintenance | Maintenance automatique | Tous | Scénario premium | ABN00-ABN02, ABN04 | MUTUELLEMENT EXCLUSIVES | Non sélectionnable | Assignée à `premium` | Un forfait par scénario |
| ABN04 | Maintenance entreprise | Enterprise maintenance | Maintenance non utilisée | Tous | Maintenance étendue | ABN00-ABN03 | MUTUELLEMENT EXCLUSIVES | Non sélectionnable | Ignorée | Un seul forfait pourrait s’appliquer |

## Conflits rejetés

| Règle | Relation | Entrée rejetée | Motif |
|---|---|---|---|
| `sector-site-type` | CONFLIT MÉTIER | S03 ou S04 avec JUR, MED ou PRO | Le commerce est offert uniquement dans le parcours PME |
| `sector-module-ownership` | CONFLIT MÉTIER | Module JUR/MED/PRO/PME utilisé avec un autre secteur | La tarification et le sens du module dépendent de son secteur |

## Effet avant / après

| Cas | Avant | Après |
|---|---|---|
| Bilingue + multilingue | Deux booléens et deux multiplicateurs chaînés | Un enum; exactement un mode linguistique |
| M03 + MED01 | Deux coûts de réservation | MED01 seulement |
| M04 + portail sectoriel | Deux coûts de portail | Portail sectoriel seulement |
| M08 + MED02 | Deux coûts Loi 25 | MED02 seulement |
| M09 + PME02/PRO05 | Formulaire générique et soumission spécialisée | Module spécialisé seulement |
| S03/S04 + PME01/M11/PME05 | Socle commerce et capacités de commerce refacturées | Socle commerce seulement pour ces capacités |
| PME05 + M11 | Commande et checkout séparés pour le même parcours | PME05 seulement |
| CRM + Clio/DME/logiciel métier | Ambiguïté non expliquée | Cumul conservé avec périmètres explicitement distincts |
