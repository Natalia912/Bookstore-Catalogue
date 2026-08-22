import { createClient } from '@supabase/supabase-js';
import { getPublicSupabaseConfig } from './public';

export function createPublicClient() {
  const configuration = getPublicSupabaseConfig();

  return createClient(configuration.url, configuration.publishableKey);
}
