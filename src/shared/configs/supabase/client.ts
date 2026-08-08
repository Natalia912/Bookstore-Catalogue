import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { assertEnv } from '@/src/shared/lib';

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  assertEnv(supabaseUrl, 'SUPABASE_URL');
  assertEnv(supabaseSecretKey, 'SUPABASE_SECRET_KEY');

  return createServerClient(supabaseUrl, supabaseSecretKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });
}
