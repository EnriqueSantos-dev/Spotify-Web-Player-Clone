/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.tsx", "./src/pages/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        green: {
          600: "#1DB954",
        },
      },
    },
  },
  plugins: [],
};
