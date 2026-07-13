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

  const url = new URL('/api/books', getApiBaseUrl());

  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
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
