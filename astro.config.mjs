// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gekko.cancemi.de',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()]
  }
});
