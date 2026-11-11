import vue from '@vitejs/plugin-vue'

export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

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

  modules: [
      '@nuxt/ui',
      '@nuxt/eslint'
  ],

  ui: {colorMode: false},

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
