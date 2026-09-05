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
import { useSafeTranslations } from '@/src/shared/configs/i18n';

function BooksListEmptyState({ hasFilters }: { hasFilters: boolean }) {
  const t = useSafeTranslations('booksListView.emptyState');

  return (
    <Empty className="min-h-72">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX className="size-5" />
        </EmptyMedia>
        <EmptyTitle>
          {hasFilters ? t('noMatchingTitle') : t('noAvailableTitle')}
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          {hasFilters ? t('noMatchingDescription') : t('noAvailableDescription')}
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}

function BooksListErrorState({ error }: { error: string }) {
  const t = useSafeTranslations('booksListView.errorState');

  return (
    <Empty className="min-h-72">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle className="size-5" />
        </EmptyMedia>
        <EmptyTitle>{t('title')}</EmptyTitle>
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
