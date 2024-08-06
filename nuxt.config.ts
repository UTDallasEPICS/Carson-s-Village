// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    AUTH0_CLIENTID: '',
    AUTH0_SECRET: '',
    CONSTANT_CONTACTS_CLIENTID: '',
    CONSTANT_CONTACTS_SECRET: '',
    BASEURL: 'asd',
    ISSUER: '',
    STRIPE_PUBLIC: '',
    STRIPE_SECRET: '',
    AWS_S3_BUCKET_NAME: '',
    EMAIL_SOURCE_ADDRESS: '',
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
},
modules: 
  ['@nuxtjs/tailwindcss',],

  vite: {
    resolve: {
      dedupe:["vue"]
    },
  },
})
