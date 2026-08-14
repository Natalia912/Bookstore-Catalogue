'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { Field, FieldDescription, FieldLabel, Slider } from '@/src/shared/components';

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
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  const labelId = useId();
  const descriptionId = useId();

  const [localValue, setLocalValue] = useState<[number, number]>(value ?? [min, max]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value) setLocalValue(value);
  }, [value]);

  const handleValueChange = useCallback((next: [number, number]) => {
    setLocalValue(next);
  }, []);

  // Update local value while dragging, but only notify parent when user releases.
  const handleValueCommit = useCallback(
    (next: [number, number]) => {
      onChange?.(next);
    },
    [onChange]
  );

  const [currentMin, currentMax] = localValue;

  return (
    <Field className="space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FieldLabel htmlFor={labelId} className="text-sm font-medium">
          Price range
        </FieldLabel>
      </div>
      <FieldDescription id={descriptionId} className="sr-only">
        Adjust the minimum and maximum price to narrow search results.
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
