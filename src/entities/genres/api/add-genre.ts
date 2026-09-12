import { createAuthServerClient } from '@/src/shared/configs/index.server';
import type { CreateGenreInput } from '../model';

export const addGenre = async (input: CreateGenreInput) => {
  const supabase = await createAuthServerClient();
  return supabase
    .from('genres')
    .insert({
      label_en: input.label_en.trim(),
      label_kk: input.label_kk.trim(),
      label_ru: input.label_ru.trim(),
    })
    .select()
    .single();
};
