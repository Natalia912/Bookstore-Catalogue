import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/src/shared/components';
import { useSafeTranslations } from '@/src/shared/configs/i18n';

type BookPaginationProps = {
  currentPage: number;
  totalPages: number;
  buildPageHref: (pageNumber: number) => string;
};

function BookPagination({ currentPage, totalPages, buildPageHref }: BookPaginationProps) {
  const t = useSafeTranslations('pagination');

  if (totalPages <= 1) {
    return null;
  }

  return (
    <section className="pt-2">
      <Pagination aria-label={t('ariaLabel')}>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={buildPageHref(currentPage - 1)}
                text={t('previous')}
                aria-label={t('previousAriaLabel')}
              />
            </PaginationItem>
          )}
          {totalPages <= 5 ? (
            Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href={buildPageHref(page)} isActive={page === currentPage}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))
          ) : (
            <>
              {Array.from({ length: 2 }, (_, index) => index + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink href={buildPageHref(page)} isActive={page === currentPage}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              {Array.from({ length: 2 }, (_, index) => totalPages - index).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink href={buildPageHref(page)} isActive={page === currentPage}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </>
          )}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href={buildPageHref(currentPage + 1)}
                text={t('next')}
                aria-label={t('nextAriaLabel')}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </section>
  );
}

export { BookPagination };
