/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors:{
        "orange":{
          "999": "#cd6636"
        },
        "green":{
          "999": "#48944c"
        },
        "blue":{
          "999": "#5aadc2"
        },
        "gray":{
          "999": "#999999"
        }
      }
    },
  },
  plugins: [],
}
