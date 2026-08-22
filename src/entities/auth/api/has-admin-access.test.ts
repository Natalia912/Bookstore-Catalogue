import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAuthServerClient } from '@/src/shared/configs/supabase/auth-client';
import { hasAdminAccess } from './has-admin-access';
import { isSupabaseUserAdmin } from './is-supabase-user-admin';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/src/shared/configs/supabase/auth-client', () => ({
  createAuthServerClient: vi.fn(),
}));

vi.mock('./is-supabase-user-admin', () => ({
  isSupabaseUserAdmin: vi.fn(),
}));

describe('hasAdminAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows access when the signed-in user is the designated admin', async () => {
    const cookieStore = { getAll: vi.fn().mockReturnValue([]), set: vi.fn() };
    const getUser = vi.fn().mockResolvedValue({
      data: { user: { id: 'admin-user-id' } },
      error: null,
    });

    vi.mocked(cookies).mockResolvedValue(cookieStore as never);
    vi.mocked(createAuthServerClient).mockReturnValue({ auth: { getUser } } as never);
    vi.mocked(isSupabaseUserAdmin).mockResolvedValue(true);

    await expect(hasAdminAccess()).resolves.toBe(true);
    expect(isSupabaseUserAdmin).toHaveBeenCalledWith({ auth: { getUser } }, 'admin-user-id');
  });

  it('blocks unauthenticated users before they reach the dashboard', async () => {
    const cookieStore = { getAll: vi.fn().mockReturnValue([]), set: vi.fn() };
    const getUser = vi.fn().mockResolvedValue({
      data: { user: null },
      error: new Error('No session'),
    });

    vi.mocked(cookies).mockResolvedValue(cookieStore as never);
    vi.mocked(createAuthServerClient).mockReturnValue({ auth: { getUser } } as never);

    await expect(hasAdminAccess()).resolves.toBe(false);
    expect(isSupabaseUserAdmin).not.toHaveBeenCalled();
  });

  it('blocks authenticated non-admin users even when they are signed in', async () => {
    const cookieStore = { getAll: vi.fn().mockReturnValue([]), set: vi.fn() };
    const getUser = vi.fn().mockResolvedValue({
      data: { user: { id: 'regular-user-id' } },
      error: null,
    });

    vi.mocked(cookies).mockResolvedValue(cookieStore as never);
    vi.mocked(createAuthServerClient).mockReturnValue({ auth: { getUser } } as never);
    vi.mocked(isSupabaseUserAdmin).mockResolvedValue(false);

    await expect(hasAdminAccess()).resolves.toBe(false);
    expect(isSupabaseUserAdmin).toHaveBeenCalledWith({ auth: { getUser } }, 'regular-user-id');
  });
});
