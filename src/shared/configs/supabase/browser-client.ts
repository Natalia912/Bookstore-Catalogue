import { createBrowserClient } from '@supabase/ssr';
import { getPublicSupabaseConfig } from './public';

export function createSupabaseBrowserClient() {
  const config = getPublicSupabaseConfig();

  return createBrowserClient(config.url, config.publishableKey);
}
