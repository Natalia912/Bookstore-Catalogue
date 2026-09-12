import { createAuthServerClient } from '@/src/shared/configs/index.server';
import type { UpdateGenreInput } from '../model';

export const updateGenre = async (id: number, input: UpdateGenreInput) => {
  const supabase = await createAuthServerClient();
  const payload = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ])
  );

  return supabase.from('genres').update(payload).eq('id', id).select().single();
};
