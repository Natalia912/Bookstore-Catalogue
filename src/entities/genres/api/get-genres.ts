import { unstable_cache } from 'next/cache';
import { createPublicClient } from '@/src/shared/configs/index.server';

const getCachedGenres = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    return supabase.from('genres').select('*').order('label_en', { ascending: true });
  },
  ['genres'],
  { revalidate: 86400, tags: ['genres'] }
);

export const getGenres = () => getCachedGenres();

const getCachedGenresWithBooks = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('genres')
      .select('id, label_en, label_kk, label_ru, books!inner(id)')
      .order('label_en', { ascending: true });

    return {
      data:
        data?.map((genre) => ({
          id: genre.id,
          label_en: genre.label_en,
          label_kk: genre.label_kk,
          label_ru: genre.label_ru,
        })) ?? null,
      error,
    };
  },
  ['genres-with-books'],
  { revalidate: 3600, tags: ['genres'] }
);

export const getGenresWithBooks = () => getCachedGenresWithBooks();
