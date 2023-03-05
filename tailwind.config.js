/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
        hueRotate: {
          "0%": {
            filter: "hue-rotate(360deg)"
          },
          "50%": {
            filter: "hue-rotate(300deg)"
          },
          "100%": {
            filter: "hue-rotate(270deg)"
          }
        }
      },
      animation: {
        fadeIn: "fadeIn .5s ease-in-out",
        hueRotate: "hueRotate 6s ease-in-out infinite"
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
};
