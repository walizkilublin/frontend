// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://walizki-lublin.pl',

  prefetch: true,

  build: {
    inlineStylesheets: 'always'
  },

  integrations: [svelte(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 1. Rdzeń Svelte do jednego pliku
            if (id.includes('node_modules/svelte')) {
              return 'svelte-runtime';
            }
            // 2. MAGIA: Wszystkie Twoje komponenty (Hero, Preloader, Catalog) do DRUGIEGO pliku!
            if (id.includes('/src/components/')) {
              return 'app-components';
            }
          }
        }
      }
    }
  },

  adapter: netlify()
});