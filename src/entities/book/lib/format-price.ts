export function formatPrice(price: number | null | undefined): string | null {
  if (price === null || price === undefined) return null;
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
}
