'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useDeleteBook() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const confirmedDeleteBook = async (bookId: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        toast.error(data.error || 'Failed to delete book');
        return false;
      }

      toast.success('Book deleted successfully');
      router.refresh();
      return true;
    } catch {
      toast.error('Network error. Failed to delete book.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { confirmedDeleteBook, isDeleting };
}
