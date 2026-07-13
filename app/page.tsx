import { AddBookForm } from '@/src/features/add-book';
import { BooksListView } from '@/src/views/books-user-view';

export default function Home() {
  return (
    <>
      <BooksListView />
      <AddBookForm />
    </>
  );
}
