'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Language, languageOptions } from '@/src/entities/book';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components';

function LanguageSelect({
  language,
  onSelect,
  disabled,
}: {
  language: Language | null;
  onSelect: (lang: Language | null) => void;
  disabled?: boolean;
}) {
  const t = useTranslations('bookFilters.language');
  const [localLanguage, setLocalLanguage] = useState<Language | null>(language);

  const [prevLanguage, setPrevLanguage] = useState(language);
  if (language !== prevLanguage) {
    setPrevLanguage(language);
    setLocalLanguage(language);
  }

  const handleValueChange = useCallback(
    (nextValue: Language | null) => {
      const resolvedValue = localLanguage === nextValue ? null : nextValue;

      setLocalLanguage(resolvedValue);
      onSelect(resolvedValue);
    },
    [localLanguage, onSelect]
  );

  return (
    <Select
      disabled={disabled}
      items={languageOptions}
      value={localLanguage}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('placeholder')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('label')}</SelectLabel>
          {languageOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {t(`options.${item.value}`)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export { LanguageSelect };
