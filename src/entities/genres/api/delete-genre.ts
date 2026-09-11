import { createAuthServerClient } from '@/src/shared/configs/index.server';

export const deleteGenre = async (id: number) => {
  const supabase = await createAuthServerClient();
  return supabase.from('genres').delete().eq('id', id);
};
