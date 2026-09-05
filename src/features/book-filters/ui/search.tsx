'use client';
import {
  Button,
  Field,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/src/shared/components';
import { SearchIcon, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';

import { useTranslations } from 'next-intl';

function Search({
  value,
  disabled,
  onChange,
  onSearch,
}: {
  value: string;
  disabled?: boolean;
  onChange: (query: string) => void;
  onSearch: (query: string) => void;
}) {
  const t = useTranslations('bookFilters.search');
  const inputId = useId();

  const inputRef = useRef<HTMLInputElement>(null);
  const onSearchRef = useRef(onSearch);
  const isFirstValueSync = useRef(true);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (isFirstValueSync.current) {
      isFirstValueSync.current = false;
      return;
    }

    const timer = setTimeout(() => onSearchRef?.current(value), 1500);
    return () => clearTimeout(timer);
  }, [value]);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      e.preventDefault();
      handleClear();
    }
  };
  return (
    <Field>
      <FieldLabel htmlFor={inputId} className="sr-only">
        {t('label')}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={inputId}
          disabled={disabled}
          ref={inputRef}
          placeholder={t('placeholder')}
          role="searchbox"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        {value && (
          <InputGroupAddon>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              aria-label={t('clearAriaLabel')}
              className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>
    </Field>
  );
}

export { Search };
