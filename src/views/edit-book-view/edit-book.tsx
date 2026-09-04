import { EditBookForm } from '@/src/features/edit-book';
import { getBook } from '@/src/entities/book/index.server';
import Link from 'next/link';
import { Button } from '@/src/shared/components';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface EditBookViewProps {
  id: string;
}

export async function EditBookView({ id }: EditBookViewProps) {
  const { data: book, error } = await getBook(id);

  if (error || !book) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-4 lg:gap-8">
      <Link href="/dashboard" className="self-start">
        <Button variant="outline" size="sm">
          <ArrowLeft />
          Back to Dashboard
        </Button>
      </Link>

      <EditBookForm book={book} id={id} />
    </main>
  );
}
