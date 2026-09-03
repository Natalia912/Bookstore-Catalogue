import { createAuthServerClient } from '@/src/shared/configs/index.server';

export const getBook = async (id: string) => {
  const supabase = await createAuthServerClient();

  return supabase.from('books').select('*').eq('id', id).single();
};
