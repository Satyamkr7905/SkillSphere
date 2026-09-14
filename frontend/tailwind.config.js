/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EF",
        "paper-alt": "#FAF9F6",
        surface: "#FFFFFF",
        ink: "#141414",
        "ink-2": "#5F5A54",
        "ink-3": "#8A8A8A",
        rule: "#E3DED6",
        sage: "#2F5D50",
        critical: "#A33A2B",
        moderate: "#B7791F",
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Inter", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(20, 20, 20, 0.04)",
      },
      letterSpacing: {
        label: "0.08em",
      },
    },
  },
  plugins: [],
};
