import { BookGrid } from '@/src/features/book-grid';
import { Suspense, use } from 'react';
import {
  BooksListEmptyState,
  BooksListErrorState,
  BooksListLoadingState,
} from './books-list-states';
import { getBooks } from '../api/get-books';
import { BookFilters } from '@/src/features/book-filters';

type BooksListViewProps = {
  searchParams?: {
    search?: string;
    language?: string;
    minPrice?: string;
    maxPrice?: string;
  };
  priceBounds?: [number, number] | null;
};

function BooksGridWrapper({
  search,
  language,
  priceRange,
}: {
  search: string | null;
  language: string | null;
  priceRange?: [number, number] | null;
}) {
  const booksResult = use(getBooks({ search, language, priceRange }));

  if (!booksResult.success) {
    return <BooksListErrorState error={booksResult.error} />;
  }

  if (booksResult.data.length === 0) {
    return <BooksListEmptyState hasFilters={Boolean(search || language || priceRange)} />;
  }

  return <BookGrid books={booksResult.data} />;
}

function BooksListView({ searchParams, priceBounds }: BooksListViewProps) {
  const search = searchParams?.search?.trim() ?? null;
  const language = searchParams?.language?.trim() ?? null;
  const minPrice = Number(searchParams?.minPrice ?? 0);
  const maxPrice = Number(searchParams?.maxPrice ?? 100);

  const hasPriceFilter = Boolean(searchParams?.minPrice || searchParams?.maxPrice);
  const priceRange = hasPriceFilter
    ? ([Number.isFinite(minPrice) ? minPrice : 0, Number.isFinite(maxPrice) ? maxPrice : 100] as [
        number,
        number,
      ])
    : null;

  const filtersKey = [
    search ?? '',
    language ?? '',
    priceRange?.[0] ?? '',
    priceRange?.[1] ?? '',
  ].join('|');

  return (
    <main className="mx-auto flex w-full max-w-300 flex-col gap-4 px-4 py-4 lg:gap-6">
      <h1 className="text-4xl">Books</h1>
      <section>
        <BookFilters priceBounds={priceBounds} />
      </section>
      <section>
        <Suspense fallback={<BooksListLoadingState />}>
          <BooksGridWrapper
            key={filtersKey}
            search={search}
            language={language}
            priceRange={priceRange}
          />
        </Suspense>
      </section>
    </main>
  );
}

export { BooksListView };
