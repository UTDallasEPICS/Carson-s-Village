// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    experimental: {
      tasks: true
    },
      scheduledTasks: {
        // Run `Refresh:token` task every 12th hour 
        '0 0,12 * * *': ['token:refresh']
      }
  },
  runtimeConfig: {
    AUTH0_CLIENTID: '',
    AUTH0_SECRET: '',
    CONSTANT_CONTACTS_CLIENTID: '',
    CONSTANT_CONTACTS_SECRET: '',
    CONSTANT_CONTACTS_LIST_MEMBERSHIP: '',
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