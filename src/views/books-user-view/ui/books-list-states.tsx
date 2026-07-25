import { AlertCircle, SearchX } from 'lucide-react';
import { BookGridSkeleton } from '@/src/features/book-grid';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/shared/components';

function BooksListEmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <Empty className="min-h-72">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX className="size-5" />
        </EmptyMedia>
        <EmptyTitle>
          {hasFilters ? 'No books match your filters' : 'No books available yet'}
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          {hasFilters
            ? 'Try clearing one or more filters to see all books again.'
            : 'New books will appear here once they are added to the catalogue.'}
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}

function BooksListErrorState({ error }: { error: string }) {
  return (
    <Empty className="min-h-72">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle className="size-5" />
        </EmptyMedia>
        <EmptyTitle>Something went wrong</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>{error}</EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
function BooksListLoadingState() {
  return <BookGridSkeleton />;
}

export { BooksListEmptyState, BooksListErrorState, BooksListLoadingState };
