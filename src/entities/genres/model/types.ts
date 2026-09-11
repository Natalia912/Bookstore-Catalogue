import z from 'zod';
import { createGenreSchema, genreSchema, updateGenreSchema } from './schemas';

export type Genre = z.infer<typeof genreSchema>;
export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
