import { createClient } from '@supabase/supabase-js';

let _client: ReturnType<typeof createClient> | null = null;
let _cacheKey = '';

export function getBrowserSupabaseClient(url: string, anonKey: string) {
  const key = `${url}::${anonKey}`;
  if (!_client || _cacheKey !== key) {
    _client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    _cacheKey = key;
  }
  return _client;
}
