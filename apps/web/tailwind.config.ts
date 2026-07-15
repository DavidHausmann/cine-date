import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#090B11",
        card: "#111827",
        muted: "#9CA3AF",
        primary: "#E50914",
        accent: "#7DA8B5",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        glow: "0 20px 40px rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        reveal: "reveal 0.45s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
