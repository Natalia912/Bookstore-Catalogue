import type { PriceRange } from '@/src/shared/types';

export type AdminDashboardQueryParams = {
  search?: string;
  language?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};

export type NormalizedAdminDashboardQuery = {
  search: string | null;
  language: string | null;
  currentPage: number;
  priceRange: PriceRange | null;
  hasActiveFilters: boolean;
};

export function normalizeAdminDashboardQuery(
  searchParams?: AdminDashboardQueryParams
): NormalizedAdminDashboardQuery {
  const search = searchParams?.search?.trim() ?? null;
  const language = searchParams?.language?.trim() ?? null;
  const currentPage = Math.max(1, Number(searchParams?.page ?? 1));

  const minPrice = Number(searchParams?.minPrice ?? 0);
  const maxPrice = Number(searchParams?.maxPrice ?? 100);
  const hasPriceFilter = Boolean(searchParams?.minPrice || searchParams?.maxPrice);
  const priceRange = hasPriceFilter
    ? ([Number.isFinite(minPrice) ? minPrice : 0, Number.isFinite(maxPrice) ? maxPrice : 100] as [
        number,
        number,
      ])
    : null;

  return {
    search,
    language,
    currentPage,
    priceRange,
    hasActiveFilters: Boolean(search || language || priceRange),
  };
}

export function buildAdminDashboardPageHref(
  searchParams: AdminDashboardQueryParams | undefined,
  pageNumber: number
) {
  const params = new URLSearchParams();
  const normalized = normalizeAdminDashboardQuery(searchParams);

  if (normalized.search) {
    params.set('search', normalized.search);
  }

  if (normalized.language) {
    params.set('language', normalized.language);
  }

  if (normalized.priceRange) {
    params.set('minPrice', String(normalized.priceRange[0]));
    params.set('maxPrice', String(normalized.priceRange[1]));
  }

  if (pageNumber > 1) {
    params.set('page', String(pageNumber));
  }

  const queryString = params.toString();
  return queryString ? `/dashboard?${queryString}` : '/dashboard';
}
