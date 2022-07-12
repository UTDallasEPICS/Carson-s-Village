/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.pug"],
  theme: {
    colors: {
      'gray-dark': '#383838', // used for titles, labels
      'gray': '6E6E6E', // used for family page text
      'gray-light': '#dfdfdf', // used for backgrounds and highlights
      'blue': '#6eabbf',
      'orange': '#cd6636',
      'green-light': '#90d918', // used for donation bar
      'green-dark': '568f53'
    },
    fontFamily: {
      sans: ['Poppins']
    },
    separator: '_',
    extend: {},
  },
  plugins: [],
}