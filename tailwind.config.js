/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gm-primary": "#EC8DB0",
        "gm-primary-deep": "#D96F94",
        "gm-canvas": "#FFF9FB",
        "gm-surface": "#FFFFFF",
        "gm-blush": "#FDE8F0",
        "gm-heading": "#1A1A1A",
        "gm-body": "#666666",
        "gm-muted": "#999999",
        "gm-line": "#E8E8E8",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(236, 141, 176, 0.08)",
        soft: "0 2px 12px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
