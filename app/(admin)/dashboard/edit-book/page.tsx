import { EditBookView } from '@/src/views/edit-book-view';
import { notFound } from 'next/navigation';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EditBookPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;
  const id = typeof resolvedSearchParams.id === 'string' ? resolvedSearchParams.id : undefined;

  if (!id) {
    notFound();
  }

  return <EditBookView id={id} />;
}
