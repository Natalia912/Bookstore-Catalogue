'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
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

type BookDetailsModalProps = {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BookDetailsModal({ book, open, onOpenChange }: BookDetailsModalProps) {
  const t = useTranslations('bookDetails');

  if (!book) return null;

  const { title, author, language = 'ru', price, quantity = 0, cover_url, isbn, category } = book;
  const inStock = quantity > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl md:max-w-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          {/* Left Column: Larger Cover Image */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="bg-muted relative aspect-2/3 w-full max-w-[260px] md:max-w-full overflow-hidden rounded-xl border border-border/50 shadow-sm flex items-center justify-center">
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
                <div className="flex flex-col items-center justify-center text-muted-foreground p-6">
                  <BookOpen className="h-16 w-16 mb-2 stroke-[1.25]" />
                  <span className="text-xs">{t('noCoverImage')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="md:col-span-7 flex flex-col gap-4 justify-between">
            <div className="space-y-3">
              <DialogHeader className="p-0 text-left">
                <DialogTitle className="text-xl md:text-2xl font-bold leading-tight">
                  {title}
                </DialogTitle>
                {author && (
                  <DialogDescription className="text-base text-muted-foreground font-medium">
                    {t('byAuthor', { author })}
                  </DialogDescription>
                )}
              </DialogHeader>

              {/* Price & Availability */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(price) ?? '—'}
                </span>
                <Badge
                  variant={inStock ? 'outline' : 'destructive'}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold ${inStock
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
              <div className="border-t border-border pt-4 mt-4 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4 shrink-0 text-foreground/70" />
                  <span className="font-medium text-foreground">{t('languageLabel')}</span>
                  <span>{t(`languages.${language}` as any)}</span>
                </div>

                {category && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4 shrink-0 text-foreground/70" />
                    <span className="font-medium text-foreground">{t('categoryLabel')}</span>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {category}
                    </Badge>
                  </div>
                )}

                {isbn && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Barcode className="h-4 w-4 shrink-0 text-foreground/70" />
                    <span className="font-medium text-foreground">{t('isbnLabel')}</span>
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                      {isbn}
                    </span>
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
