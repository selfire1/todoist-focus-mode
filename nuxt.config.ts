import app from "./config/app";
import Aura from "@primevue/themes/aura";
import pkg from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: "src",
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
      unstyled: false,
      // preset: Aura,
      // theme: Aura,
      ripple: true,
      inputVariant: "outlined",
    },
    components: {
      prefix: "P",
    },
  },
  runtimeConfig: {
    oauth: {
      todoist: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scope: "data:read_write",
      },
    },
    public: {
      storeCountKey: "task-done-count",
      storeFeedbackModalShow: "feedback-modal-shown",
      version: pkg.version,
    },
  },

  gtm: {
    id: process.env.GTM_ID as string,
  },

  app: {
    head: {
      title: app.title,
      meta: [
        { name: "description", content: app.description },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: app.title },
        { property: "og:url", content: app.baseUrl },
        { property: "og:description", content: app.description },
        { property: "og:image", content: app.imagePath },
        { name: "twitter:title", content: app.title },
        { name: "twitter:description", content: app.description },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: app.imagePath },
        { name: "twitter:site", content: "@selfire1" },
      ],
      link: [
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        {
          rel: "icon",
          href: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "canonical", href: app.baseUrl },
      ],
    },
  },

  modules: [
    "@primevue/nuxt-module",
    "@nuxt/image",
    "nuxt-auth-utils",
    "@zadigetvoltaire/nuxt-gtm",
    "@nuxtjs/tailwindcss",
    "@nuxt/test-utils/module",
    "@nuxt/icon",
  ],
});
