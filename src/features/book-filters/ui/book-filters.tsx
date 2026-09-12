'use client';

import { Search } from './search';
import { LanguageSelect } from './language-select';
import { PriceSlider } from './price-slider';
import { LayoutWrapper } from './layout-wrapper';
import { GenreSelect } from './genre-select';
import { useBookFilters } from '../model';
import type { Genre } from '@/src/entities/genres';

function BookFilters({
  priceBounds,
  genres,
  locale = 'en',
}: {
  priceBounds?: [number, number] | null;
  genres: Genre[];
  locale?: string;
}) {
  const {
    draftQuery,
    language,
    genreId,
    priceRange,
    setDraftQuery,
    onSearch,
    onLanguageChange,
    onGenreChange,
    onPriceRangeChange,
    resetFilters,
    isPending,
  } = useBookFilters(priceBounds);

  return (
    <LayoutWrapper
      onReset={resetFilters}
      isLoading={isPending}
      search={
        <Search
          value={draftQuery}
          onChange={setDraftQuery}
          onSearch={onSearch}
          disabled={isPending}
        />
      }
      languageSelect={
        <LanguageSelect language={language} onSelect={onLanguageChange} disabled={isPending} />
      }
      genreSelect={
        <GenreSelect
          genres={genres}
          genreId={genreId}
          locale={locale}
          onSelect={onGenreChange}
          disabled={isPending}
        />
      }
      slider={
        <PriceSlider
          min={priceBounds?.[0] ?? 0}
          max={priceBounds?.[1] ?? 100}
          value={priceRange}
          onChange={onPriceRangeChange}
          disabled={isPending}
        />
      }
    />
  );
}

export { BookFilters };
