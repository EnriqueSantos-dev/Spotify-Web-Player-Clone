/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.tsx", "./src/pages/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        green: {
          600: "#1DB954",
        },
        gray: {
          500: "#b3b3b3",
        },
      },
      backgroundImage: {
        "like-heart": "linear-gradient(135deg,#450af5,#c4efd9)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
