'use client';
import Link from 'next/link';
import { Book, formatPrice } from '@/src/entities/book';
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/shared/components';
import { DeleteModal } from './delete-modal';
import { useDeleteBook } from '../model/use-delete';

const headerCells = ['Title', 'Author', 'Language', 'Price', 'Stock', 'ISBN'];

export const BookTable = ({ books }: { books: Book[] }) => {
  const { confirmedDeleteBook } = useDeleteBook();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headerCells.map((cell) => (
            <TableHead key={cell}>{cell}</TableHead>
          ))}
          <TableHead className="text-right font-medium">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.map((book) => (
          <TableRow key={book.id}>
            <TableCell>{book.title}</TableCell>
            <TableCell>{book.author ?? '—'}</TableCell>
            <TableCell>
              <Badge variant="outline">{book.language}</Badge>
            </TableCell>
            <TableCell>{formatPrice(book.price) ?? '—'}</TableCell>
            <TableCell>{book.quantity}</TableCell>
            <TableCell>{book.isbn ?? '—'}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Link href={`/dashboard/edit-book?id=${book.id}`} passHref>
                  <Button type="button" variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <DeleteModal
                  onConfirm={() => confirmedDeleteBook(book.id)}
                  trigger={
                    <Button type="button" variant="destructive" size="sm">
                      Delete
                    </Button>
                  }
                  title={book.title}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
