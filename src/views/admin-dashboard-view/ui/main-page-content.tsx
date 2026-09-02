import { type Book } from '@/src/entities/book';
import { BookFilters } from '@/src/features/book-filters';
import { BookPagination } from '@/src/features/book-pagination';
import { Button, Card, CardContent } from '@/src/shared/components';
import { BooksListEmptyState } from '@/src/views/books-user-view/ui/books-list-states';

import { buildAdminDashboardPageHref, type AdminDashboardQueryParams } from '../model/query';
import { PriceRange } from '@/src/shared/types';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

type MainPageContentProps = {
  searchParams: AdminDashboardQueryParams;
  priceBounds: PriceRange | null;
  currentPage: number;
  totalPages: number;
  hasActiveFilters: boolean;
  isEmpty: boolean;
};

export function MainPageContent({
  searchParams,
  priceBounds,
  currentPage,
  totalPages,
  hasActiveFilters,
  isEmpty,
  children,
}: MainPageContentProps & PropsWithChildren) {
  return (
    <main className="mx-auto flex w-full max-w-300 flex-col gap-4 px-4 py-4 lg:gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">Current catalogue</h1>
        </div>

        <Link href="/dashboard/add-book" passHref>
          <Button type="button" variant="outline" size="sm">
            Add new book
          </Button>
        </Link>
      </header>

      <section>
        <BookFilters priceBounds={priceBounds} />
      </section>

      {isEmpty ? (
        <BooksListEmptyState hasFilters={hasActiveFilters} />
      ) : (
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">{children}</div>
          </CardContent>
        </Card>
      )}

      <BookPagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildPageHref={(pageNumber) => buildAdminDashboardPageHref(searchParams, pageNumber)}
      />
    </main>
  );
}
