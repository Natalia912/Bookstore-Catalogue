import { Book } from '@/src/entities/book';
import { createClient } from '@/src/shared/configs/supabase';
import { ApiResultWithData } from '@/src/shared/types';

type GetBooksResult = ApiResultWithData<Book[]>;

export const getBooks = async ({
  search,
  language,
}: {
  search: string | null;
  language: string | null;
}): Promise<GetBooksResult> => {
  try {
    const supabase = await createClient();

    let query = supabase.from('books').select('*').order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    if (language) {
      query = query.eq('language', language);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error. Please try again.',
    };
  }
};
