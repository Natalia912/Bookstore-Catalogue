'use client';

import { Controller } from 'react-hook-form';

import { type CreateBookInput, languageOptions } from '@/src/entities/book';
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
import { useAddBook } from '../model/use-add-book';
import Image from 'next/image';

export function AddBookForm() {
  const { register, handleSubmit, errors, isSubmitting, control, onSubmit, coverFile, setValue } =
    useAddBook();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full space-y-6">
      <FieldLegend>Enter book details</FieldLegend>
      <FieldDescription>
        Fill in the details of the book you want to add to the catalogue.
      </FieldDescription>

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <Field>
        <FieldLabel htmlFor="cover_file">Cover Cover Image</FieldLabel>
        {/* Add cover image preview */}
        {coverFile && (
          <>
            <div className="h-60">
              <Image
                src={coverFile ? URL.createObjectURL(new Blob([coverFile])) : ''}
                alt="Cover Preview"
                width={128}
                height={160}
                className="aspect-2/3 h-full w-auto object-cover"
              />
            </div>
            <Button
              variant="destructive"
              type="button"
              size="sm"
              className="mb-2 max-w-40"
              onClick={() => setValue('cover_file', undefined)}
            >
              Remove image
            </Button>
          </>
        )}

        <Controller
          control={control}
          name="cover_file"
          render={({ field: { onChange, onBlur, name } }) => (
            <Input
              id="cover_file"
              type="file"
              accept="image/*"
              name={name}
              onBlur={onBlur}
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file);
              }}
            />
          )}
        />

        <FieldError>{errors.cover_file?.message}</FieldError>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="isbn">ISBN</FieldLabel>
          <Input {...register('isbn')} id="isbn" placeholder="978-0-123456-78-9" />
          <FieldError>{errors.isbn?.message}</FieldError>
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
      </div>

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
