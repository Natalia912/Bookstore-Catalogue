import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { addBookSchema, type CreateBookInput, languageOptions } from '@/src/entities/book';

import { addBook } from '../api';
import { toast } from 'sonner';

export const useAddBook = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
    reset,
    setValue,
  } = useForm<CreateBookInput>({
    resolver: zodResolver(addBookSchema) as Resolver<CreateBookInput>,
    defaultValues: {
      language: languageOptions[0].value,
      quantity: 1,
    },
  });

  const coverFile = watch('cover_file');

  async function onSubmit(data: CreateBookInput) {
    const t = toast.loading('Saving book...');

    const result = await addBook(data);

    if (result.success) {
      reset();
      toast.success('Book added successfully!', { id: t });
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
    setValue,
  };
};
