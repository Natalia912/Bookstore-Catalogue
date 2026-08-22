import { createPublicClient } from '@/src/shared/configs/index.server';
import { ApiResultWithData } from '@/src/shared/types';
import { PriceRange } from '../model/types';
import { unstable_cache } from 'next/cache';

type GetPriceBoundsResult = ApiResultWithData<PriceRange>;

const DEFAULT_PRICE_BOUNDS: PriceRange = [0, 100];

export const getBooksPriceBounds = unstable_cache(
  async (): Promise<GetPriceBoundsResult> => {
    try {
      const supabase = createPublicClient();

      const { data, error } = await supabase.from('books').select('price').not('price', 'is', null);

      if (error) {
        return { success: false, error: error.message };
      }

      const prices = (data ?? [])
        .map((item) => Number(item.price))
        .filter((price): price is number => Number.isFinite(price));

      if (prices.length === 0) {
        return { success: true, data: DEFAULT_PRICE_BOUNDS };
      }

      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));

      return {
        success: true,
        data: [min, max],
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error. Please try again.',
      };
    }
  },
  ['books-price-bounds'],
  { revalidate: 1000 }
);
