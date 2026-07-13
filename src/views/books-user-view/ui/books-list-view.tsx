import { BookGrid } from '@/src/features/book-grid';
import { Suspense, use } from 'react';
import { getBooks } from '../api/get-books';

function BooksGridWrapper() {
  const booksResult = use(getBooks({ search: null, language: null }));

  if (booksResult.success) {
    return <BookGrid books={booksResult.data} />;
  }

  return <div>{booksResult.error}</div>;
}

function BooksListView() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <BooksGridWrapper />
      </Suspense>
    </>
  );
}

export { BooksListView };
