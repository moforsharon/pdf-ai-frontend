/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // path to all JS and JSX files
  ],
  theme: {
    extend: {
      colors: {
        "bg-color": "#003145",
        "primary": "#FFDF99",
        "secondary": "#44924c",
      },
    },
  },
  plugins: [],
}


