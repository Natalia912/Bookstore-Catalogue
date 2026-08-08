import { LANGUAGES } from './constants';
import { Language } from './types';

type LanguageOption = { value: Language; label: string };

const languageOptions: LanguageOption[] = [
  { value: LANGUAGES.ru, label: 'Russian' },
  { value: LANGUAGES.kk, label: 'Kazakh' },
  { value: LANGUAGES.en, label: 'English' },
  { value: LANGUAGES.other, label: 'Other' },
];

export { languageOptions };
