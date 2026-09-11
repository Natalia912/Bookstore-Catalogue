'use client';

import { useCallback, useState } from 'react';
import { getGenreLabel, type Genre } from '@/src/entities/genres';
import { useSafeTranslations } from '@/src/shared/configs/i18n';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components';

function GenreSelect({
  genres,
  genreId,
  locale = 'en',
  onSelect,
  disabled,
}: {
  genres: Genre[];
  genreId: number | null;
  locale?: string;
  onSelect: (genreId: number | null) => void;
  disabled?: boolean;
}) {
  const t = useSafeTranslations('bookFilters.genre');
  const [localGenreId, setLocalGenreId] = useState<number | null>(genreId);
  const [previousGenreId, setPreviousGenreId] = useState(genreId);

  if (genreId !== previousGenreId) {
    setPreviousGenreId(genreId);
    setLocalGenreId(genreId);
  }

  const handleValueChange = useCallback(
    (nextValue: string | null) => {
      const nextGenreId = nextValue === null ? null : Number(nextValue);
      const resolvedGenreId = localGenreId === nextGenreId ? null : nextGenreId;

      setLocalGenreId(resolvedGenreId);
      onSelect(resolvedGenreId);
    },
    [localGenreId, onSelect]
  );

  const selectedGenre = genres.find((genre) => genre.id === localGenreId);

  return (
    <Select
      disabled={disabled}
      items={genres.map((genre) => ({
        value: String(genre.id),
        label: getGenreLabel(genre, locale) ?? genre.label_en,
      }))}
      value={localGenreId === null ? null : String(localGenreId)}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('placeholder')}>
          {selectedGenre ? (getGenreLabel(selectedGenre, locale) ?? selectedGenre.label_en) : null}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-w-[calc(100vw-2rem)] min-w-56 lg:w-max">
        <SelectGroup>
          <SelectLabel>{t('label')}</SelectLabel>
          {genres.map((genre) => (
            <SelectItem key={genre.id} value={String(genre.id)}>
              {getGenreLabel(genre, locale) ?? genre.label_en}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export { GenreSelect };
