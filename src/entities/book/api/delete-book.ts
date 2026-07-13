import { createClient } from '@/src/shared/configs/index.server';

export const deleteBook = async (id: string) => {
  const supabase = await createClient();

  return supabase.from('books').delete().eq('id', id);
};
