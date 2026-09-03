'use client';

import { Controller, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { bookSchema, type CreateBookInput, languageOptions } from '@/src/entities/book';
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldRequiredSign,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/src/shared/components';
import { addBook } from '../api';
import { toast } from 'sonner';

export function AddBookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<CreateBookInput>({
    resolver: zodResolver(bookSchema) as Resolver<CreateBookInput>,
    defaultValues: {
      language: languageOptions[0].value,
      quantity: 1,
      cover_url: null,
    },
  });

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-6 p-6">
      <FieldLegend>Add a book</FieldLegend>
      <FieldDescription>
        Fill in the details of the book you want to add to the catalogue.
      </FieldDescription>

      <Field>
        <FieldLabel htmlFor="title">
          Title
          <FieldRequiredSign />
        </FieldLabel>
        <Input {...register('title')} id="title" placeholder="Book title" required />
        <FieldError>{errors.title?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="author">Author</FieldLabel>
        <Input {...register('author')} id="author" placeholder="Author name" />
        <FieldError>{errors.author?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="isbn">ISBN</FieldLabel>
        <Input {...register('isbn')} id="isbn" placeholder="978-0-123456-78-9" />
        <FieldError>{errors.isbn?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="category">Category</FieldLabel>
        <Input {...register('category')} id="category" placeholder="Fiction" />
        <FieldError>{errors.category?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="cover_url">Cover URL</FieldLabel>
        <Input
          {...register('cover_url')}
          id="cover_url"
          placeholder="https://example.com/cover.jpg"
        />
        <FieldError>{errors.cover_url?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="language">Language</FieldLabel>
        <Controller
          name="language"
          control={control}
          render={({ field }) => {
            const selectedLanguageLabel =
              languageOptions.find((option) => option.value === field.value)?.label ??
              'Select a language';

            return (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as CreateBookInput['language'])}
              >
                <SelectTrigger id="language" className="w-full">
                  <span>{selectedLanguageLabel}</span>
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        <FieldError>{errors.language?.message}</FieldError>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="price">Price (₸)</FieldLabel>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="0"
            {...register('price', { valueAsNumber: true })}
          />
          <FieldError>{errors.price?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
          <Input
            id="quantity"
            type="number"
            min="1"
            {...register('quantity', { valueAsNumber: true })}
          />
          <FieldError>{errors.quantity?.message}</FieldError>
        </Field>
      </div>

      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save book'}
      </Button>
    </form>
  );
}
