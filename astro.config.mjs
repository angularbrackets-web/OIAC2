import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ["https://**.graphassets.com"],
  },
  security: {
    checkOrigin: false // Allow form submissions to API routes
  }
});