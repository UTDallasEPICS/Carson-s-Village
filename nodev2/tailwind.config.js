/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.pug'],
  theme: {
    colors: {
      'gray-dark': '#383838', // used for titles, labels
      'gray': '6E6E6E', // used for family page text
      'gray-light': '#dfdfdf', // used for backgrounds and highlights
      'white': '#ffffff',
      'light-white': '#f8f8f8',
      'blue': '#6eabbf',
      'dark-blue':' #718797',
      'orange': '#cd6636',
      'green-light': '#90d918', // used for donation bar
      'green-dark': '568f53'
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      outfit: ['Outfit', 'sans-serif']
    },
    separator: '_',
    extend: {
      borderRadius:{
        'card': '60px'
      },
      boxShadow: {
        'card': '0px 3px 6px 3px rgba(0, 0, 0, 0.15), 0px 3px 3px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: []
}