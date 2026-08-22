import { createAuthServerClient } from '@/src/shared/configs/supabase/auth-client';
import { isSupabaseUserAdmin } from './is-supabase-user-admin';

export async function hasAdminAccess(): Promise<boolean> {
  const supabase = await createAuthServerClient();

  if (!supabase) {
    return false;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return !error && Boolean(user && (await isSupabaseUserAdmin(supabase, user.id)));
}
