import { Book, CreateBookInput } from '@/src/entities/book';
import { getApiBaseUrl, safeJson } from '@/src/shared/lib';
import { ApiResult } from '@/src/shared/types';

type ApiErrorBody = {
  error: string;
  code?: string;
};

type AddBookResult = ApiResult;

export const addBook = async (book: CreateBookInput): Promise<AddBookResult> => {
  let res: Response;
  const formData = new FormData();

  formData.append('title', book.title);
  if (book.author) formData.append('author', book.author);
  formData.append('language', book.language);
  if (book.price != null) formData.append('price', String(book.price));
  formData.append('quantity', String(book.quantity));
  if (book.isbn) formData.append('isbn', book.isbn);
  if (book.category) formData.append('category', book.category);
  if (book.cover_file) formData.append('cover_file', book.cover_file);

  try {
    const url = new URL('/api/books', getApiBaseUrl());
    res = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    });
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }

  if (!res.ok) {
    const errorBody = await safeJson<ApiErrorBody>(res);
    return {
      success: false,
      error: errorBody?.error ?? `Request failed with status ${res.status}`,
    };
  }

  const data = await safeJson<Book>(res);

  if (!data) {
    return { success: false, error: 'Invalid response from server.' };
  }

  return { success: true };
};
