import { Book } from '@/src/entities/book';
import { getApiBaseUrl, safeJson } from '@/src/shared/lib';
import { ApiResultWithData } from '@/src/shared/types';

type GetBooksApiResponse = {
  books: Book[];
};

type GetBooksResult = ApiResultWithData<Book[]>;

export const getBooks = async ({
  search,
  language,
}: {
  search?: string | null;
  language?: string | null;
} = {}): Promise<GetBooksResult> => {
  const params = new URLSearchParams();

  if (search) {
    params.set('search', search);
  }

  if (language) {
    params.set('language', language);
  }

  try {
    const url = new URL('/api/books', getApiBaseUrl());

    if (params.toString()) {
      url.search = params.toString();
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      next: { tags: ['books'] },
    });
    console.log('getBooks response:', response);

    if (!response.ok) {
      const errorBody = await safeJson<{ error?: string }>(response);

      return {
        success: false,
        error: JSON.stringify(response),
      };
    }

    const data = await safeJson<GetBooksApiResponse>(response);

    if (!data?.books) {
      return { success: false, error: 'Invalid response from server.' };
    }

    return { success: true, data: data.books };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
};
