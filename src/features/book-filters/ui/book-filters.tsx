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
  } = useBookFilters(priceBounds);

  return (
    <LayoutWrapper
      onReset={resetFilters}
      search={<Search value={draftQuery} onChange={setDraftQuery} onSearch={onSearch} />}
      select={<LanguageSelect language={language} onSelect={onLanguageChange} />}
      slider={
        <PriceSlider
          min={priceBounds?.[0] ?? 0}
          max={priceBounds?.[1] ?? 100}
          value={priceRange}
          onChange={onPriceRangeChange}
        />
      }
    />
  );
}

export { BookFilters };
