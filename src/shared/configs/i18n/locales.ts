export const LOCALES = ['en', 'ru', 'kk'] as const;

export type Locale = (typeof LOCALES)[number];

export type LocaleOption = {
  code: Locale;
  label: string;
};

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'kk', label: 'Қазақша' },
];
