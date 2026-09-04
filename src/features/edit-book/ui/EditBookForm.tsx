'use client';

import { Controller } from 'react-hook-form';

import { type Book, type UpdateBookInput, languageOptions } from '@/src/entities/book';
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
import { useEditBook } from '../model/use-edit-book';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface EditBookFormProps {
  book: Book;
  id: string;
}

export function EditBookForm({ book, id }: EditBookFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    control,
    onSubmit,
    coverPreviewUrl,
    isCoverRemoved,
    existingCoverUrl,
    isChanged,
    handleRemoveCover,
    handleUndoRemoveCover,
    handleCoverFileChange,
  } = useEditBook({ book, id });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full space-y-6">
      <FieldLegend>Edit book details</FieldLegend>
      <FieldDescription>
        Update the details of the book. Only changed fields will be saved.
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
        <FieldLabel htmlFor="cover_file">Cover Image</FieldLabel>

        {/* Cover preview area */}
        {coverPreviewUrl && (
          <div className="h-60">
            <Image
              src={coverPreviewUrl}
              alt="Cover Preview"
              width={128}
              height={160}
              className="aspect-2/3 h-full w-auto rounded-md object-cover"
              unoptimized={coverPreviewUrl.startsWith('blob:')}
            />
          </div>
        )}

        {/* Removed state indicator */}
        {isCoverRemoved && !coverPreviewUrl && (
          <div className="flex h-40 w-28 items-center justify-center rounded-md border border-dashed border-neutral-400 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800">
            <ImageOff className="h-8 w-8 text-neutral-400" />
          </div>
        )}

        {/* Cover action buttons */}
        <div className="flex gap-2">
          {(coverPreviewUrl || (existingCoverUrl && !isCoverRemoved)) && (
            <Button
              variant="destructive"
              type="button"
              size="sm"
              className="max-w-40"
              onClick={handleRemoveCover}
            >
              Remove image
            </Button>
          )}
          {isCoverRemoved && existingCoverUrl && (
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="max-w-40"
              onClick={handleUndoRemoveCover}
            >
              Undo remove
            </Button>
          )}
        </div>

        <Controller
          control={control}
          name="cover_file"
          render={({ field: { onBlur, name } }) => (
            <Input
              id="cover_file"
              type="file"
              accept="image/*"
              name={name}
              onBlur={onBlur}
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleCoverFileChange(file);
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
                  onValueChange={(value) => field.onChange(value as UpdateBookInput['language'])}
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

      <Button type="submit" size="lg" className="w-full" disabled={!isChanged || isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
}
