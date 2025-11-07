import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  srcDir: ".",
  ssr: true,
  // Keep API keys in server-only runtime config. Do NOT expose Kakao API key to the client.
  runtimeConfig: {
    kakaoApiKey: process.env.KAKAO_API_KEY || "",
    public: {},
  },
});
