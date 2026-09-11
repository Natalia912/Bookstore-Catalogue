import { createAuthServerClient } from '@/src/shared/configs/index.server';

export const getGenre = async (id: number) => {
  const supabase = await createAuthServerClient();
  return supabase.from('genres').select('*').eq('id', id).single();
};
