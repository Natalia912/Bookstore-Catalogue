import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo, useCallback } from 'react';

import {
  type Book,
  type UpdateBookInput,
  updateBookSchema,
  languageOptions,
} from '@/src/entities/book';

import { editBook } from '../api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UseEditBookOptions {
  book: Book;
  id: string;
}

export const useEditBook = ({ book, id }: UseEditBookOptions) => {
  const router = useRouter();

  const defaultValues: UpdateBookInput = useMemo(
    () => ({
      title: book.title,
      author: book.author ?? undefined,
      language: book.language ?? languageOptions[0].value,
      price: book.price ?? undefined,
      quantity: book.quantity ?? 1,
      isbn: book.isbn ?? '',
      category: book.category ?? undefined,
    }),
    [book]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm<UpdateBookInput>({
    resolver: zodResolver(updateBookSchema) as Resolver<UpdateBookInput>,
    defaultValues,
  });

  // Cover state management
  const coverFile = watch('cover_file');
  const [isCoverRemoved, setIsCoverRemoved] = useState(false);

  const existingCoverUrl = book.cover_url;

  // Determine what cover preview to show
  const coverPreviewUrl = useMemo(() => {
    if (coverFile) {
      return URL.createObjectURL(new Blob([coverFile]));
    }
    if (!isCoverRemoved && existingCoverUrl) {
      return existingCoverUrl;
    }
    return null;
  }, [coverFile, isCoverRemoved, existingCoverUrl]);

  const watchedValues = watch();

  const hasInputsChanged = useMemo(() => {
    return (Object.keys(defaultValues) as (keyof UpdateBookInput)[])
      .filter((key) => key !== 'cover_file')
      .some((key) => watchedValues[key] !== defaultValues[key]);
  }, [watchedValues, defaultValues]);

  const hasCoverChange = Boolean(coverFile) || isCoverRemoved;
  const isChanged = hasInputsChanged || hasCoverChange;

  const handleRemoveCover = useCallback(() => {
    setValue('cover_file', undefined);
    setIsCoverRemoved(true);
  }, [setValue]);

  const handleUndoRemoveCover = useCallback(() => {
    setIsCoverRemoved(false);
  }, []);

  const handleCoverFileChange = useCallback(
    (file: File | undefined) => {
      setValue('cover_file', file, { shouldDirty: true });
      // If a new file is selected, we're no longer in "removed" state
      if (file) {
        setIsCoverRemoved(false);
      }
    },
    [setValue]
  );

  async function onSubmit(data: UpdateBookInput) {
    const t = toast.loading('Saving changes...');

    const payload: UpdateBookInput = { ...data };

    if (isCoverRemoved && !coverFile) {
      payload.remove_cover = true;
    }

    const result = await editBook(id, payload);

    if (result.success) {
      toast.success('Book updated successfully!', { id: t });
      router.push('/dashboard');
      router.refresh();
    } else {
      toast.error(result.error, { id: t });
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    control,
    onSubmit,
    coverFile,
    coverPreviewUrl,
    isCoverRemoved,
    existingCoverUrl,
    isChanged,
    handleRemoveCover,
    handleUndoRemoveCover,
    handleCoverFileChange,
    setValue,
  };
};
