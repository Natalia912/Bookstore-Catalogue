import { createClient } from '@/src/shared/lib/supabase';
import { CreateBookInput } from '../model';

export const addBook = async (input: CreateBookInput) => {
  const supabase = await createClient();

  return supabase
    .from('books')
    .insert({
      title: input.title.trim(),
      author: input.author?.trim() || null,
      language: input.language || 'ru',
      price: input.price ? parseFloat(String(input.price)) : null,
      quantity: input.quantity ? parseInt(String(input.quantity)) : 1,
      isbn: input.isbn || null,
      cover_url: input.cover_url || null,
      category: input.category || null,
    })
    .select()
    .single();
};
