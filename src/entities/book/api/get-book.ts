import { createAuthServerClient } from '@/src/shared/configs/index.server';

export const getBook = async (id: string) => {
  const supabase = await createAuthServerClient();

  const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
  if (error) {
    return { data: null, error };
  }
  const updatedData = {
    ...data,
    cover_url: data.cover_url?.startsWith('covers/')
      ? supabase.storage.from('covers').getPublicUrl(data.cover_url).data.publicUrl
      : data.cover_url,
  };
  return { data: updatedData, error: null };
};
