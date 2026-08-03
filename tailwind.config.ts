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
        background: "#F4F0E7",
        surface: {
          DEFAULT: "#FBF8F1",
          light: "#EEE9DE",
          border: "#D8D1C5",
        },
        accent: {
          DEFAULT: "#165A63",
          hover: "#104952",
          dim: "#1F4A3A",
          muted: "#3F746D",
        },
        text: {
          primary: "#202725",
          secondary: "#53615D",
          tertiary: "#69736F",
        },
        scenario: {
          eco: "#46705D",
          "eco-bg": "#E3ECE6",
          rec: "#165A63",
          "rec-bg": "#DFEBEC",
          premium: "#7C5A31",
          "premium-bg": "#EFE5D6",
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
        subtle: "0 1px 3px rgba(32, 39, 37, 0.10)",
        card: "0 8px 24px rgba(32, 39, 37, 0.08)",
        elevated: "0 14px 36px rgba(32, 39, 37, 0.12)",
        glow: "0 0 0 4px rgba(22, 90, 99, 0.10), 0 12px 30px rgba(32, 39, 37, 0.10)",
      },
      borderRadius: {
        sm: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
