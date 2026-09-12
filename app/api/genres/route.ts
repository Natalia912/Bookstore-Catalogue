import { addGenre, getGenres } from '@/src/entities/genres/index.server';
import { createGenreSchema } from '@/src/entities/genres';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET() {
  const { data, error } = await getGenres();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ genres: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createGenreSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const { data, error } = await addGenre(result.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag('genres', 'max');
  return NextResponse.json({ genre: data }, { status: 201 });
}
