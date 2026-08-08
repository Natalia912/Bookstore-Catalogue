'use client';

import { useState } from 'react';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/shared/components';
import { ReactElement } from 'react';
import { FilterIcon } from 'lucide-react';
import { cn } from '@/src/shared/lib';

type Props = {
  search: ReactElement;
  select: ReactElement;
  slider: ReactElement;
  onReset: () => void;
};

function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onReset}
      className="whitespace-nowrap md:self-start lg:self-center"
    >
      Reset
    </Button>
  );
}

function LayoutWrapper({ search, select, slider, onReset }: Props) {
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
                  aria-label={open ? 'Hide filters' : 'Show filters'}
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
            <ResetButton onReset={onReset} />
          </div>
        </CollapsibleContent>

        <div className="hidden items-center gap-4 lg:flex lg:flex-1/2">
          {select}
          {slider}
          <ResetButton onReset={onReset} />
        </div>
      </div>
    </Collapsible>
  );
}

export { LayoutWrapper };
