import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://chandankumar.com',
  integrations: [react()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
  },
});