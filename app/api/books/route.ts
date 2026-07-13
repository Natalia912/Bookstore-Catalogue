import { addBook, getBooks } from '@/src/entities/book/index.server';
import { type CreateBookInput, bookSchema } from '@/src/entities/book';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  const language = searchParams.get('language');

  const { data, error } = await getBooks({ search, language });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ books: data });
}

export async function POST(request: NextRequest) {
  const body: CreateBookInput = await request.json();

  const res = bookSchema.safeParse(body);

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
