import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    tsConfig: {
      extends: "@tsconfig/strictest/tsconfig.json",
    },
  },
});
