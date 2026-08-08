'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Language } from '@/src/entities/book';

const DEFAULT_PRICE_RANGE: [number, number] = [0, 100];

function useBookFilters(priceBounds?: [number, number] | null) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [draftQuery, setDraftQuery] = useState(() => searchParams?.get('search') ?? '');

  const language = (searchParams?.get('language') as Language | null) ?? null;
  const fallbackPriceRange = useMemo<[number, number]>(() => {
    return [priceBounds?.[0] ?? DEFAULT_PRICE_RANGE[0], priceBounds?.[1] ?? DEFAULT_PRICE_RANGE[1]];
  }, [priceBounds]);

  const minPrice = Number(searchParams?.get('minPrice') ?? fallbackPriceRange[0]);
  const maxPrice = Number(searchParams?.get('maxPrice') ?? fallbackPriceRange[1]);

  const priceRange = useMemo<[number, number]>(() => {
    return [
      Number.isFinite(minPrice) ? minPrice : fallbackPriceRange[0],
      Number.isFinite(maxPrice) ? maxPrice : fallbackPriceRange[1],
    ];
  }, [fallbackPriceRange, minPrice, maxPrice]);

  const syncFilters = useCallback(
    (nextValues: {
      search?: string;
      language?: Language | null;
      priceRange?: [number, number];
    }) => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      params.delete('page');

      if (nextValues.search !== undefined) {
        if (nextValues.search.trim()) {
          params.set('search', nextValues.search.trim());
        } else {
          params.delete('search');
        }
      }

      if (nextValues.language !== undefined) {
        if (nextValues.language) {
          params.set('language', nextValues.language);
        } else {
          params.delete('language');
        }
      }

      if (nextValues.priceRange) {
        params.set('minPrice', String(nextValues.priceRange[0]));
        params.set('maxPrice', String(nextValues.priceRange[1]));
      }

      const currentQuery = searchParams?.toString() ?? '';
      const nextQuery = params.toString();

      if (nextQuery === currentQuery) {
        return;
      }

      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleSearchChange = useCallback(
    (nextQuery: string) => {
      syncFilters({ search: nextQuery });
    },
    [syncFilters]
  );

  const handleLanguageChange = useCallback(
    (nextLanguage: Language | null) => {
      syncFilters({ language: nextLanguage });
    },
    [syncFilters]
  );

  const handlePriceRangeChange = useCallback(
    (nextPriceRange: [number, number]) => {
      syncFilters({ priceRange: nextPriceRange });
    },
    [syncFilters]
  );

  const resetFilters = useCallback(() => {
    setDraftQuery('');

    const currentQuery = searchParams?.toString() ?? '';
    if (!currentQuery) {
      return;
    }

    router.replace(pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return {
    draftQuery,
    language,
    priceRange,
    setDraftQuery,
    onSearch: handleSearchChange,
    onLanguageChange: handleLanguageChange,
    onPriceRangeChange: handlePriceRangeChange,
    resetFilters,
  };
}

export { useBookFilters };
