'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Field, FieldDescription, FieldLabel, Slider } from '@/src/shared/components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebouncedCallback<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay]
  );
}

function PriceSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  debounceMs = 400,
}: {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  debounceMs?: number;
} = {}) {
  const labelId = useId();
  const descriptionId = useId();

  const [localValue, setLocalValue] = useState<[number, number]>(value ?? [min, max]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value) setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useDebouncedCallback((next: [number, number]) => {
    onChange?.(next);
  }, debounceMs);

  const handleValueChange = useCallback(
    (next: [number, number]) => {
      setLocalValue(next);
      debouncedOnChange(next);
    },
    [debouncedOnChange]
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
        min={min}
        max={max}
        step={step}
      />
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>{currentMin}₸</span>
        <span>{currentMax}₸</span>
      </div>
    </Field>
  );
}

export { PriceSlider };
