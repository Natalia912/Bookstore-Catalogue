import { createClient } from '@/src/shared/lib/supabase';

export const getBooks = async ({
  search,
  language,
}: {
  search: string | null;
  language: string | null;
}) => {
  const supabase = await createClient();

  let query = supabase.from('books').select('*').order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }
  if (language) {
    query = query.eq('language', language);
  }

  return query;
};
