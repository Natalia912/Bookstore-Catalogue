'use client';

import { Search } from './search';
import { LanguageSelect } from './language-select';
import { PriceSlider } from './price-slider';
import { LayoutWrapper } from './layout-wrapper';
import { useBookFilters } from '../model';

function BookFilters({ priceBounds }: { priceBounds?: [number, number] | null }) {
  const {
    draftQuery,
    language,
    priceRange,
    setDraftQuery,
    onSearch,
    onLanguageChange,
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
      select={
        <LanguageSelect language={language} onSelect={onLanguageChange} disabled={isPending} />
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
