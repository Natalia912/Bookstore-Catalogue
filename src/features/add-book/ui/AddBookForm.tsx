'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { bookSchema, type CreateBookInput, LANGUAGES } from '@/src/entities/book/model';

export function AddBookForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateBookInput>({
    resolver: zodResolver(bookSchema) as Resolver<CreateBookInput>,
    defaultValues: {
      language: LANGUAGES.ru,
      quantity: 1,
    },
  });

  async function onSubmit(data: CreateBookInput) {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setError('root', { message: error });
      return;
    }

    router.push('/');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="mb-6 text-2xl font-semibold">Add a book</h1>

      <div>
        <label className="mb-1 block text-sm font-medium">Title *</label>
        <input
          {...register('title')}
          className="w-full rounded-lg border px-4 py-3 text-lg"
          placeholder="Book title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Author</label>
        <input
          {...register('author')}
          className="w-full rounded-lg border px-4 py-3 text-lg"
          placeholder="Author name"
        />
        {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Language</label>
        <select {...register('language')} className="w-full rounded-lg border px-4 py-3 text-lg">
          <option value={LANGUAGES.ru}>Russian</option>
          <option value={LANGUAGES.kk}>Kazakh</option>
          <option value={LANGUAGES.en}>English</option>
          <option value={LANGUAGES.other}>Other</option>
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Price (₸)</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="w-full rounded-lg border px-4 py-3 text-lg"
            placeholder="0"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Quantity</label>
          <input
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            className="w-full rounded-lg border px-4 py-3 text-lg"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-black py-3 text-lg font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save book'}
      </button>
    </form>
  );
}
