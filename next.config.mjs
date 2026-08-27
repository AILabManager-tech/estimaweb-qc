import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// `@react-pdf/renderer` compile un module WebAssembly (fontkit) pour mettre en
// page le rapport. Sans autorisation explicite, la compilation est refusée et le
// bouton « Télécharger le PDF » échoue en production — jamais en développement,
// où `unsafe-eval` est déjà nécessaire au rechargement à chaud de Next.
//
// `wasm-unsafe-eval` autorise uniquement WebAssembly, pas `eval()` sur du
// JavaScript : c'est la directive étroite prévue pour ce cas précis. Les
// navigateurs qui ne la connaissent pas l'ignorent et bloquent toujours le WASM;
// l'interface affiche alors son message d'échec, qui invite à changer de
// navigateur.
const scriptSources =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'";

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value:
              // `connect-src` autorise `data:` parce que le binaire WebAssembly
              // du générateur PDF est embarqué dans le bundle sous forme de
              // data URI et récupéré par `fetch`. Une data URI est close sur
              // elle-même : elle n'ouvre aucune sortie réseau.
              `default-src 'self'; ${scriptSources}; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self' data:; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
