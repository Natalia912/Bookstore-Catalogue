import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/src/shared/components';

type BookPaginationProps = {
  currentPage: number;
  totalPages: number;
  buildPageHref: (pageNumber: number) => string;
};

function BookPagination({ currentPage, totalPages, buildPageHref }: BookPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <section className="pt-2">
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={buildPageHref(currentPage - 1)} />
            </PaginationItem>
          )}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink href={buildPageHref(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={buildPageHref(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </section>
  );
}

export { BookPagination };
