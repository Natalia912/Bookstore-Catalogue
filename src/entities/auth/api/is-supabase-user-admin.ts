import type { SupabaseClient } from '@supabase/supabase-js';

type AdminProfile = {
  is_admin: boolean;
};

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
