import { createClient } from '@/src/shared/lib/supabase';

export const deleteBook = async (id: string) => {
  const supabase = await createClient();

  return supabase.from('books').delete().eq('id', id);
};
