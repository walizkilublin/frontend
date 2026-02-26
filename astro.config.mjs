// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://walizki-lublin.pl',


  build: {
    inlineStylesheets: 'always'
  },

  integrations: [
    svelte(), 
    sitemap(), 
    partytown({
      config: {
        // Przekazujemy zdarzenia z naszego Cookie Bannera do Workera GTM
        forward: ["dataLayer.push", "gtag"],
      },
    })
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify()
});