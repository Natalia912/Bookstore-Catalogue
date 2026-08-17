import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const ADMIN_ROLE = 'admin' as const;
export const ADMIN_LOGIN_PATH = '/login';
export const ADMIN_DASHBOARD_MATCHER = '/dashboard/:path*';

type AdminProfile = {
  is_admin: boolean;
};

type CookieStore = {
  getAll: () => { name: string; value: string }[];
  set: (name: string, value: string, options: CookieOptions) => void;
};

function getSupabaseConfiguration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return url && publishableKey ? { url, publishableKey } : null;
}

function createSupabaseServerClient(cookieStore: CookieStore) {
  const configuration = getSupabaseConfiguration();

  if (!configuration) {
    return null;
  }

  return createServerClient(configuration.url, configuration.publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. proxy.ts refreshes sessions instead.
        }
      },
    },
  });
}

export async function isSupabaseUserAdmin(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle<AdminProfile>();

  return !error && data?.is_admin === true;
}

export async function hasAdminAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  if (!supabase) {
    return false;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return !error && Boolean(user && (await isSupabaseUserAdmin(supabase, user.id)));
}
