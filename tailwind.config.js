/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./*.html", "./_layouts/*.html", "./_includes/*.html"],
  content: ["./_site/**/*.html"],
  theme: {
    fontFamily: {
      body: ["Work Sans", "sans-serif"],
      display: ["Tilt Warp", "sans-serif"]
    },
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {},
  },
  plugins: [],
};
