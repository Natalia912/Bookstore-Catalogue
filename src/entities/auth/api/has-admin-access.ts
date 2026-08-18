import { cookies } from 'next/headers';
import { createAuthServerClient } from '@/src/shared/configs/supabase/auth-client';
import { isSupabaseUserAdmin } from './is-supabase-user-admin';

export async function hasAdminAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  const supabase = createAuthServerClient(cookieStore);

  if (!supabase) {
    return false;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return !error && Boolean(user && (await isSupabaseUserAdmin(supabase, user.id)));
}
