import type { Genre } from '../model';

type GenreLabelKey = 'label_en' | 'label_kk' | 'label_ru';

type SupportedLocale = 'en' | 'kk' | 'ru';

const genreLabelKeys: Record<SupportedLocale, GenreLabelKey> = {
  en: 'label_en',
  kk: 'label_kk',
  ru: 'label_ru',
};

export const getGenreLabel = (genre: Genre | null | undefined, locale: string): string | null => {
  if (!genre) return null;

  const language = locale.split('-')[0] as SupportedLocale;
  return genre[genreLabelKeys[language] ?? 'label_ru'];
};
