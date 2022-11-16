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
      backgroundColor: {
        overlay: "rgba(0,0,0,0.8)",
      },
      maxHeight: {
        screenMax: "calc(100% - 245px)",
      },
      backgroundImage: {
        "like-heart": "linear-gradient(135deg,#450af5,#c4efd9)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
