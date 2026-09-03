import { createAuthServerClient } from '@/src/shared/configs/index.server';
import { CreateBookInput } from '../model';

export const updateBook = async (id: string, input: Partial<CreateBookInput>) => {
  const supabase = await createAuthServerClient();

  // TODO: update the handling of cover_file to support updating the cover image and deleting it if empty.
  //

  const { data: existingBook, error: fetchError } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    return { data: null, error: fetchError };
  }

  let coverUrl: string | null = null;
  if (input.cover_file) {
    const filePath = `covers/${crypto.randomUUID()}-${input.cover_file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(filePath, input.cover_file);

    if (uploadError) {
      return { data: null, error: uploadError };
    }

    coverUrl = filePath;
  }

  return supabase
    .from('books')
    .update({
      ...input,
      cover_url: coverUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
};
