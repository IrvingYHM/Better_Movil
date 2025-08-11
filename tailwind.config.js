/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: true, // Hace que Tailwind use !important para mayor especificidad
  theme: {
    extend: {
      colors: {
        danger: "#FFD099",
        turquesa: "#19BDFD",
        aRey: "#1446F5",
        azulOp: "#6786F6",
        // Betterware brand colors - Teal/Cyan palette
        teal: {
          50: "#f0fdfa",   // Muy claro
          100: "#ccfbf1",  // Claro
          200: "#99f6e4",  // Claro medio
          300: "#5eead4",  // Medio claro
          400: "#2dd4bf",  // Medio
          500: "#0b9ca7",  // Principal (betterware original)
          600: "#00aec9",  // Medio oscuro (betterware2 original)
          700: "#04acc9",  // Oscuro (betterware_claro original)
          800: "#065f46",  // Muy oscuro
          900: "#134e4a",  // Ultra oscuro
        },
      },
      spacing: {
        /*         22:"88px", */
        "5/8": "38px",
      },
      translate: {
        90: "22.5rem",
      },
      maxWidth: {
        "8xl": "90rem", // 1440px
        "9xl": "100rem", // 1600px
        "10xl": "120rem", // 1920px
      },
    },
  },
  plugins: [],
};

