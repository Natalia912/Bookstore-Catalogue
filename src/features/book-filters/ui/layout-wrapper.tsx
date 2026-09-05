'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  select: ReactElement;
  slider: ReactElement;
  isLoading: boolean;
  onReset: () => void;
};

function ResetButton({ onReset, isLoading }: { onReset: () => void; isLoading: boolean }) {
  const t = useTranslations('bookFilters');
  return (
    <div className="relative flex flex-row-reverse">
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
      {isLoading && (
        <Spinner className="text-primary absolute top-1/2 right-14 size-5 -translate-1/2 lg:-right-10" />
      )}
    </div>
  );
}

function LayoutWrapper({ search, select, slider, onReset, isLoading }: Props) {
  const t = useTranslations('bookFilters.toggle');
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-start justify-between gap-3 lg:flex-1/2">
          <div className="flex-1">{search}</div>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger
              render={
                <Button
                  variant="ghost"
                  aria-label={open ? t('hideAriaLabel') : t('showAriaLabel')}
                  className={cn(open && 'border-foreground', 'lg:hidden')}
                >
                  <FilterIcon />
                </Button>
              }
            />
          </div>
        </div>
        <CollapsibleContent className="lg:hidden">
          <div className="flex flex-col gap-2">
            {select}
            {slider}
            <ResetButton onReset={onReset} isLoading={isLoading} />
          </div>
        </CollapsibleContent>

        <div className="hidden items-center gap-4 lg:flex lg:flex-1/2">
          {select}
          {slider}
          <ResetButton onReset={onReset} isLoading={isLoading} />
        </div>
      </div>
    </Collapsible>
  );
}

export { LayoutWrapper };
