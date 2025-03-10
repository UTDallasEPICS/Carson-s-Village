// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    experimental: {
      tasks: true
    },
      scheduledTasks: {
        // Run `Refresh:token` task every at 10 am and 10 pm
        '0 10,22 * * *': ['token:refresh'],
        // Run `Generate:data` task every day at 9 pm
        '0 21 * * *': ['family_reports:generate_data'],
      }
  },
  runtimeConfig: {
    AUTH0_CLIENTID: '',
    AUTH0_SECRET: '',
    CONSTANT_CONTACTS_CLIENTID: '',
    CONSTANT_CONTACTS_SECRET: '',
    CONSTANT_CONTACTS_LIST_MEMBERSHIP: '',
    BASEURL: '',
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