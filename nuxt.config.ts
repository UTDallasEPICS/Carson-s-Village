import vue from '@vitejs/plugin-vue'

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    BASEURL: '',
    ISSUER: '',
    STRIPE_SECRET: '',
    STRIPE_WEBHOOK_SECRET: '',
    AWS_S3_BUCKET_NAME: '',
    EMAIL_SOURCE_ADDRESS: '',
    BETTER_AUTH_URL: '',
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
},
  modules: 
    ['@nuxtjs/tailwindcss', '@nuxt/eslint'],

  // Need this so that server reads vue template emails
  nitro: {
    rollupConfig: {
      plugins: [vue()]
    },
  },

  vite: {
    resolve: {
      dedupe:["vue"]
    },
    server: {
      allowedHosts: ['.trycloudflare.com'],
    },
  },
})
