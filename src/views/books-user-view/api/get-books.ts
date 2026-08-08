import { Book } from '@/src/entities/book';
import { createClient } from '@/src/shared/configs/supabase';
import { ApiResultWithData } from '@/src/shared/types';
import { PriceRange } from '../model/types';

type GetBooksResult = ApiResultWithData<Book[]>;

export const getBooks = async ({
  search,
  language,
  priceRange,
}: {
  search: string | null;
  language: string | null;
  priceRange?: PriceRange | null;
}): Promise<GetBooksResult> => {
  try {
    const supabase = await createClient();

    let query = supabase.from('books').select('*').order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    if (language) {
      query = query.eq('language', language);
    }

    if (priceRange?.[0] !== undefined && priceRange?.[0] !== null) {
      query = query.gte('price', priceRange[0]);
    }

    if (priceRange?.[1] !== undefined && priceRange?.[1] !== null) {
      query = query.lte('price', priceRange[1]);
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
