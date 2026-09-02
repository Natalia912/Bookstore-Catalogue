'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Language } from '@/src/entities/book';
import { PriceRange } from '@/src/shared/types/price-range';

const DEFAULT_PRICE_RANGE: [number, number] = [0, 10000];

function useBookFilters(priceBounds?: [number, number] | null) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTokenRef = useRef(0);
  const [isPending, startTransition] = useTransition();

  const [draftQuery, setDraftQuery] = useState(() => searchParams?.get('search') ?? '');

  const language = (searchParams?.get('language') as Language | null) ?? null;
  const fallbackPriceRange = useMemo(
    () => [priceBounds?.[0] ?? DEFAULT_PRICE_RANGE[0], priceBounds?.[1] ?? DEFAULT_PRICE_RANGE[1]],
    [priceBounds]
  );
  const minPrice = Number(searchParams?.get('minPrice') ?? fallbackPriceRange[0]);
  const maxPrice = Number(searchParams?.get('maxPrice') ?? fallbackPriceRange[1]);

  const urlPriceRange: PriceRange = useMemo(
    () => [
      isFinite(minPrice) ? minPrice : fallbackPriceRange[0],
      isFinite(maxPrice) ? maxPrice : fallbackPriceRange[1],
    ],
    [minPrice, maxPrice, fallbackPriceRange]
  );

  // Optimistic override: set the instant the user commits a drag,
  // cleared once the URL actually reflects it.
  const [pendingPriceRange, setPendingPriceRange] = useState<PriceRange | null>(null);

  useEffect(() => {
    if (!pendingPriceRange) return;
    if (pendingPriceRange[0] === urlPriceRange[0] && pendingPriceRange[1] === urlPriceRange[1]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingPriceRange(null); // URL caught up, drop the override
    }
  }, [urlPriceRange, pendingPriceRange]);

  const priceRange: PriceRange = pendingPriceRange ?? urlPriceRange;

  const syncFilters = (nextValues: {
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
    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  const handleSearchChange = (nextQuery: string) => {
    const token = ++searchTokenRef.current;
    const currentQuery = searchParams?.get('search') ?? '';
    if (nextQuery == currentQuery) return;

    startTransition(() => {
      if (token !== searchTokenRef.current) return;
      syncFilters({ search: nextQuery });
    });
  };

  const handleLanguageChange = (nextLanguage: Language | null) => {
    if (nextLanguage === language) return;
    syncFilters({ language: nextLanguage });
  };

  const handlePriceRangeChange = (nextPriceRange: [number, number]) => {
    if (nextPriceRange[0] === priceRange[0] && nextPriceRange[1] === priceRange[1]) return;
    setPendingPriceRange(nextPriceRange); // reflect immediately, no flicker
    syncFilters({ priceRange: nextPriceRange });
  };

  const resetFilters = () => {
    searchTokenRef.current += 1;
    setDraftQuery('');
    setPendingPriceRange(null);

    const currentQuery = searchParams?.toString() ?? '';
    if (!currentQuery) {
      return;
    }

    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return {
    draftQuery,
    language,
    priceRange,
    isPending,
    setDraftQuery,
    onSearch: handleSearchChange,
    onLanguageChange: handleLanguageChange,
    onPriceRangeChange: handlePriceRangeChange,
    resetFilters,
  };
}

export { useBookFilters };
