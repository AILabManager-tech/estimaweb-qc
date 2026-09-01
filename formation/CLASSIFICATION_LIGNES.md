# Classification des lignes — binaire ou graduable

**Généré le 2026-08-30.** Répond à la question posée par le propriétaire :

> « Qu'est-ce qui justifie la différence de prix entre la Loi 25 premium, la Loi 25 recommandée
> et la Loi 25 de base ? [...] Sinon, on a juste à offrir un prix unique, puis c'est le reste
> qui va graduer selon le niveau. »

---

## Le constat de départ

Pour la Loi 25, le moteur contient exactement ceci :

```ts
M08: { id: "M08", type: "ajout_fixe", value: { min: 1_000, max: 3_000 } },   // Loi 25
```

L'interface en dit une seule chose, la même aux trois niveaux : « Protection des données
personnelles — cochée par défaut (obligation québécoise) ». Dans tout `messages/fr.json`, les
seules chaînes qui mentionnent un niveau sont **les trois noms eux-mêmes** — « Économique »,
« Recommandé », « Premium ». Aucune description, aucune inclusion, aucun contenu n'est attaché
à une borne, nulle part.

**Ce que la Loi 25 à 1 000 $ n'a pas et que celle à 3 000 $ a n'existe donc pas.** C'est le même
travail, multiplié par trois.

## Le test appliqué à chaque ligne

> **Peut-on écrire une phrase par borne disant ce qu'elle couvre ?**

- **Oui** → la ligne est **graduable**. La fourchette est légitime, à condition que les deux
  phrases soient écrites et affichées.
- **Non** → la ligne est **binaire**. Elle doit porter **un prix unique**, et la fourchette
  actuelle est un écart sans contenu.

Si on n'arrive pas à écrire la phrase, c'est que la ligne est binaire — ou qu'on ne sait pas ce
qu'on vend.

## Résultat

| | Lignes | Ce que ça implique |
|---|---:|---|
| **Binaires** | **7** | fourchette supprimée, prix unique à fixer |
| **Graduables** | **42** | fourchette conservée, deux phrases à afficher |
| **Total classé** | **49** | |

---

## 1. Les 7 lignes binaires — la fourchette n'a aucun contenu

| Ligne | Définition — unique, sans niveau | Fourchette actuelle | Écart supprimé |
|---|---|---:|---:|
| `M08` Conformité Loi 25 | Conformité atteinte ou non : bandeau de consentement, politique de confidentialité, mentions légales, responsable de la protection des renseignements personnels désigné. Il n'existe pas de conformité partielle. | 1 000 $ - 3 000 $ | x3.0 |
| `M11` Paiement en ligne | Une passerelle de paiement est branchée et testée, ou elle ne l'est pas. Un second fournisseur relève d'une ligne distincte, pas d'un niveau supérieur. | 500 $ - 2 000 $ | x4.0 |
| `JUR01` Conformité Barreau du Québec | Les mentions obligatoires et les règles de publicité du Barreau sont respectées, ou elles ne le sont pas. | 500 $ - 1 500 $ | x3.0 |
| `MED02` Conformité Loi 25 (données santé) | Même logique que M08 : la conformité au régime santé est atteinte ou non. Voir la ligne M08. | 2 000 $ - 5 000 $ | x2.5 |
| `PRO01` Conformité ordre professionnel | Les exigences de l'ordre professionnel sont respectées, ou elles ne le sont pas. | 500 $ - 2 000 $ | x4.0 |
| `PME03` Google Business / Maps / avis | La fiche d'établissement est configurée, la carte intégrée et les avis affichés, ou ils ne le sont pas. | 500 $ - 1 500 $ | x3.0 |
| `PME07` Intégration réseaux sociaux | Les comptes sont liés et le flux affiché, ou ils ne le sont pas. | 500 $ - 1 500 $ | x3.0 |

Ces sept lignes sont des **états de conformité ou de raccordement**. Elles n'ont pas de degré :
le bandeau de consentement est là ou il n'est pas, la passerelle de paiement répond ou elle ne
répond pas, la fiche d'établissement est configurée ou elle ne l'est pas.

Les écarts supprimés vont de **×2,5 à ×4,0**. Aucun ne correspondait à un livrable différent.

### Ce que cela ne règle pas

Classer une ligne binaire **ne prouve pas son prix**. Ça réduit le problème de deux valeurs à
une seule, et ça supprime un écart injustifiable. Les sept lignes restent `NON_PROUVE` ou
`CONTESTE` au registre tant qu'un calcul horaire ne les adosse pas à un volume d'heures.

Le choix de la valeur unique n'est pas neutre et n'est **pas proposé ici** : prendre le minimum
actuel, c'est baisser; prendre le maximum, c'est tripler; prendre le milieu, c'est reconduire
la convention de percentile qu'on est justement en train de contester. C'est un arbitrage
distinct, ligne par ligne, adossé aux heures réelles de chaque livrable.

---

## 2. Les 42 lignes graduables — la fourchette décrit un livrable qui change

Pour chacune, les deux phrases ci-dessous sont **la définition proposée** de ce que couvre
chaque borne. Elles n'existent nulle part aujourd'hui : c'est précisément ce qui manque.

### Socles — type de site

| Ligne | Ce que couvre la borne basse | Ce que couvre la borne haute | Fourchette actuelle |
|---|---|---|---:|
| `S01` Site vitrine (1-5 pages) | 1 page publiée | 5 pages | 1 500 $ - 3 500 $ |
| `S02` Site vitrine (6-15 pages) | 6 pages | 15 pages | 3 000 $ - 8 000 $ |
| `S03` E-commerce basique | catalogue simple, moins de 25 produits, une passerelle de paiement | jusqu'à 100 produits, variantes, taxes TPS/TVQ, gestion des stocks | 8 000 $ - 25 000 $ |
| `S04` E-commerce avancé | 100 produits, variantes et promotions | catalogue étendu, comptes clients, logistique et intégrations tierces | 20 000 $ - 50 000 $ |
| `S05` Plateforme sur mesure | application sur mesure à périmètre fermé, un rôle d'utilisateur | plusieurs rôles, API publiée, traitements asynchrones | 25 000 $ - 80 000 $ |
| `S06` Landing page | une page longue, formulaire simple | une page longue, tests A/B, suivi analytique, intégration de prise de rendez-vous | 1 200 $ - 3 500 $ |

### Compléments de socle (lignes inactives)

| Ligne | Ce que couvre la borne basse | Ce que couvre la borne haute | Fourchette actuelle |
|---|---|---|---:|
| `S07` Design UI/UX (par page) | page gabarit reprenant un modèle existant | page composite, éléments dessinés spécifiquement | 300 $ - 800 $ |
| `S08` Rédaction pro (par page) | page courte, contenu fourni à reformuler | page longue, recherche et rédaction à partir de zéro | 150 $ - 400 $ |
| `S09` SEO technique de base | balises, plan de site, robots, données structurées de base | audit complet, Core Web Vitals, maillage interne, données structurées avancées | 1 500 $ - 4 000 $ |
| `S10` Photographie pro (demi-journée) | demi-journée, une dizaine de photos retouchées | demi-journée, série complète retouchée, déclinaisons multi-formats | 500 $ - 1 500 $ |
| `S11` Vidéo corporative | capsule courte, tournage sur un lieu, montage simple | plusieurs lieux, script, habillage graphique, sous-titres bilingues | 2 000 $ - 8 000 $ |
| `S12` Logo / identité visuelle | logo et déclinaisons de base | système d'identité : logo, palette, typographie, gabarits, guide d'usage | 800 $ - 5 000 $ |

### Fonctionnalités et multiplicateurs

| Ligne | Ce que couvre la borne basse | Ce que couvre la borne haute | Fourchette actuelle |
|---|---|---|---:|
| `M01` Bilingue FR/EN | contenu court, traduction et remontage FR/EN sur peu de blocs | contenu dense sur toutes les pages, adaptation culturelle, deux arborescences | x1,15 - x1,25 |
| `M02` Multilingue 3+ | trois langues | six langues ou plus, gestion des variantes régionales | x1,8 - x2,2 |
| `M03` Réservation en ligne | une ressource, un calendrier, confirmation par courriel | plusieurs ressources, acompte en ligne, rappels, synchronisation externe | 2 000 $ - 8 000 $ |
| `M04` Portail client | consultation de documents, un rôle | dépôt et échange de documents, plusieurs rôles, journal des accès | 3 000 $ - 15 000 $ |
| `M05` Intégration CRM | envoi des formulaires vers le CRM, sens unique | synchronisation bidirectionnelle, correspondance de champs, déduplication | 1 500 $ - 5 000 $ |
| `M06` Chatbot IA | assistant scripté sur une base de questions fermée | recherche sur les documents du site, mémoire de conversation, garde-fous | 2 000 $ - 10 000 $ |
| `M07` Accessibilité SGQRI 008 | SGQRI 008 niveau A | SGQRI 008 niveau AA, audit avec technologies d'assistance | 1 500 $ - 5 000 $ |
| `M09` Formulaires complexes | formulaire à une étape, validation simple | parcours à plusieurs étapes, champs conditionnels, calculs, pièces jointes | 1 000 $ - 4 000 $ |
| `M10` Migration de données | une source, moins de 500 enregistrements | plusieurs sources, reprise d'historique, nettoyage et correspondance | 1 000 $ - 5 000 $ |
| `M12` Animations avancées | transitions et apparitions au défilement | animations orchestrées, éléments interactifs, respect de `prefers-reduced-motion` | 1 500 $ - 5 000 $ |
| `M13` Urgence < 4 semaines | délai comprimé à quatre semaines | délai comprimé à deux semaines, réorganisation du calendrier de production | x1,3 - x1,5 |

### Modules sectoriels

| Ligne | Ce que couvre la borne basse | Ce que couvre la borne haute | Fourchette actuelle |
|---|---|---|---:|
| `JUR02` Architecture domaines de pratique | trois domaines de pratique | huit domaines ou plus, arborescence et maillage dédiés | 800 $ - 2 000 $ |
| `JUR03` Portail client confidentiel | consultation de documents par le client | dépôt bidirectionnel, signature, journal d'accès horodaté | 5 000 $ - 15 000 $ |
| `JUR04` Blog juridique + infolettres | blogue configuré, trois articles au lancement | blogue, infolettre, segmentation, dix articles au lancement | 1 500 $ - 4 000 $ |
| `JUR05` SEO juridique local | une ville, trois domaines | plusieurs villes, pages locales dédiées, fiches d'établissement | 2 000 $ - 6 000 $ |
| `JUR06` Intégration Clio | synchronisation des contacts | dossiers, temps et facturation synchronisés dans les deux sens | 2 000 $ - 8 000 $ |
| `MED01` Prise de RDV en ligne | un praticien, un calendrier | plusieurs praticiens, salles, rappels SMS, gestion des annulations | 3 000 $ - 10 000 $ |
| `MED03` Portail patient sécurisé | consultation de résultats | messagerie sécurisée, dépôt de documents, authentification renforcée | 5 000 $ - 20 000 $ |
| `MED04` Intégration DME | lecture seule vers le DME | échange bidirectionnel, correspondance des identifiants patients | 5 000 $ - 15 000 $ |
| `MED05` Contenu éducatif patients | dix fiches éducatives | bibliothèque structurée, recherche, versions bilingues | 1 500 $ - 4 000 $ |
| `MED06` Multi-praticiens | trois praticiens | dix praticiens ou plus, pages et calendriers individuels | 1 500 $ - 4 000 $ |
| `PRO02` Calculateurs / simulateurs | un calculateur, moins de cinq entrées | plusieurs outils, logique conditionnelle, résultats détaillés, export | 2 000 $ - 8 000 $ |
| `PRO03` Intégration logiciel métier | export ou import de fichiers | interface applicative en temps réel, authentification, reprise sur erreur | 2 000 $ - 10 000 $ |
| `PRO04` Portail documents clients | consultation de documents | dépôt, versions, permissions par document | 3 000 $ - 10 000 $ |
| `PRO05` Système de soumission en ligne | formulaire de demande structuré | configurateur, calcul de prix, génération du document de soumission | 1 500 $ - 5 000 $ |
| `PME01` Catalogue produits/services | vingt-cinq produits ou services | deux cents éléments, filtres, catégories, recherche | 1 500 $ - 4 000 $ |
| `PME02` Formulaire de soumission | formulaire à une étape | parcours conditionnel, calcul indicatif, pièces jointes | 1 000 $ - 3 000 $ |
| `PME04` Section carrières | page carrières statique | offres dynamiques, dépôt de candidature, suivi | 800 $ - 2 500 $ |
| `PME05` Menu en ligne / commande | menu affiché, commande par téléphone | commande en ligne, paiement, créneaux de retrait | 1 500 $ - 5 000 $ |
| `PME06` Galerie portfolio | quinze projets | galerie structurée par catégories, fiches de projet détaillées | 800 $ - 2 500 $ |

---

## 3. Trois cas qui ne rentrent dans aucune des deux classes

### 3.1 Les forfaits de maintenance — la gradation existe deux fois

`ABN00` à `ABN04` sont **déjà** une échelle : Micro, Essentiel, Standard, Premium, Entreprise.
Le palier est imposé par le type de site (limitation 7). Puis le percentile du scénario
s'applique **à l'intérieur du palier**.

Résultat : une vitrine de 6-15 pages reçoit `ABN02` dans les trois scénarios, mais facturée
150 $, 250 $ ou 350 $ par mois selon le scénario — pour le même forfait, avec les mêmes
inclusions. **La même gradation est appliquée deux fois.**

### 3.2 Les coûts tiers — ce ne sont pas nos prix

`TIR01` à `TIR09` sont des factures de fournisseurs que le client paie directement. Ils ne
devraient pas suivre le percentile du scénario : un hébergement coûte ce que coûte le plan
réellement souscrit, pas un point sur une fourchette. Aujourd'hui, choisir « premium » fait
passer l'hébergement de 15 $ à 150 $ par mois **sans changer de plan**.

### 3.3 Les facteurs de refonte — hors classification

`blocRhabille`, `codeTiers`, `blocConserve`, `codeNous` ne sont pas des lignes vendues : ce sont
des coefficients appliqués à d'autres lignes. Ils restent `NON_PROUVE` et sortent du périmètre
de cette classification.

---

## 4. Ce que devient l'écart entre scénarios

Sur le cas de référence, l'écart premium/éco est aujourd'hui de **×4,21** (2 525 $ / 6 074 $ /
10 636 $) pour un livrable strictement identique.

Une fois les sept lignes binaires figées, l'écart ne porte plus que sur ce qui change
réellement. Il ne disparaît pas — et il ne doit pas disparaître : un site de 6 pages et un site
de 15 pages ne coûtent pas la même chose. Mais chaque dollar d'écart devient rattaché à une
phrase qu'on peut lire au client.

C'est aussi ce qui remet le moteur en accord avec la règle 5.3 de la grille — « Client demande
un rabais : réduire le scope, jamais le prix ». Aujourd'hui le moteur fait l'inverse : il fait
varier le prix à périmètre constant.

---

## 5. Ce qui reste à trancher

1. **Les sept prix uniques.** Un par ligne binaire, adossé aux heures réelles du livrable.
   Aucune valeur n'est proposée ici.
2. **Les 42 paires de phrases.** Celles ci-dessus sont une proposition : elles doivent être
   relues ligne à ligne, puis affichées dans l'interface et le PDF, sans quoi la fourchette
   reste invérifiable pour le client comme pour nous.
3. **La double gradation de la maintenance** — le palier suffit-il, ou le percentile a-t-il un
   sens à l'intérieur ?
4. **Les coûts tiers** — doivent-ils suivre le scénario, ou le plan réellement souscrit ?

Rien n'a été écrit dans `src/lib/engine/`.
