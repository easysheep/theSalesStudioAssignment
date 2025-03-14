// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add additional paths if needed.
  ],
  theme: {
    extend: {
      fontFamily: {
        monoton: ['Monoton', 'cursive'],
        outfit: ['Outfit', 'sans-serif'],
        ponomar: ['Ponomar', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
