const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans JP"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
