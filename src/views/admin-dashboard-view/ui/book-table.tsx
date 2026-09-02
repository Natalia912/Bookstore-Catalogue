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

const headerCells = ['Title', 'Author', 'Language', 'Price', 'Stock', 'ISBN'];

export const BookTable = ({ books }: { books: Book[] }) => {
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
                <Button type="button" variant="outline" size="sm">
                  Edit
                </Button>
                <Button type="button" variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
