import { LANGUAGES } from './constants';

const languageOptions = [
  { value: LANGUAGES.ru, label: 'Russian' },
  { value: LANGUAGES.kk, label: 'Kazakh' },
  { value: LANGUAGES.en, label: 'English' },
  { value: LANGUAGES.other, label: 'Other' },
] as const;

export { languageOptions };
