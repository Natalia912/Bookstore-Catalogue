import { Book } from '@/src/entities/book';
import { createClient } from '@/src/shared/configs/supabase';
import { BOOKS_PAGE_SIZE } from '../model/constants';
import { PriceRange } from '../model/types';

type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type GetBooksResult =
  { success: true; data: Book[]; pagination: PaginationMeta } | { success: false; error: string };

export const getBooks = async ({
  search,
  language,
  priceRange,
  page = 1,
  pageSize = BOOKS_PAGE_SIZE,
}: {
  search: string | null;
  language: string | null;
  priceRange?: PriceRange | null;
  page?: number | null;
  pageSize?: number;
}): Promise<GetBooksResult> => {
  try {
    const supabase = await createClient();
    const normalizedPage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1;
    const normalizedPageSize = Number.isFinite(pageSize) ? Math.max(1, Number(pageSize)) : 8;

    let countQuery = supabase
      .from('books')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    if (language) {
      countQuery = countQuery.eq('language', language);
    }

    if (priceRange?.[0] !== undefined && priceRange?.[0] !== null) {
      countQuery = countQuery.gte('price', priceRange[0]);
    }

    if (priceRange?.[1] !== undefined && priceRange?.[1] !== null) {
      countQuery = countQuery.lte('price', priceRange[1]);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      return { success: false, error: countError.message };
    }

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / normalizedPageSize));
    const safePage = Math.min(normalizedPage, totalPages);
    const from = (safePage - 1) * normalizedPageSize;

    let dataQuery = supabase.from('books').select('*').order('created_at', { ascending: false });

    if (search) {
      dataQuery = dataQuery.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    if (language) {
      dataQuery = dataQuery.eq('language', language);
    }

    if (priceRange?.[0] !== undefined && priceRange?.[0] !== null) {
      dataQuery = dataQuery.gte('price', priceRange[0]);
    }

    if (priceRange?.[1] !== undefined && priceRange?.[1] !== null) {
      dataQuery = dataQuery.lte('price', priceRange[1]);
    }

    const { data, error } = await dataQuery.range(from, from + normalizedPageSize - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data ?? [],
      pagination: {
        page: safePage,
        pageSize: normalizedPageSize,
        total,
        totalPages,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error. Please try again.',
    };
  }
};
