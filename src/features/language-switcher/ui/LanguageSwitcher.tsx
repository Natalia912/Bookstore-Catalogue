'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components';
import { LOCALE_OPTIONS } from '@/src/shared/configs/i18n';
import { setLocale } from '../api/actions';

export function LanguageSwitcher() {
  const t = useTranslations('languageSwitcher');
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleValueChange = (value: string | null) => {
    if (!value || value === currentLocale) return;

    startTransition(async () => {
      await setLocale(value);
    });
  };

  const selectedOption = LOCALE_OPTIONS.find((option) => option.code === currentLocale);

  return (
    <Select
      value={currentLocale}
      onValueChange={(val) => handleValueChange(val as string | null)}
      disabled={isPending}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={t('placeholder')}>
          {selectedOption?.label ?? currentLocale}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LOCALE_OPTIONS.map((option) => (
          <SelectItem key={option.code} value={option.code}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
