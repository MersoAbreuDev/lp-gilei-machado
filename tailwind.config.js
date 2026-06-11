/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/index.css"],
  theme: {
    extend: {
      colors: {
        "gm-primary": "#8B5E3C",
        "gm-primary-deep": "#6B4423",
        "gm-cream": "#FAF7F2",
        "gm-cream-soft": "#F5EFE6",
        "gm-gold": "#C9A96E",
        "gm-text": "#2C2416",
      },
      fontFamily: {
        sans: [
          "Cormorant Garamond",
          "Georgia",
          "serif",
          "system-ui",
          "sans-serif",
        ],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
