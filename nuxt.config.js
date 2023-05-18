// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    stripeSecret: process.env.STRIPE_SECRET,
    public: {
      deskreeBaseUrl: process.env.BASE_URL
    },
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
},
modules: 
  ['@nuxtjs/tailwindcss'],
//plugins: [
 // { src: '~/plugins/stripe.js', mode: 'client' }
//],
  vite: {
    resolve: {
      dedupe:["vue"]
    },
  },
})
