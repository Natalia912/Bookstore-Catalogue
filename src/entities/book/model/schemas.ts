import { z } from 'zod';
import { LANGUAGES } from './constants';

export const bookSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  author: z.string().trim().nullable().optional(),
  language: z.enum(Object.values(LANGUAGES)).default(LANGUAGES.ru),
  price: z.number().nonnegative('Price must be non-negative').nullable().optional(),
  quantity: z.number().int().nonnegative().default(1),
  isbn: z.string().trim().nullable().optional(),
  cover_url: z.url().nullable().optional(),
  category: z.string().trim().nullable().optional(),
});

export const addBookSchema = bookSchema
  .pick({
    title: true,
    author: true,
    language: true,
    price: true,
    quantity: true,
    isbn: true,
    category: true,
  })
  .extend({
    cover_file: z.instanceof(File).optional(),
  });

export const updateBookSchema = bookSchema.partial().extend({
  cover_file: z.instanceof(File).optional(),
  remove_cover: z.boolean().optional(),
});
