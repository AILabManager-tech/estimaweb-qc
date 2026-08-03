# EstimaWeb QC

Estimateur web bilingue et gratuit publié par [Auxo Systems](https://auxosystems.ca). L’outil compare trois scénarios indicatifs en dollars canadiens et génère un rapport PDF localement dans le navigateur.

Les montants proviennent d’une grille interne créée le 27 février 2026 avec une année de référence déclarée 2025. Aucune source externe n’est conservée dans le dépôt; les valeurs doivent être validées humainement avant d’être présentées comme des données de marché actuelles. Le résultat n’est pas une soumission contractuelle.

## Fonctionnement

Parcours réel : secteur → type de site → fonctionnalités et modules sectoriels → langues et urgence → trois scénarios → PDF, modification ou nouvelle estimation.

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
npm run dev -- --port 20003  # choisir le premier port libre de 20000-20099
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

EstimaWeb QC is a free bilingual web estimator by [Auxo Systems](https://auxosystems.ca). It compares three indicative scenarios in Canadian dollars and generates the PDF report locally in the browser.

The amounts come from an internal grid created on February 27, 2026 with a stated 2025 reference year. No external source is retained in the repository; a human must validate the values before they are presented as current market data. The result is not a contractual quote.

Actual flow: sector → site type → features and sector modules → languages and urgency → three scenarios → PDF, edit, or new estimate. No answer or personal data is transmitted or stored.

See the commands above for local development and validation.
