import { createClient } from '@/src/shared/configs/index.server';

export const getBook = async (id: string) => {
  const supabase = await createClient();

  return supabase.from('books').select('*').eq('id', id).single();
};
