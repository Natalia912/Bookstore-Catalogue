import { BookGrid } from '@/src/features/book-grid';
import { Suspense, use, type ReactNode } from 'react';
import {
  BooksListEmptyState,
  BooksListErrorState,
  BooksListLoadingState,
} from './books-list-states';
import { getBooks } from '@/src/entities/book/index.server';
import { BookFilters } from '@/src/features/book-filters';
import { BookPagination } from '@/src/features/book-pagination';
import { useBooksListView } from '../model/use-books-list-view';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/src/features/language-switcher';

type BooksListViewProps = {
  searchParams?: {
    search?: string;
    language?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
  priceBounds?: [number, number] | null;
};

async function BooksListShell({
  priceBounds,
  children,
}: {
  priceBounds?: [number, number] | null;
  children: ReactNode;
}) {
  const t = await getTranslations('homepage');
  return (
    <main className="mx-auto flex w-full max-w-300 flex-col gap-4 px-4 py-4 lg:gap-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-4xl">{t('title')}</h1>
        <LanguageSwitcher />
      </div>
      <section>
        <Suspense fallback={null}>
          <BookFilters priceBounds={priceBounds} />
        </Suspense>
      </section>
      <Suspense fallback={<BooksListLoadingState />}>{children}</Suspense>
    </main>
  );
}

function BooksListView({ searchParams, priceBounds }: BooksListViewProps) {
  const {
    search,
    language,
    currentPage,
    pageSize,
    priceRange,
    filtersKey,
    buildPageHref,
    hasActiveFilters,
  } = useBooksListView(searchParams);

  const booksResult = use(
    getBooks({
      search,
      language,
      priceRange,
      page: currentPage,
      pageSize,
      onlyInStock: true,
    })
  );

  if (!booksResult.success) {
    return (
      <BooksListShell priceBounds={priceBounds}>
        <section>
          <BooksListErrorState error={booksResult.error} />
        </section>
      </BooksListShell>
    );
  }

  if (booksResult.data.length === 0) {
    return (
      <BooksListShell priceBounds={priceBounds}>
        <section>
          <BooksListEmptyState hasFilters={hasActiveFilters} />
        </section>
      </BooksListShell>
    );
  }

  const totalPages = booksResult.pagination.totalPages;
  const pageForDisplay = booksResult.pagination.page;

  return (
    <BooksListShell priceBounds={priceBounds}>
      <section>
        <div key={filtersKey}>
          <BookGrid books={booksResult.data} />
        </div>
      </section>
      <BookPagination
        currentPage={pageForDisplay}
        totalPages={totalPages}
        buildPageHref={buildPageHref}
      />
    </BooksListShell>
  );
}

export { BooksListView };
