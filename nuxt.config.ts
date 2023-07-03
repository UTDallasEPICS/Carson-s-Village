// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    DB_USER: '',
    DB_HOST: '',
    DATABASE: '',
    DB_PASSWORD: '',
    DB_PORT: '',
    DATABASE_URL: '',
    AUTH0_CLIENTID: '',
    AUTH0_SECRET: '',
    BASEURL: '',
    ISSUER: '',
    STRIPE_PUBLIC: '',
    STRIPE_SECRET: '',
    AWS_S3_BUCKET_NAME: '',
    AWS_ACCESS_KEY_ID: '',
    AWS_SECRET_ACCESS_KEY: '',
    IMAGE_BASE_URL: '',
    EMAIL_SOURCE_ADDRESS: '',
    public: {
      deskreeBaseUrl: process.env.BASE_URL
    },
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
},
modules: 
  ['@nuxtjs/tailwindcss',
    '@nuxtjs/proxy'],
//plugins: [
 // { src: '~/plugins/stripe.js', mode: 'client' }
//],
  vite: {
    resolve: {
      dedupe:["vue"]
    },
  },
})
