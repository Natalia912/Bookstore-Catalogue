import { AddBookForm } from '@/src/features/add-book';
import Link from 'next/link';
import { Button } from '@/src/shared/components';
import { ArrowLeft } from 'lucide-react';

export function AddBookView() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-4 lg:gap-8">
      <Link href="/dashboard" className="self-start">
        <Button variant="outline" size="sm">
          <ArrowLeft />
          Back to Dashboard
        </Button>
      </Link>

      <AddBookForm />
    </main>
  );
}
