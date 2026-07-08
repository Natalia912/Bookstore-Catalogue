import { deleteBook, getBook, updateBook } from '@/src/entities/book/api';
import { type CreateBookInput, updateBookSchema } from '@/src/entities/book/model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await getBook(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ book: data });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const body: Partial<CreateBookInput> = await request.json();
  const res = updateBookSchema.safeParse(body);

  if (!res.success) {
    return NextResponse.json({ error: res.error.issues[0].message }, { status: 400 });
  }

  const { data, error } = await updateBook(id, res.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ book: data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await deleteBook(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
