import { BooksListView } from '@/src/views/books-user-view';
import { getBooksPriceBounds } from '@/src/entities/book/index.server';

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

  return <BooksListView searchParams={resolvedSearchParams} priceBounds={priceBounds} />;
}
