import { createAuthServerClient } from '@/src/shared/configs/index.server';
import { CreateBookInput } from '../model';

export const updateBook = async (id: string, input: Partial<CreateBookInput> & { cover_file?: File; remove_cover?: boolean }) => {
  const supabase = await createAuthServerClient();

  const { data: existingBook, error: fetchError } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    return { data: null, error: fetchError };
  }

  // Determine cover_url based on the input flags
  let coverUrl: string | null | undefined = undefined; // undefined = no change
  if (input.remove_cover) {
    // Delete the old cover from storage if it exists
    if (existingBook.cover_url?.startsWith('covers/')) {
      await supabase.storage.from('covers').remove([existingBook.cover_url]);
    }
    coverUrl = null;
  } else if (input.cover_file) {
    // Upload the new cover file
    const filePath = `covers/${crypto.randomUUID()}-${input.cover_file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(filePath, input.cover_file);

    if (uploadError) {
      return { data: null, error: uploadError };
    }

    // Delete old cover if it existed
    if (existingBook.cover_url?.startsWith('covers/')) {
      await supabase.storage.from('covers').remove([existingBook.cover_url]);
    }

    coverUrl = filePath;
  }

  // Strip non-DB fields before spreading into the update
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cover_file: _cf, remove_cover: _rc, ...dbFields } = input;

  const updatePayload: Record<string, unknown> = {
    ...dbFields,
    updated_at: new Date().toISOString(),
  };

  // Only set cover_url if we determined a change
  if (coverUrl !== undefined) {
    updatePayload.cover_url = coverUrl;
  }

  return supabase
    .from('books')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();
};
