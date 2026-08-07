# EstimaWeb QC

Estimateur web bilingue et gratuit publié par [Auxo Systems](https://auxosystems.ca). L’outil compare trois scénarios indicatifs et génère un rapport PDF localement dans le navigateur.

**Estimations basées sur la grille tarifaire interne d’Auxo Systems. Montants indicatifs en dollars canadiens, avant taxes. Cette estimation ne constitue pas une soumission contractuelle.**

La grille tarifaire interne a été révisée le 3 août 2026; les règles de calcul ont été révisées le 7 août 2026 après audit de fiabilité. Elle n’est pas présentée comme une mesure ou une représentation de l’ensemble du marché québécois. Les taxes applicables seront déterminées lors d’une éventuelle soumission officielle selon le lieu du client; EstimaWeb ne calcule aucune taxe.

## Fonctionnement

Parcours réel : secteur → type de site → fonctionnalités et modules sectoriels → mode linguistique et urgence → trois scénarios → PDF, modification ou nouvelle estimation.

- `single` : une langue, aucun supplément linguistique;
- `bilingual` : exactement deux langues, multiplicateur M01;
- `multilingual` : trois langues ou plus, multiplicateur M02.

Le moteur valide puis normalise chaque sélection. Les modules spécialisés remplacent leurs équivalents génériques et les capacités déjà comprises dans un type de site ne sont pas refacturées. L’assistant conserve toutefois l’intention : une option masquée par un choix ultérieur est restituée si ce choix est abandonné. L’écran de résultat et le PDF présentent uniquement la sélection normalisée. Voir [la matrice de compatibilité](docs/OPTION_COMPATIBILITY_MATRIX.md).

Deux règles de calcul méritent d’être connues avant de lire un montant :

- les suppléments de langue et d’urgence majorent le **socle** seul, pas les fonctionnalités ni les modules, déjà chiffrés pour leur propre périmètre;
- le **forfait de maintenance suit l’ampleur du projet** (une landing page et une plateforme sur mesure ne reçoivent pas le même forfait); le scénario ne choisit que le percentile appliqué uniformément à tous les postes.

Les trois scénarios sont le bas, le milieu et le haut de la grille interne appliqués simultanément à chaque poste. Ce ne sont ni des intervalles de confiance, ni une prévision du coût réel d’un projet.

Aucune réponse ni donnée personnelle n’est transmise ou conservée. Le calcul et le PDF sont exécutés côté client.

## Stack

- Next.js 16, React 19 et TypeScript
- Tailwind CSS et Framer Motion
- next-intl (FR/EN)
- Zod pour les entrées du calculateur
- `@react-pdf/renderer`
- Vitest et Playwright

## Commandes

```bash
npm ci
npm run dev -- --port 20005  # choisir le premier port libre de 20000-20099
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm audit
```

URL publique existante : [estimaweb-qc.vercel.app](https://estimaweb-qc.vercel.app)

Propriétaire — Auxo Systems © 2026

---

## English

EstimaWeb QC is a free bilingual web estimator by [Auxo Systems](https://auxosystems.ca). It compares three indicative scenarios and generates the PDF report locally in the browser.

**Estimates based on Auxo Systems’ internal pricing grid. Indicative amounts in Canadian dollars, before taxes. This estimate does not constitute a contractual quote.**

The internal pricing grid was revised on August 3, 2026. It is not presented as a measure or representation of the Quebec market as a whole. Applicable taxes will be determined in any official quote based on the client’s location; EstimaWeb does not calculate taxes.

Actual flow: sector → site type → features and sector modules → language mode and urgency → three scenarios → PDF, edit, or new estimate. The engine validates and normalizes the selection before calculation so a specialized or included capability is charged only once. The wizard preserves intent: an option hidden by a later choice comes back if that choice is abandoned. The result screen and PDF show only that normalized selection.

Language and urgency premiums apply to the base package only, not to features and modules. The maintenance plan follows the size of the project; the scenario only selects the percentile applied uniformly to every line. The three scenarios are the low, middle and high end of the internal grid — not confidence intervals, and not a forecast of a project's real cost.

No answer or personal data is transmitted or stored. See the commands above for local development and validation.
