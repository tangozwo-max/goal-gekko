// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gekko.riosiera.de',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()]
  }
});
