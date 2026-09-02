import { createAuthServerClient } from '@/src/shared/configs/index.server';

export const deleteBook = async (id: string) => {
  const supabase = await createAuthServerClient();

  return await supabase.from('books').delete().eq('id', id);
};
