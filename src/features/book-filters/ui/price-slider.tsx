'use client';

import { useEffect, useId, useState } from 'react';
import { useSafeTranslations } from '@/src/shared/configs/i18n';
import { Field, FieldDescription, FieldLabel, Slider } from '@/src/shared/components';
import { PriceRange } from '@/src/shared/types';

function PriceSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  disabled,
}: {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  value: PriceRange;
  onChange: (value: PriceRange) => void;
}) {
  const t = useSafeTranslations('bookFilters.price');
  const labelId = useId();
  const descriptionId = useId();

  const [localValue, setLocalValue] = useState<PriceRange>(value ?? [min, max]);

  const [currentMin, currentMax] = localValue;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value);
  }, [value]);

  const handleValueChange = (next: [number, number]) => {
    setLocalValue(next);
  };

  const handleValueCommit = (next: [number, number]) => {
    onChange?.(next);
  };

  return (
    <Field className="space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FieldLabel htmlFor={labelId} className="text-sm font-medium">
          {t('label')}
        </FieldLabel>
      </div>
      <FieldDescription id={descriptionId} className="sr-only">
        {t('description')}
      </FieldDescription>
      <Slider
        id={labelId}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        value={localValue}

        onValueChange={(next) => handleValueChange(next as [number, number])}
        onValueCommitted={(next) => handleValueCommit(next as [number, number])}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>{currentMin}₸</span>
        <span>{currentMax}₸</span>
      </div>
    </Field>
  );
}

export { PriceSlider };
