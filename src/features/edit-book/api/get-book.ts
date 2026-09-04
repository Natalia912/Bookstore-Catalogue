import { type Book } from '@/src/entities/book';
import { getApiBaseUrl, safeJson } from '@/src/shared/lib';

type GetBookResponse = {
  book: Book;
};

export const fetchBookById = async (id: string): Promise<Book | null> => {
  try {
    const url = new URL(`/api/books/${id}`, getApiBaseUrl());
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await safeJson<GetBookResponse>(res);
    return data?.book ?? null;
  } catch {
    return null;
  }
};
