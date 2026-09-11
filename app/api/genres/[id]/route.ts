import { deleteGenre, getGenre, updateGenre } from '@/src/entities/genres/index.server';
import { updateGenreSchema } from '@/src/entities/genres';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

type GenreRouteContext = { params: Promise<{ id: string }> };

function parseGenreId(id: string) {
  const parsedId = Number(id);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export async function GET(request: NextRequest, { params }: GenreRouteContext) {
  const id = parseGenreId((await params).id);
  if (id === null) {
    return NextResponse.json({ error: 'Invalid genre id' }, { status: 400 });
  }

  const { data, error } = await getGenre(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ genre: data });
}

export async function PATCH(request: NextRequest, { params }: GenreRouteContext) {
  const id = parseGenreId((await params).id);
  if (id === null) {
    return NextResponse.json({ error: 'Invalid genre id' }, { status: 400 });
  }

  const result = updateGenreSchema.safeParse(await request.json());
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const { data, error } = await updateGenre(id, result.data);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag('genres', 'max');
  return NextResponse.json({ genre: data });
}

export async function DELETE(request: NextRequest, { params }: GenreRouteContext) {
  const id = parseGenreId((await params).id);
  if (id === null) {
    return NextResponse.json({ error: 'Invalid genre id' }, { status: 400 });
  }

  const { error } = await deleteGenre(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag('genres', 'max');
  return NextResponse.json({ success: true });
}
