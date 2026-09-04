import { type Book, type UpdateBookInput } from '@/src/entities/book';
import { getApiBaseUrl, safeJson } from '@/src/shared/lib';
import { ApiResult } from '@/src/shared/types';

type ApiErrorBody = {
  error: string;
  code?: string;
};

export const editBook = async (id: string, input: UpdateBookInput): Promise<ApiResult> => {
  let res: Response;
  const formData = new FormData();

  if (input.title != null) formData.append('title', input.title);
  if (input.author != null) formData.append('author', input.author);
  if (input.language != null) formData.append('language', input.language);
  if (input.price != null) formData.append('price', String(input.price));
  if (input.quantity != null) formData.append('quantity', String(input.quantity));
  if (input.isbn != null) formData.append('isbn', input.isbn);
  if (input.category != null) formData.append('category', input.category);
  if (input.cover_file) formData.append('cover_file', input.cover_file);
  if (input.remove_cover) formData.append('remove_cover', 'true');

  try {
    const url = new URL(`/api/books/${id}`, getApiBaseUrl());
    res = await fetch(url.toString(), {
      method: 'PATCH',
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

  const data = await safeJson<{ book: Book }>(res);

  if (!data) {
    return { success: false, error: 'Invalid response from server.' };
  }

  return { success: true };
};
