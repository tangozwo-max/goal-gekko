import { createClient } from '@supabase/supabase-js';

let _client: ReturnType<typeof createClient> | null = null;
let _cacheKey = '';

// In-memory fallback for when localStorage is blocked (Edge/Safari tracking prevention)
const memStore: Record<string, string> = {};
const safeStorage = {
  getItem: (key: string) => {
    try { return localStorage.getItem(key); } catch { return memStore[key] ?? null; }
  },
  setItem: (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch { memStore[key] = value; }
  },
  removeItem: (key: string) => {
    try { localStorage.removeItem(key); } catch { delete memStore[key]; }
  },
};

export function getBrowserSupabaseClient(url: string, anonKey: string) {
  const key = `${url}::${anonKey}`;
  if (!_client || _cacheKey !== key) {
    _client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storage: safeStorage },
    });
    _cacheKey = key;
  }
  return _client;
}
