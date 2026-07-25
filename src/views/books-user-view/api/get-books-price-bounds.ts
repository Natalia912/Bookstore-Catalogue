import { createClient } from '@/src/shared/configs/supabase';
import { ApiResultWithData } from '@/src/shared/types';

type PriceRange = [number, number];
type GetPriceBoundsResult = ApiResultWithData<PriceRange>;

const DEFAULT_PRICE_BOUNDS: PriceRange = [0, 100];

export const getBooksPriceBounds = async (): Promise<GetPriceBoundsResult> => {
  try {
    const supabase = await createClient();

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
};
