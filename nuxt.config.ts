// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@nuxthub/core',
  ],
  css: ['~/assets/css/main.css'],
  hub: {
    db: 'sqlite',
  },

  mdc: {
    headings: {
      anchorLinks: false, // Disable anchor links in AI responses
    },
  },
})
