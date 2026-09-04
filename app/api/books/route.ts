import { addBook } from '@/src/entities/book/index.server';
import { addBookSchema } from '@/src/entities/book';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const book = {
    title: formData.get('title'),
    author: formData.get('author') || null,
    language: formData.get('language'),
    price: formData.get('price') ? Number(formData.get('price')) : null,
    quantity: Number(formData.get('quantity')),
    isbn: formData.get('isbn') || null,
    category: formData.get('category') || null,
    cover_file: formData.get('cover_file') instanceof File ? formData.get('cover_file') : undefined,
  };

  const res = addBookSchema.safeParse(book);

  if (!res.success) {
    return NextResponse.json({ error: res.error.issues[0].message }, { status: 400 });
  }

  const { data, error } = await addBook(res.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag('books', 'max');

  return NextResponse.json({ book: data }, { status: 201 });
}
