// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// import.meta.env.X inlines as `undefined` when the variable is missing, so a
// misconfigured build succeeds and only fails in the browser — where it looks
// like an empty board rather than like a broken deploy. Fail here instead.
//
// Both variables have to exist in EVERY Vercel environment that builds this
// app, Preview included. Setting them for Production only makes every preview
// deploy fail on this check.
//
// Vite's own loadEnv would be the obvious tool, but Astro 6 no longer re-exports
// it and vite is not a direct dependency, so the .env files are read here. On
// Vercel the values arrive through process.env and the files never come up.
const ENV_FILES = ['.env', '.env.production', '.env.local', '.env.production.local'];

function readEnvFiles() {
  const found = {};
  for (const file of ENV_FILES) {
    let text;
    try {
      text = readFileSync(new URL(file, import.meta.url), 'utf8');
    } catch {
      continue; // absent is normal
    }
    for (const line of text.split('\n')) {
      const match = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
      if (!match) continue;
      found[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
    }
  }
  return found;
}

const fileEnv = readEnvFiles();
for (const name of ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_KEY']) {
  if (!process.env[name] && !fileEnv[name]) {
    throw new Error(`${name} is not set. Goal-Gekko needs it to reach Supabase.`);
  }
}

export default defineConfig({
  site: 'https://gekko.riosiera.de',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()]
  }
});
