import z from 'zod';
import { LANGUAGES } from './constants';
import { bookSchema, addBookSchema, updateBookSchema } from './schemas';

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export type BookGenre = {
  id: number;
  label_en: string;
  label_kk: string;
  label_ru: string;
};

export type Book = z.infer<typeof bookSchema> & {
  genre?: BookGenre | null;
};

export type CreateBookInput = z.infer<typeof addBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
