import { Card, CardContent, Badge, CardDescription, CardTitle } from '@/src/shared/components';
import { BookOpen } from 'lucide-react';
import { Book, formatPrice } from '@/src/entities/book';
import Image from 'next/image';

const LANGUAGE_LABELS = {
  ru: 'ru',
  kk: 'kk',
  en: 'en',
  other: '—',
};

type Props = {
  book: Book;
  onClick?: () => void;
};

export default function BookCard({ book, onClick }: Props) {
  const { title, author, language = 'ru', price, quantity = 0, cover_url } = book;

  const inStock = quantity > 0;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      size="sm"
      className="h-full cursor-pointer gap-0 overflow-hidden p-0 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="bg-muted relative flex aspect-2/3 max-h-60 w-full items-center justify-center">
        {cover_url ? (
          <Image
            src={cover_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'contain' }}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <BookOpen className="text-muted-foreground h-8 w-8" strokeWidth={1.5} />
        )}

        <Badge className="absolute top-2 left-2">{LANGUAGE_LABELS[language] ?? language}</Badge>
      </div>

      <CardContent className="flex grow flex-col p-3">
        <CardTitle>{title}</CardTitle>
        {author && <CardDescription>{author}</CardDescription>}

        <div className="mt-auto flex items-center justify-between pt-2 md:pt-4">
          <span className="text-sm font-medium">{formatPrice(price) ?? '—'}</span>
          <span className={'text-xs ' + (inStock ? 'text-emerald-600' : 'text-muted-foreground')}>
            {inStock ? `in stock · ${quantity}` : 'out of stock'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
