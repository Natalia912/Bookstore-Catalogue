import { createAuthServerClient } from '@/src/shared/configs/index.server';

export const deleteBook = async (id: string) => {
  const supabase = await createAuthServerClient();

  const { data, error } = await supabase.from('books').select('*').eq('id', id).single();

  if (error) {
    return { data: null, error };
  }

  if (data.cover_url && data.cover_url.startsWith('covers/')) {
    const { error: deleteError } = await supabase.storage.from('covers').remove([data.cover_url]);
    if (deleteError) {
      return { data: null, error: deleteError };
    }
  }

  return await supabase.from('books').delete().eq('id', id);
};
