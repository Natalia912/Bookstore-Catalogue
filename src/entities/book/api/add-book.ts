import { createAuthServerClient } from '@/src/shared/configs/index.server';
import { CreateBookInput } from '../model';

export const addBook = async (input: CreateBookInput) => {
  const supabase = await createAuthServerClient();

  let coverUrl: string | null = null;
  if (input.cover_file) {
    const filePath = `covers/${crypto.randomUUID()}-${input.cover_file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(filePath, input.cover_file);

    if (uploadError) {
      return { data: null, error: new Error(uploadError.message) };
    }
    coverUrl = filePath;
  }

  return supabase
    .from('books')
    .insert({
      title: input.title.trim(),
      author: input.author?.trim() || null,
      language: input.language || 'ru',
      price: input.price ? parseFloat(String(input.price)) : null,
      quantity: input.quantity ? parseInt(String(input.quantity)) : 1,
      isbn: input.isbn || null,
      cover_url: coverUrl,
      category: input.category || null,
    })
    .select()
    .single();
};
