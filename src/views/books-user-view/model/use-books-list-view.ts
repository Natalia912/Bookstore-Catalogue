import type { PriceRange } from '@/src/shared/types';
import { BOOKS_PAGE_SIZE } from './constants';

type BooksListQueryParams = {
  search?: string;
  language?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};

type UseBooksListViewResult = {
  search: string | null;
  language: string | null;
  currentPage: number;
  pageSize: number;
  priceRange: PriceRange | null;
  filtersKey: string;
  buildPageHref: (pageNumber: number) => string;
  hasActiveFilters: boolean;
};

function useBooksListView(searchParams?: BooksListQueryParams): UseBooksListViewResult {
  const search = searchParams?.search?.trim() ?? null;
  const language = searchParams?.language?.trim() ?? null;
  const minPrice = Number(searchParams?.minPrice ?? 0);
  const maxPrice = Number(searchParams?.maxPrice ?? 100);
  const currentPage = Math.max(1, Number(searchParams?.page ?? 1));
  const pageSize = BOOKS_PAGE_SIZE;

  const hasPriceFilter = Boolean(searchParams?.minPrice || searchParams?.maxPrice);
  const priceRange = hasPriceFilter
    ? ([Number.isFinite(minPrice) ? minPrice : 0, Number.isFinite(maxPrice) ? maxPrice : 100] as [
      number,
      number,
    ])
    : null;

  const hasActiveFilters = Boolean(search || language || priceRange);

  const filtersKey = [
    search ?? '',
    language ?? '',
    priceRange?.[0] ?? '',
    priceRange?.[1] ?? '',
    currentPage,
  ].join('|');

  const buildPageHref = (pageNumber: number) => {
    const query = new URLSearchParams();

    if (search) {
      query.set('search', search);
    }

    if (language) {
      query.set('language', language);
    }

    if (priceRange) {
      query.set('minPrice', String(priceRange[0]));
      query.set('maxPrice', String(priceRange[1]));
    }

    if (pageNumber > 1) {
      query.set('page', String(pageNumber));
    }

    const queryString = query.toString();
    return queryString ? `/?${queryString}` : '/';
  };

  return {
    search,
    language,
    currentPage,
    pageSize,
    priceRange,
    filtersKey,
    buildPageHref,
    hasActiveFilters,
  };
}

export { useBooksListView };
