import { createClient } from '@/src/shared/configs/index.server';
import { CreateBookInput } from '../model';

export const updateBook = async (id: string, input: Partial<CreateBookInput>) => {
  const supabase = await createClient();

  return supabase
    .from('books')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
};
