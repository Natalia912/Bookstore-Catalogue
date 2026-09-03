import z from 'zod';
import { LANGUAGES } from './constants';

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export interface Book {
  id: string;
  title: string;
  author: string | null;
  language: Language;
  price: number | null;
  quantity: number;
  isbn: string | null;
  cover_url: string | null;
  category: string | null;
}

export type CreateBookInput = z.infer<typeof import('./schemas').addBookSchema>;
export type UpdateBookInput = z.infer<typeof import('./schemas').updateBookSchema>;
