import { BooksListView } from '@/src/views/books-user-view';
import { getBooksPriceBounds } from '@/src/entities/book/index.server';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

type SearchParams = Promise<{
  search?: string;
  language?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const priceBoundsResult = await getBooksPriceBounds();
  const priceBounds = priceBoundsResult.success ? priceBoundsResult.data : null;
  const locale = await getLocale();

  return (
    <NextIntlClientProvider locale={locale}>
      <BooksListView searchParams={resolvedSearchParams} priceBounds={priceBounds} />
    </NextIntlClientProvider>
  );
}
