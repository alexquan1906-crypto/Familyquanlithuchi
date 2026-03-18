/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      colors: {
        income: '#16a34a',
        expense: '#dc2626',
        primary: '#0ea5e9',
      }
    },
  },
  plugins: [],
}
