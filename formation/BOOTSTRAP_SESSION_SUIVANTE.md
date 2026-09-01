# Bootstrap — session suivante, EstimaWeb

**Écrit le 2026-08-31, à la clôture de la session précédente.**
À coller au démarrage. Ne rien re-dériver de ce qui est ici.

---

## Où en est le chantier

Refonte du moteur et de l'affichage d'EstimaWeb, en 4 étapes.

| Étape | État |
|---|---|
| 1 — La forme de l'écran | **faite et validée** |
| 2 — Les définitions des 49 lignes et 94 niveaux | **faite** |
| 3 — Chiffrer chaque niveau par les heures | **en attente des réponses du propriétaire** |
| 4 — Implémenter : moteur, interface, PDF, anglais | non commencée |

**Rien n'est commité, rien n'est poussé, `git status` est inchangé depuis le 2026-08-29.**
148 tests unitaires verts, 9 Playwright verts.

---

## Les arbitrages déjà rendus — ne pas les rouvrir

1. **Taux de référence du mandat : 70,06 $/h** (4 540 $ / 64,8 h). Le 63 $/h du mandat
   d'origine venait d'une ventilation à 71,5 h écartée comme erreur de méthode; il reste
   comme trace historique corrigée.
2. **La remise d'acquisition sort des socles.** Les socles portent le coût normal du
   livrable; la remise devient explicite sur le total, conforme à la règle « réduire le
   scope, jamais le prix ». Les valeurs basses de S01/S02 en mode `genere` sont un
   **problème de modélisation de la remise**, pas un coût de production.
3. **Aucune autre facture n'existe** tant que le propriétaire n'en fournit pas. Ne rien
   déduire, ne rien reconstituer.
4. **Ne jamais valider une valeur au seul motif qu'elle existait avant dans le moteur.**
5. **Le niveau se choisit par option, pas par un curseur global.** Les trois scénarios
   deviennent trois devis pré-composés que le client ajuste ligne par ligne.
6. **Le palier « Recommandé » s'appelle désormais « Standard ».** Sur un niveau d'option,
   on dit « conseillé ». Fait dans tous les livrables; **reste à faire dans le code** :
   `scenario.rec`, `messages/fr.json`, `messages/en.json`, le PDF.
7. **Ne pas segmenter S02 par nombre de pages** — décision distincte, écartée pour l'instant.

---

## Ce qui bloque l'étape 4

Le propriétaire doit répondre au questionnaire de chiffrage : 49 questions numérotées
Q1 à Q49, chacune avec 4 ou 5 choix de réponse, une zone de commentaire, et des heures
pré-remplies par estimation.

**Trois artefacts publiés, privés :**

| Quoi | URL |
|---|---|
| Fiche d'arbitrage — 14 décisions de structure | `claude.ai/code/artifact/d6156eec-8077-4729-bcd0-e3cd9d924659` |
| Maquette du nouvel écran | `claude.ai/code/artifact/401a6048-777d-412f-99c1-d08fc8e87ad3` |
| Questionnaire de chiffrage — Q1 à Q49 | `claude.ai/code/artifact/d10019c7-037e-423c-b74f-604993de15c3` |
| Catalogue imprimable | `claude.ai/code/artifact/05fb7ca6-a80c-45c8-81b1-d0f00605e53f` |

Chacun porte un **badge de version** en haut. Si le propriétaire dit ne pas voir un
changement, c'est le cache : Ctrl+Shift+R, ou ouvrir l'URL dans un onglet neuf.

---

## À lire, dans cet ordre

1. `formation/README.md` — l'index du chantier
2. `formation/AUDIT_2026-08-29.md` — d'où vient chaque nombre du moteur, les trois seuls
   gisements de preuve, et pourquoi la grille officielle ne peut pas se prouver elle-même
3. `formation/REGISTRE_PRIX.md` — 87 fiches, compteur par statut
4. `formation/NIVEAUX_PAR_OPTION.md` — les 94 niveaux et leurs définitions
5. `CALIBRATION_MOTEUR.md` — l'arbitrage de structure du 2026-08-29 et ce qui a été codé
6. `BOOTSTRAP_REFONTE_MOTEUR.md` — dont la section « contradiction centrale », non résolue

---

## La question de fond, toujours ouverte

`BOOTSTRAP_REFONTE_MOTEUR.md` pose une contradiction que **personne n'a tranchée** :

- **A** — le socle S02 sous-évalue parce qu'il chiffre de la génération, pas du montage
  manuel. Il faut deux socles.
- **B** — NEXOS bâtit cette page en une heure plus 3 à 4 h de vérification. Alors le socle
  est bien calibré et c'est la ventilation à 64,8 h qui est fausse.

**Ne pas trancher par le raisonnement.** Le propriétaire a défini une mesure : chronométrer
séparément T1 génération, T2 correction, T3 manquant sur le mandat en cours. Si T2 + T3 > T1,
il faut deux socles; sinon c'est la ventilation manuelle qui est à revoir.

---

## Hard rules

- **Aucun `git push`, aucun `vercel deploy`, aucun commit sans demande explicite.**
- **Ne modifier aucun montant dans `src/lib/engine/` avant validation de la fiche
  correspondante.** 87 fiches, dont 77 sans preuve recevable.
- **Ne jamais poser une valeur sans source.** Une case vide est une réponse.
- **Aucun nom, courriel ou téléphone de client dans le dépôt** — il est public.
- **Ne pas afficher d'heures ni de taux horaire dans un document client.**
- Modifier `matrix.ts` impose de régénérer la grille officielle `AUX-TARIF-2026-08`, qui en
  est générée. Le vérifier avant de toucher à la matrice.
- Français du Québec, tutoiement, réponses courtes.
- **Vérification proportionnée** : éditer un artifact = éditer le fichier et republier.
  `node --check` suffit sur du JS. Pas de serveur ni de navigateur pour une page statique.
