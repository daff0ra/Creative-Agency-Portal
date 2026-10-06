/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { brand: {
        DEFAULT: "#0F172A", foreground: "#FFFFFF"
      }},
      borderRadius: { DEFAULT: "4px"},
      boxShadow: { card: "0 1px 2px 0 rgb(0 0 0 / 0.04)"},
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"]}
    },
  },
  plugins: [],
}

