# Niveaux par option — définitions

**Généré le 2026-08-30.** Étape 2 de la refonte de l'affichage : ce que contient chaque niveau
de chaque ligne vendue. C'est le contenu qui manquait — aujourd'hui l'application affiche une
fourchette sans jamais dire ce qu'il y a à ses deux bouts.

## Ce que ce document contient

| | |
|---|---:|
| Lignes vendues | **49** |
| Niveaux définis | **94** |
| Lignes à un seul niveau (binaires) | 7 |
| Lignes à deux niveaux | 39 |
| Lignes à trois niveaux | 3 |
| Niveaux portant une **limite déclarée** | **40** |

## La règle d'écriture

Chaque niveau dit **ce qu'il contient**. Le niveau d'entrée dit en plus **ce qu'il ne fait
pas** — c'est la ligne « ↳ » ci-dessous.

Cette phrase de limite est le cœur du système. Elle rend la fourchette honnête, et elle fait
monter en gamme bien mieux qu'un prix plus élevé sans explication : un client qui lit
« une double réservation reste possible, et se règle à la main » comprend immédiatement ce
qu'il achète en montant d'un cran.

Une ligne sans degré réel n'a **qu'un seul niveau** et porte un prix unique, pas une
fourchette. Sa limite explique pourquoi il n'y a pas de niveau supérieur.

## Sur les prix

La colonne « grille actuelle » est un **repère, pas une validation**. Ces montants sont ceux
d'aujourd'hui et 87 % du registre n'a aucune preuve recevable. Le chiffrage de chaque niveau
est l'étape 3, et il se fera par les heures.

### Le taux affiché n'est pas le taux facturé

*Correction 1 de l'audit du 2026-09-01.*

Le taux de référence est de **125,00 $/h**, mais la marge d'imprévus de 15 % s'applique
par-dessus. Le client paie donc **143,75 $/h** pour chaque heure annoncée.

Ce nombre doit être **écrit** partout où le taux de référence apparaît — en-tête du catalogue,
pied de page, dossier interne. Le laisser sortir d'une multiplication invisible est ce qui
permet à un écart de 15 % de circuler sans que personne ne le nomme.

| | |
|---|---|
| Taux de référence | 125,00 $/h |
| Marge d'imprévus | 15 % |
| **Taux effectif facturé** | **143,75 $/h** |

### Ce qui ne se chiffre pas en heures

*Correction 3 de l'audit.*

Trois lignes sortent du modèle horaire et se vendent **au forfait** : `S10` photographie,
`S11` vidéo, `S12` identité visuelle. Le marché les vend ainsi, et multiplier des heures par
un taux détruit l'information dans les deux sens — le coût horaire du travail y est inférieur
à 125 $, mais le prix de vente du livrable est supérieur à ce que les heures produisent, parce
qu'il incorpore le matériel, le déplacement, les droits d'usage et un temps de traitement qui
ne se facture pas à l'heure.

### Aucun contrôle ne se prouve par la grille elle-même

*Correction 5 de l'audit.*

Le catalogue imprimé du 30 août portait en tête un « contrôle » qui reconstruisait un mandat
avec ces heures et comparait le résultat à une facture antérieure. **Ce contrôle ne prouve
rien** : il compare une estimation issue de cette grille à une autre estimation issue de la
même grille non prouvée. Il est retiré et ne doit pas être réintroduit.

La règle générale : un contrôle n'est valable que s'il peut **échouer**. Comparer un montant
à un seuil dérivé de ce même montant est une tautologie, quelle que soit la forme qu'elle
prend.

### Les lignes ne s'additionnent pas toutes — 15 règles de recoupement

*Correction 4 de l'audit du 2026-09-01, la plus coûteuse des cinq.*

Le catalogue laissait entendre que les lignes s'additionnent. **Elles ne s'additionnent pas.**
Le moteur applique quinze règles qui retirent une ligne générique quand une ligne plus
spécifique la couvre déjà. Un devis monté à la main en additionnant les lignes **surfacture
jusqu'à 22 %**.

Ces règles sont exécutables — `REPLACEMENT_RULES` et `INCLUSION_RULES` dans
`src/lib/engine/compatibility.ts` — et documentées dans `docs/OPTION_COMPATIBILITY_MATRIX.md`.
Elles s'appliquent en cascade jusqu'à stabilisation. Les voici en clair.

**Sept remplacements — le module sectoriel remplace l'option générique**

| Si le devis contient | Alors on retire | Parce que |
|---|---|---|
| `MED01` Prise de rendez-vous | `M03` Réservation en ligne | Même parcours de prise de rendez-vous |
| `JUR03` Espace client confidentiel | `M04` Espace client | C'est l'espace client, version juridique |
| `MED03` Espace patient sécurisé | `M04` Espace client | C'est l'espace client, version santé |
| `PRO04` Portail de documents clients | `M04` Espace client | C'est l'espace client, version ordre professionnel |
| `MED02` Loi 25 — données de santé | `M08` Conformité Loi 25 | C'est la Loi 25, version santé |
| `PME02` Demande de soumission | `M09` Formulaires avancés | Le module contient déjà son formulaire conditionnel |
| `PRO05` Demande de soumission en ligne | `M09` Formulaires avancés | Le module contient déjà son formulaire conditionnel |

**Huit inclusions — le type de site contient déjà la capacité**

| Si le devis contient | Alors on retire | Parce que |
|---|---|---|
| `S03` Boutique < 100 produits | `PME01` Catalogue de produits | Une boutique contient son catalogue |
| `S04` Boutique > 100 produits | `PME01` Catalogue de produits | Idem |
| `S03` Boutique < 100 produits | `M11` Paiement en ligne | Une boutique contient son paiement |
| `S04` Boutique > 100 produits | `M11` Paiement en ligne | Idem |
| `S03` Boutique < 100 produits | `PME05` Menu et commande | Même parcours de commande |
| `S04` Boutique > 100 produits | `PME05` Menu et commande | Idem |
| `PME05` Menu et commande | `M11` Paiement en ligne | La commande contient son paiement |
| `PME05` Menu et commande | `PME01` Catalogue de produits | Le menu structure déjà son catalogue |

**Règle apparentée, en refonte.** Une option qui correspond à une section déjà déclarée parmi
les blocs porte l'état `bloc` et se facture à zéro : le travail a lieu, mais il est déjà chiffré
par le socle. C'est une déclaration de l'utilisateur, pas une détection — le moteur ne sait pas
quelles sections recouvrent quel module.

**Deux règles de cohérence sectorielle** complètent le dispositif sans retirer de montant :
les types boutique `S03` et `S04` ne sont offerts qu'au secteur PME, et un module sectoriel ne
peut pas être retenu pour un autre secteur.


---

## Socles — type de site


### `S01` — Site vitrine, 1 à 5 pages

*Grille actuelle : 1 500 – 3 500 $ · 2 niveaux*


**1. Présence**  
Jusqu'à 5 pages, une langue, formulaire de contact, référencement de base, mise en ligne.
  
↳ *Contenu fourni par vous, mis en forme tel quel. Pas de rédaction ni de séance photo.*

**2. Soignée**  
Jusqu'à 5 pages avec mise en page propre à chaque page, contenu retravaillé, données structurées, suivi analytique.


### `S02` — Site vitrine, 6 à 15 pages

*Grille actuelle : 3 000 – 8 000 $ · 3 niveaux*


**1. Standard**  
6 à 9 pages, structure de navigation, formulaire de contact, référencement de base, mise en ligne.
  
↳ *Gabarits de page réutilisés d'une section à l'autre.*

**2. Étendue**  
10 à 15 pages, mises en page distinctes selon le type de contenu, données structurées par page, suivi analytique.

**3. Sur mesure**  
10 à 15 pages composées une à une à partir d'une maquette dédiée, animations, contenu retravaillé.


### `S03` — Boutique en ligne, moins de 100 produits

*Grille actuelle : 8 000 – 25 000 $ · 2 niveaux*


**1. Catalogue**  
Jusqu'à 25 produits, une passerelle de paiement, taxes TPS et TVQ, livraison à taux fixe.
  
↳ *Sans variantes de produit ni gestion de stock : les quantités se suivent hors du site.*

**2. Complète**  
Jusqu'à 100 produits, variantes, gestion de stock, frais de livraison calculés, codes promotionnels, comptes clients.


### `S04` — Boutique en ligne, plus de 100 produits

*Grille actuelle : 20 000 – 50 000 $ · 2 niveaux*


**1. Volume**  
Catalogue de plus de 100 produits, variantes, promotions, importation en lot depuis un fichier.
  
↳ *Sans lien avec un système de gestion externe : le catalogue vit dans le site.*

**2. Connectée**  
Synchronisation avec votre système de gestion ou votre entrepôt, tarifs par segment de clientèle, abonnements.


### `S05` — Plateforme sur mesure

*Grille actuelle : 25 000 – 80 000 $ · 2 niveaux*


**1. Périmètre fermé**  
Application définie à l'avance, un rôle d'utilisateur, un parcours principal.
  
↳ *Le périmètre est arrêté au départ : toute nouvelle fonction est un mandat distinct.*

**2. Évolutive**  
Plusieurs rôles et permissions, interface applicative publiée, traitements en arrière-plan, tableau de bord d'administration.


### `S06` — Page unique de conversion

*Grille actuelle : 1 200 – 3 500 $ · 2 niveaux*


**1. Simple**  
Une page longue, formulaire de contact, suivi de conversion.
  
↳ *Une seule version : sans test comparatif, on ne saura pas ce qui convertit le mieux.*

**2. Optimisée**  
Deux versions testées l'une contre l'autre, prise de rendez-vous intégrée, suivi analytique détaillé.


---

## Compléments de socle


### `S07` — Conception d'une page supplémentaire

*Grille actuelle : 300 – 800 $ · 2 niveaux*


**1. Gabarit**  
Page reprenant une mise en page existante du site, contenu intégré.
  
↳ *L'agencement est repris tel quel : aucun élément n'est dessiné pour cette page.*

**2. Composée**  
Page dont l'agencement est dessiné spécifiquement, éléments visuels propres.


### `S08` — Rédaction d'une page

*Grille actuelle : 150 – 400 $ · 2 niveaux*


**1. Reformulation**  
Votre contenu réécrit pour le web : titres, sous-titres, appels à l'action.
  
↳ *Part de votre matière : aucune recherche ni entrevue.*

**2. Rédaction complète**  
Recherche, entrevue, rédaction depuis zéro, optimisation pour la recherche.


### `S09` — Référencement technique

*Grille actuelle : 1 500 – 4 000 $ · 2 niveaux*


**1. Fondations**  
Balises, plan de site, fichier robots, données structurées de base, vitesse de chargement vérifiée.
  
↳ *Traite la technique du site, pas le contenu : les textes ne sont pas retravaillés pour la recherche.*

**2. Complet**  
Audit page par page, données structurées avancées, maillage interne, Core Web Vitals optimisés, suivi de positions.


### `S10` — Photographie

*Grille actuelle : 500 – 1 500 $ · 2 niveaux*
**Vendu au forfait — hors du modèle horaire.** Le prix est celui de la séance livrée, pas
d'un nombre d'heures. Voir « Ce qui ne se chiffre pas en heures ». Le marché québécois vend
la demi-journée et la journée retouchées nettement au-dessus de ce que ces heures produisent :
la valeur actuelle est trop basse d'un facteur 1,5 à 3 selon l'audit.


**1. Demi-journée**  
Séance d'une demi-journée, une dizaine de photos retouchées et livrées aux formats du site.

**2. Journée**  
Séance d'une journée, série complète retouchée, déclinaisons pour le site et les réseaux sociaux.


### `S11` — Vidéo

*Grille actuelle : 2 000 – 8 000 $ · 2 niveaux*
**Vendu au forfait — hors du modèle horaire.** Le prix est celui de la capsule ou de la
production livrée. Voir « Ce qui ne se chiffre pas en heures ».


**1. Capsule**  
Tournage sur un lieu, montage simple, une capsule courte.
  
↳ *Sans script ni habillage graphique : on filme ce qui se présente.*

**2. Production**  
Script, tournage sur plusieurs lieux, habillage graphique, sous-titres bilingues, déclinaisons courtes.


### `S12` — Identité visuelle

*Grille actuelle : 800 – 5 000 $ · 2 niveaux*
**Vendu au forfait — hors du modèle horaire.** Le prix est celui du logo ou du système
livré. Voir « Ce qui ne se chiffre pas en heures ».


**1. Logo**  
Logo et ses déclinaisons de base, fichiers vectoriels.
  
↳ *Le logo seul : sans règles d'usage, il sera appliqué différemment par chaque personne qui touche à vos documents.*

**2. Système**  
Logo, palette, typographie, gabarits de documents, guide d'usage.


---

## Fonctionnalités et suppléments


### `M01` — Site bilingue français-anglais

*Grille actuelle : ×1.15 – ×1.25 · 2 niveaux*


**1. Traduction**  
Toutes les pages traduites, sélecteur de langue, adresses distinctes pour chaque langue.
  
↳ *Traduction fidèle du français : les textes ne sont pas réécrits pour le lectorat anglophone.*

**2. Adaptation**  
Contenu adapté au lectorat anglophone, deux arborescences pensées séparément, référencement propre à chaque langue.


### `M02` — Site en trois langues ou plus

*Grille actuelle : ×1.8 – ×2.2 · 2 niveaux*


**1. Trois langues**  
Trois langues, adresses distinctes, sélecteur.
  
↳ *Sans variantes régionales : un même texte espagnol sert tous les pays.*

**2. Multilingue étendu**  
Six langues ou plus, variantes régionales, gestion des sens de lecture, flux de traduction outillé.


### `M03` — Réservation en ligne

*Grille actuelle : 2 000 – 8 000 $ · 3 niveaux*


**1. Essentielle**  
Une personne, horaires fixes, une durée de rendez-vous, confirmation par courriel au client et à vous.
  
↳ *Les créneaux affichés ne connaissent pas votre agenda réel : une double réservation reste possible, et se règle à la main.*

**2. Synchronisée**  
Agenda relié (Google, Outlook) : les créneaux reflètent vos vraies disponibilités. Plusieurs durées, temps de battement, rappel automatique 24 h avant, annulation et report en libre-service, fuseaux horaires.

**3. Complète**  
Plusieurs personnes ou salles avec règles d'affectation, acompte payé à la réservation, politique d'annulation appliquée automatiquement, formulaire d'admission, tableau de bord et liste d'attente.


### `M04` — Espace client

*Grille actuelle : 3 000 – 15 000 $ · 3 niveaux*


**1. Consultation**  
Le client se connecte et consulte les documents que vous déposez pour lui.
  
↳ *Sens unique : le client ne peut rien déposer, et vous ne voyez pas ce qu'il a ouvert.*

**2. Échange**  
Dépôt de documents dans les deux sens, notifications, historique des accès.

**3. Espace de travail**  
Plusieurs rôles et permissions par document, versions, signature, journal horodaté, recherche.


### `M05` — Connexion à votre CRM

*Grille actuelle : 1 500 – 5 000 $ · 2 niveaux*


**1. Envoi**  
Les formulaires du site créent une fiche dans votre CRM.
  
↳ *Sens unique : une modification faite dans le CRM ne revient jamais vers le site.*

**2. Synchronisation**  
Échange dans les deux sens, correspondance des champs, détection des doublons, reprise après panne.


### `M06` — Assistant conversationnel

*Grille actuelle : 2 000 – 10 000 $ · 2 niveaux*


**1. Guidé**  
Assistant qui répond à une liste de questions préparées et redirige vers la bonne page.
  
↳ *Ne connaît que ce qui a été écrit à l'avance : toute question hors liste reste sans réponse.*

**2. Documentaire**  
Répond à partir du contenu réel de votre site, garde le fil de la conversation, garde-fous sur les sujets sensibles, transfert vers un humain, relevé des questions posées.


### `M07` — Accessibilité

*Grille actuelle : 1 500 – 5 000 $ · 2 niveaux*


**1. Niveau A**  
Conformité SGQRI 008 niveau A : navigation au clavier, textes alternatifs, structure de titres, contrastes minimaux.
  
↳ *Niveau plancher : certains contenus restent difficiles d'accès avec un lecteur d'écran.*

**2. Niveau AA**  
Conformité SGQRI 008 niveau AA, audit avec technologies d'assistance réelles, rapport de conformité.


### `M08` — Conformité Loi 25

*Grille actuelle : 1 000 – 3 000 $ · **prix unique***


**1. Conforme**  
Bandeau de consentement, politique de confidentialité, mentions légales, responsable de la protection des renseignements personnels désigné, suivi analytique conditionné au consentement, registre des incidents.
  
↳ *Il n'existe pas de conformité partielle : c'est atteint ou ça ne l'est pas.*


### `M09` — Formulaires avancés

*Grille actuelle : 1 000 – 4 000 $ · 2 niveaux*


**1. Structuré**  
Formulaire à une étape, champs validés, pièce jointe, courriel de confirmation.

**2. Conditionnel**  
Parcours à plusieurs étapes, champs qui apparaissent selon les réponses, calcul indicatif, sauvegarde en cours de route, plusieurs destinataires.


### `M10` — Reprise de vos données

*Grille actuelle : 1 000 – 5 000 $ · 2 niveaux*


**1. Une source**  
Une source, moins de 500 fiches, correspondance simple des champs.
  
↳ *Les données sont reprises telles quelles : les doublons et erreurs existants sont conservés.*

**2. Consolidation**  
Plusieurs sources, reprise de l'historique, nettoyage, dédoublonnage, contrôle de cohérence et rapport.


### `M11` — Paiement en ligne

*Grille actuelle : 500 – 2 000 $ · **prix unique***


**1. Branché**  
Une passerelle de paiement (Stripe ou équivalent) installée, testée, reçus automatiques.
  
↳ *Une seule passerelle : un second fournisseur est un mandat distinct, pas un niveau supérieur.*


### `M12` — Animations

*Grille actuelle : 1 500 – 5 000 $ · 2 niveaux*


**1. Discrètes**  
Apparitions au défilement, transitions entre les pages, effets au survol.

**2. Orchestrées**  
Séquences composées, éléments réagissant au défilement, illustrations animées, respect des préférences de mouvement réduit.


### `M13` — Délai comprimé

*Grille actuelle : ×1.3 – ×1.5 · 2 niveaux*
**Se chiffre en pourcentage du sous-total, jamais en heures fixes.**

*Correction 2 de l'audit du 2026-09-01.* Le catalogue du 30 août chiffrait l'urgence en
heures fixes. Un même supplément de 3 000 $ pesait alors **34 % d'un petit projet et 4,9 %
d'un gros** : le client qui a le moins de marge payait proportionnellement sept fois plus.
L'urgence porte sur la réorganisation d'un calendrier, qui est proportionnelle à l'ampleur
du mandat — pas sur un nombre d'heures constant.

Le moteur, lui, l'a toujours traité correctement comme un multiplicateur (`MULTIPLICATIVE_IDS`
dans `src/lib/engine/matrix.ts`). C'est le catalogue qui s'en était écarté.

**1. Quatre semaines** — *+30 % du sous-total*  
Livraison en quatre semaines : le calendrier de production est resserré.

**2. Deux semaines** — *+50 % du sous-total*  
Livraison en deux semaines : la production est réorganisée et les autres mandats décalés.


---

## Modules sectoriels


### `JUR01` — Conformité au Barreau du Québec

*Grille actuelle : 500 – 1 500 $ · **prix unique***


**1. Conforme**  
Mentions obligatoires, règles de publicité respectées, avertissements sur les communications, formulaire sans création de lien professionnel.
  
↳ *C'est respecté ou ça ne l'est pas : il n'y a pas de demi-conformité déontologique.*


### `JUR02` — Domaines de pratique

*Grille actuelle : 800 – 2 000 $ · 2 niveaux*


**1. Trois domaines**  
Trois domaines, une page chacun, navigation dédiée.
  
↳ *Pages autonomes : aucun lien entre elles, un visiteur ne circule pas d'un domaine à l'autre.*

**2. Huit domaines et plus**  
Huit domaines ou plus, arborescence, maillage entre domaines, page par avocat rattachée aux domaines.


### `JUR03` — Espace client confidentiel

*Grille actuelle : 5 000 – 15 000 $ · 2 niveaux*


**1. Consultation**  
Le client consulte les documents que vous déposez, connexion sécurisée.
  
↳ *Sens unique : le client ne peut rien vous transmettre par le site.*

**2. Dossier partagé**  
Dépôt dans les deux sens, signature électronique, journal d'accès horodaté, cloisonnement par dossier.


### `JUR04` — Blogue juridique et infolettre

*Grille actuelle : 1 500 – 4 000 $ · 2 niveaux*


**1. Blogue**  
Blogue configuré, trois articles au lancement, catégories, partage.
  
↳ *Sans infolettre : les lecteurs repartent sans qu'on puisse les recontacter.*

**2. Blogue et infolettre**  
Blogue, infolettre avec segmentation, dix articles au lancement, gabarits d'envoi.


### `JUR05` — Référencement juridique local

*Grille actuelle : 2 000 – 6 000 $ · 2 niveaux*


**1. Une ville**  
Une ville, trois domaines ciblés, fiche d'établissement.

**2. Multi-villes**  
Plusieurs villes, une page locale par ville et par domaine, fiches d'établissement multiples, suivi de positions.


### `JUR06` — Connexion à Clio

*Grille actuelle : 2 000 – 8 000 $ · 2 niveaux*


**1. Contacts**  
Les demandes du site créent un contact dans Clio.
  
↳ *Contacts seulement : dossiers, temps et facturation restent à saisir à la main.*

**2. Dossiers**  
Dossiers, saisie de temps et facturation synchronisés dans les deux sens.


### `MED01` — Prise de rendez-vous

*Grille actuelle : 3 000 – 10 000 $ · 2 niveaux*


**1. Un praticien**  
Un praticien, un calendrier, confirmation par courriel.
  
↳ *Les créneaux ne connaissent pas votre agenda réel : une double réservation reste possible.*

**2. Clinique**  
Plusieurs praticiens et salles, rappels par message texte, gestion des annulations et des retards, file d'attente.


### `MED02` — Conformité Loi 25 — données de santé

*Grille actuelle : 2 000 – 5 000 $ · **prix unique***


**1. Conforme**  
Consentement explicite, chiffrement des renseignements de santé, durées de conservation, registre des incidents, entente avec les fournisseurs.
  
↳ *C'est atteint ou ça ne l'est pas. Le régime santé est plus strict que la Loi 25 générale.*


### `MED03` — Espace patient sécurisé

*Grille actuelle : 5 000 – 20 000 $ · 2 niveaux*


**1. Résultats**  
Le patient consulte ses résultats et documents, connexion sécurisée.
  
↳ *Consultation seule : aucune messagerie, les questions repassent par le téléphone.*

**2. Suivi**  
Messagerie sécurisée, dépôt de documents par le patient, authentification à deux facteurs, historique.


### `MED04` — Connexion au dossier médical électronique

*Grille actuelle : 5 000 – 15 000 $ · 2 niveaux*


**1. Lecture**  
Le site lit les données du DME pour afficher rendez-vous et disponibilités.
  
↳ *Lecture seule : rien de saisi sur le site ne remonte au dossier.*

**2. Échange**  
Écriture dans le DME, correspondance des identifiants patients, traçabilité des accès.


### `MED05` — Contenu éducatif pour les patients

*Grille actuelle : 1 500 – 4 000 $ · 2 niveaux*


**1. Fiches**  
Dix fiches thématiques, mise en page lisible, version imprimable.

**2. Bibliothèque**  
Bibliothèque structurée par thème, recherche, versions bilingues, niveaux de lecture.


### `MED06` — Plusieurs praticiens

*Grille actuelle : 1 500 – 4 000 $ · 2 niveaux*


**1. Trois**  
Trois praticiens, une page chacun, spécialités.

**2. Dix et plus**  
Dix praticiens ou plus, pages et calendriers individuels, filtres par spécialité et disponibilité.


### `PRO01` — Conformité à votre ordre professionnel

*Grille actuelle : 500 – 2 000 $ · **prix unique***


**1. Conforme**  
Mentions du titre et du numéro de permis, règles de publicité de l'ordre, avertissements requis.
  
↳ *C'est respecté ou ça ne l'est pas.*


### `PRO02` — Calculateurs et simulateurs

*Grille actuelle : 2 000 – 8 000 $ · 2 niveaux*


**1. Un outil**  
Un calculateur, moins de cinq entrées, un résultat affiché à l'écran.
  
↳ *Le résultat n'est ni envoyé, ni conservé, ni exportable : le visiteur repart sans trace.*

**2. Plusieurs outils**  
Plusieurs calculateurs, logique conditionnelle, résultat détaillé, envoi par courriel, export et récupération du contact.


### `PRO03` — Connexion à votre logiciel métier

*Grille actuelle : 2 000 – 10 000 $ · 2 niveaux*


**1. Fichiers**  
Import et export de fichiers entre le site et votre logiciel.
  
↳ *Décalé : les données transitent par fichier, à la demande, jamais en direct.*

**2. Temps réel**  
Interface applicative en direct, authentification, reprise sur erreur, journal des échanges.


### `PRO04` — Portail de documents clients

*Grille actuelle : 3 000 – 10 000 $ · 2 niveaux*


**1. Consultation**  
Le client consulte les documents que vous déposez.
  
↳ *Sens unique : le client ne peut rien déposer.*

**2. Échange**  
Dépôt dans les deux sens, versions, permissions par document, notifications.


### `PRO05` — Demande de soumission en ligne

*Grille actuelle : 1 500 – 5 000 $ · 2 niveaux*


**1. Formulaire**  
Formulaire de demande structuré, pièces jointes, accusé de réception.
  
↳ *Vous chiffrez ensuite à la main : le client n'a aucun ordre de grandeur immédiat.*

**2. Configurateur**  
Configurateur avec calcul de prix, génération du document de soumission, suivi de l'état de la demande.


### `PME01` — Catalogue de produits ou de services

*Grille actuelle : 1 500 – 4 000 $ · 2 niveaux*


**1. Vitrine**  
Jusqu'à 25 éléments, fiche par élément, photos.
  
↳ *Sans filtres ni recherche : au-delà de vingt-cinq éléments, on ne trouve plus rien.*

**2. Catalogue**  
Jusqu'à 200 éléments, catégories, filtres, recherche, comparaison.


### `PME02` — Demande de soumission

*Grille actuelle : 1 000 – 3 000 $ · 2 niveaux*


**1. Formulaire**  
Formulaire structuré, pièces jointes, accusé de réception.

**2. Guidé**  
Parcours conditionnel selon le type de projet, estimation indicative affichée, relance automatique.


### `PME03` — Fiche Google et avis

*Grille actuelle : 500 – 1 500 $ · **prix unique***


**1. Configuré**  
Fiche d'établissement configurée, carte intégrée au site, avis affichés, données structurées d'entreprise locale.
  
↳ *C'est en place ou ça ne l'est pas.*


### `PME04` — Section carrières

*Grille actuelle : 800 – 2 500 $ · 2 niveaux*


**1. Page**  
Page carrières, offres écrites en dur, candidature par courriel.
  
↳ *Chaque nouvelle offre demande une modification du site.*

**2. Offres gérées**  
Offres publiées et retirées sans intervention, formulaire de candidature avec pièces jointes, suivi des candidatures.


### `PME05` — Menu et commande en ligne

*Grille actuelle : 1 500 – 5 000 $ · 2 niveaux*


**1. Menu**  
Menu affiché, catégories, allergènes, commande par téléphone.
  
↳ *Consultation seule : aucune commande n'est prise par le site.*

**2. Commande**  
Commande en ligne, paiement, créneaux de retrait ou de livraison, gestion des ruptures.


### `PME06` — Galerie de réalisations

*Grille actuelle : 800 – 2 500 $ · 2 niveaux*


**1. Galerie**  
Jusqu'à quinze réalisations, photos, légendes.

**2. Portfolio**  
Galerie par catégorie, fiche détaillée par projet, avant-après, témoignage rattaché.


### `PME07` — Réseaux sociaux

*Grille actuelle : 500 – 1 500 $ · **prix unique***


**1. Reliés**  
Comptes liés, boutons de partage, flux affiché sur le site, aperçus corrects au partage.
  
↳ *C'est en place ou ça ne l'est pas.*


---

## Ce que ce document ne règle pas

1. **Les prix.** Aucun niveau n'est chiffré. C'est l'étape 3, par les heures — et pour les
   sept lignes binaires, il n'existe aujourd'hui aucun montant, seulement une fourchette qu'il
   faut remplacer.
2. **Le socle.** `S01` à `S06` sont ici découpés en niveaux comme les autres lignes, mais leur
   gradation naturelle serait le nombre de pages. Cette segmentation reste une décision
   distincte, écartée pour l'instant.
3. **Le nombre de niveaux.** Trois lignes en ont trois, trente-neuf en ont deux, sept n'en ont
   qu'un. Ce n'est pas un choix esthétique : c'est le nombre de paliers que le livrable
   supporte réellement. À relire ligne par ligne.
4. **La traduction anglaise.** Chaque niveau devra exister en anglais dans `messages/en.json`,
   soit 94 blocs à traduire.
