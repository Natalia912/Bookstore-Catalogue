import { redirect } from 'next/navigation';
import type { AdminDashboardQueryParams } from '../model/query';
import { normalizeAdminDashboardQuery } from '../model/query';
import { MainPageContent } from './main-page-content';
import { ADMIN_LOGIN_PATH, hasAdminAccess } from '@/src/entities/auth';
import { getBooksPriceBounds, getBooks } from '@/src/entities/book/index.server';
import { BooksErrorState } from './books-error-state';
import { BOOKS_PAGE_SIZE } from '../model/constants';
import { BookTable } from './book-table';
type AdminDashboardViewProps = {
  searchParams: AdminDashboardQueryParams;
};

async function AdminDashboardView({ searchParams }: AdminDashboardViewProps) {
  if (!(await hasAdminAccess())) {
    const url = `${ADMIN_LOGIN_PATH}?error=unauthorized`;
    redirect(url);
  }

  const normalized = normalizeAdminDashboardQuery(searchParams);

  const priceBoundsResult = await getBooksPriceBounds();
  const priceBounds = priceBoundsResult.success ? priceBoundsResult.data : null;

  const booksResult = await getBooks({
    search: normalized.search,
    language: normalized.language,
    priceRange: normalized.priceRange,
    page: normalized.currentPage,
    pageSize: BOOKS_PAGE_SIZE,
  });

  if (!booksResult.success) {
    return (
      <main className="mx-auto flex w-full max-w-300 flex-col gap-4 px-4 py-4 lg:gap-6">
        <BooksErrorState error={booksResult.error} />
      </main>
    );
  }
  const { hasActiveFilters } = normalizeAdminDashboardQuery(searchParams);

  return (
    <MainPageContent
      isEmpty={booksResult.data.length === 0}
      searchParams={searchParams}
      priceBounds={priceBounds}
      currentPage={normalized.currentPage}
      totalPages={booksResult.pagination.totalPages}
      hasActiveFilters={hasActiveFilters}
    >
      <BookTable books={booksResult.data} />
    </MainPageContent>
  );
}

export { AdminDashboardView };
