import { z } from 'zod';

export const genreSchema = z.object({
  id: z.number().int().positive(),
  label_en: z.string().trim().min(1),
  label_kk: z.string().trim().min(1),
  label_ru: z.string().trim().min(1),
});

export const createGenreSchema = genreSchema.omit({ id: true });
export const updateGenreSchema = createGenreSchema.partial();
