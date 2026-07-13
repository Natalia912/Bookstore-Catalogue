import { Book } from '@/src/entities/book';
import BookCard from './book-card';

type Props = {
  books: Book[];
};

export function BookGrid({ books }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} />
        </li>
      ))}
    </ul>
  );
}
