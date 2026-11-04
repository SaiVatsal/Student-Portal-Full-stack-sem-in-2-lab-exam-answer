import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          subtle: "var(--surface-subtle)",
          border: "var(--surface-border)",
        },
        azure: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcd9ff",
          300: "#8ec1ff",
          400: "#599fff",
          500: "#2F7BFF",
          600: "#1a5deb",
          700: "#1448c4",
          800: "#153d9e",
          900: "#17367c",
          950: "#0e1f48",
        },
        hot: {
          DEFAULT: "#FF6B2C",
          hover: "#e55a1d",
          subtle: "rgba(255, 107, 44, 0.12)",
        },
        status: {
          success: "#22C55E",
          warning: "#F5B301",
          danger: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        glow: "0 0 16px -2px rgba(47, 123, 255, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
