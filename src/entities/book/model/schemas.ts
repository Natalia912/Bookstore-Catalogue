import { z } from 'zod';
import { LANGUAGES } from './constants';

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0 && file.type.startsWith('image/'), {
    message: 'Cover file must be an image',
  });

export const bookSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1, 'Title is required'),
  author: z.string().trim().nullable().optional(),
  language: z.enum(Object.values(LANGUAGES)).default(LANGUAGES.ru),
  price: z.number().nonnegative('Price must be non-negative').nullable().optional(),
  quantity: z.number().int().nonnegative().default(1),
  isbn: z.string().trim().nullable().optional(),
  cover_url: z.url().nullable().optional(),
  genre_id: z.number().int().positive().nullable().optional(),
});

export const addBookSchema = bookSchema
  .omit({
    id: true,
    cover_url: true,
  })
  .extend({
    cover_file: imageFileSchema.optional(),
  });

export const updateBookSchema = bookSchema.partial().extend({
  cover_file: imageFileSchema.optional(),
  remove_cover: z.boolean().optional(),
});
