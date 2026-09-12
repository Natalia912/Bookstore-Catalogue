'use client';

import { useState } from 'react';
import { useSafeTranslations } from '@/src/shared/configs/i18n';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Spinner,
} from '@/src/shared/components';
import { ReactElement } from 'react';
import { FilterIcon } from 'lucide-react';
import { cn } from '@/src/shared/lib';

type Props = {
  search: ReactElement;
  languageSelect: ReactElement;
  genreSelect: ReactElement;
  slider: ReactElement;
  isLoading: boolean;
  onReset: () => void;
};

function ResetButton({ onReset, isLoading }: { onReset: () => void; isLoading: boolean }) {
  const t = useSafeTranslations('bookFilters');
  return (
    <div className="relative flex items-center justify-end gap-2">
      {isLoading && (
        <Spinner className="text-primary size-5 shrink-0 lg:absolute lg:top-1/2 lg:-right-10 lg:-translate-1/2" />
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReset}
        className="whitespace-nowrap md:self-start lg:self-center"
        data-testid="reset-filters-button"
      >
        {t('reset')}
      </Button>
    </div>
  );
}

function LayoutWrapper({ search, languageSelect, genreSelect, slider, onReset, isLoading }: Props) {
  const t = useSafeTranslations('bookFilters.toggle');
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">{search}</div>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  aria-label={open ? t('hideAriaLabel') : t('showAriaLabel')}
                  className={cn(open && 'border-foreground')}
                >
                  <FilterIcon />
                  <span className="hidden sm:inline">{t('label')}</span>
                </Button>
              }
            />
          </div>
        </div>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4">
            <div className="lg:w-52">{languageSelect}</div>
            <div className="lg:w-52">{genreSelect}</div>
            <div className="lg:min-w-60 lg:flex-1">{slider}</div>
            <ResetButton onReset={onReset} isLoading={isLoading} />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export { LayoutWrapper };
