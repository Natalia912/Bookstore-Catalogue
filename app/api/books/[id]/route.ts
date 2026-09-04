import { deleteBook, getBook, updateBook } from '@/src/entities/book/index.server';
import { updateBookSchema } from '@/src/entities/book';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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

  const contentType = request.headers.get('content-type') ?? '';
  let body: Record<string, unknown>;

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    body = {
      title: formData.get('title') || undefined,
      author: formData.get('author') || undefined,
      language: formData.get('language') || undefined,
      price: formData.has('price') && formData.get('price') !== '' ? Number(formData.get('price')) : undefined,
      quantity: formData.has('quantity') && formData.get('quantity') !== '' ? Number(formData.get('quantity')) : undefined,
      isbn: formData.get('isbn') || undefined,
      category: formData.get('category') || undefined,
      cover_file: formData.get('cover_file') instanceof File && (formData.get('cover_file') as File).size > 0 ? formData.get('cover_file') : undefined,
      remove_cover: formData.get('remove_cover') === 'true' ? true : undefined,
    };
  } else {
    body = await request.json();
  }

  const res = updateBookSchema.safeParse(body);

  if (!res.success) {
    return NextResponse.json({ error: res.error.issues[0].message }, { status: 400 });
  }

  const { data, error } = await updateBook(id, res.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/dashboard');

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

  revalidatePath('/dashboard');

  return NextResponse.json({ success: true });
}
