'use client';

import { useState } from 'react';
import { Book } from '@/src/entities/book';
import BookCard from './book-card';
import { BookDetailsModal } from './book-details-modal';

type Props = {
  books: Book[];
};

export function BookGrid({ books }: Props) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {books.map((book) => (
          <li key={book.id}>
            <BookCard book={book} onClick={() => setSelectedBook(book)} />
          </li>
        ))}
      </ul>

      <BookDetailsModal
        book={selectedBook}
        open={!!selectedBook}
        onOpenChange={(open) => {
          if (!open) setSelectedBook(null);
        }}
      />
    </>
  );
}

