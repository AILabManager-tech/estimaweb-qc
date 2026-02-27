import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: {
          DEFAULT: "#0F0F11",
          light: "#161618",
          border: "#1E293B",
        },
        accent: {
          DEFAULT: "#00A19B",
          hover: "#008C87",
          dim: "#006B67",
          muted: "#006B67",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          tertiary: "#475569",
        },
        scenario: {
          eco: "#10B981",
          "eco-bg": "#064E3B",
          rec: "#F59E0B",
          "rec-bg": "#78350F",
          premium: "#EF4444",
          "premium-bg": "#7F1D1D",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        hero: ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        display: ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h1: ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h2: ["2.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        h3: ["1.5rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.5)",
        card: "0 2px 8px rgba(0, 0, 0, 0.3)",
        elevated: "0 4px 16px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(0, 161, 155, 0.15)",
      },
      borderRadius: {
        sm: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
