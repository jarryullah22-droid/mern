/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e67e22',
        secondary: '#2c3e50',
        dark: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
