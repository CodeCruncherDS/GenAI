import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          500: "#64748b"
        },
        sand: {
          50: "#faf8f5",
          100: "#f5f0ea",
          200: "#e7dfd5"
        },
        accent: {
          500: "#0f766e",
          600: "#0d6b63"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px -35px rgba(15, 23, 42, 0.25)",
        card: "0 10px 40px -25px rgba(15, 23, 42, 0.4)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
