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
import { useId, useRef } from 'react';

import { useSafeTranslations } from '@/src/shared/configs/i18n';

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
  const t = useSafeTranslations('bookFilters.search');
  const inputId = useId();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClear = () => {
    onChange('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(value);
      return;
    }

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
      <div className="flex gap-1 lg:gap-2">
        <InputGroup className="flex-1">
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
        <Button type="button" onClick={() => onSearch(value)} disabled={disabled}>
          <span>{t('submit')}</span>
        </Button>
      </div>
    </Field>
  );
}

export { Search };
