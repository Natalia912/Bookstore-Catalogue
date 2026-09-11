'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { BookOpen, Tag, Barcode, Globe, PackageCheck, PackageX } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Badge,
} from '@/src/shared/components';
import { Book, formatPrice } from '@/src/entities/book';
import { getGenreLabel } from '@/src/entities/genres';

type BookDetailsModalProps = {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BookDetailsModal({ book, open, onOpenChange }: BookDetailsModalProps) {
  const t = useTranslations('bookDetails');
  const locale = useLocale();

  if (!book) return null;

  const { title, author, language = 'ru', price, quantity = 0, cover_url, isbn, genre } = book;
  const genreLabel = getGenreLabel(genre, locale);
  const inStock = quantity > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-xl md:max-w-2xl md:p-8">
        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-12">
          {/* Left Column: Larger Cover Image */}
          <div className="flex flex-col items-center md:col-span-5">
            <div className="bg-muted border-border/50 relative flex aspect-2/3 w-full max-w-[260px] items-center justify-center overflow-hidden rounded-xl border shadow-sm md:max-w-full">
              {cover_url ? (
                <Image
                  src={cover_url}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'contain' }}
                  className="h-full w-full object-cover p-2"
                  priority
                />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center justify-center p-6">
                  <BookOpen className="mb-2 h-16 w-16 stroke-[1.25]" />
                  <span className="text-xs">{t('noCoverImage')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="flex flex-col justify-between gap-4 md:col-span-7">
            <div className="space-y-3">
              <DialogHeader className="p-0 text-left">
                <DialogTitle className="text-xl leading-tight font-bold md:text-2xl">
                  {title}
                </DialogTitle>
                {author && (
                  <DialogDescription className="text-muted-foreground text-base font-medium">
                    {t('byAuthor', { author })}
                  </DialogDescription>
                )}
              </DialogHeader>

              {/* Price & Availability */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-foreground text-2xl font-bold">
                  {formatPrice(price) ?? '—'}
                </span>
                <Badge
                  variant={inStock ? 'outline' : 'destructive'}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold ${
                    inStock
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : ''
                  }`}
                >
                  {inStock ? (
                    <>
                      <PackageCheck className="h-3.5 w-3.5" />
                      <span>{t('inStock', { quantity })}</span>
                    </>
                  ) : (
                    <>
                      <PackageX className="h-3.5 w-3.5" />
                      <span>{t('outOfStock')}</span>
                    </>
                  )}
                </Badge>
              </div>

              {/* Details List */}
              <div className="border-border mt-4 space-y-2.5 border-t pt-4 text-sm">
                <div className="text-muted-foreground flex items-center gap-2">
                  <Globe className="text-foreground/70 h-4 w-4 shrink-0" />
                  <span className="text-foreground font-medium">{t('languageLabel')}</span>
                  <span>
                    {t(`languages.${language}` as 'languages.en' | 'languages.kk' | 'languages.ru')}
                  </span>
                </div>

                {genreLabel && (
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Tag className="text-foreground/70 h-4 w-4 shrink-0" />
                    <span className="text-foreground font-medium">{t('genreLabel')}</span>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {genreLabel}
                    </Badge>
                  </div>
                )}

                {isbn && (
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Barcode className="text-foreground/70 h-4 w-4 shrink-0" />
                    <span className="text-foreground font-medium">{t('isbnLabel')}</span>
                    <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{isbn}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
