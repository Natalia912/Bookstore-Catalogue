import { assertEnv } from '../../lib';

export type PublicSupabaseConfig = {
  url: string;
  publishableKey: string;
};

export function getPublicSupabaseConfig(): PublicSupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  assertEnv(url, 'NEXT_PUBLIC_SUPABASE_URL');
  assertEnv(publishableKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');

  return { url, publishableKey };
}
