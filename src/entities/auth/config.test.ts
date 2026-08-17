import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const signInWithPasswordMock = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: signInWithPasswordMock,
    },
  })),
}));

describe('admin auth', () => {
  const originalAdminEmail = process.env.SUPABASE_ADMIN_EMAIL;
  const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeEach(() => {
    process.env.SUPABASE_ADMIN_EMAIL = 'admin@example.com';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    signInWithPasswordMock.mockReset();
  });

  it('accepts the configured admin user from Supabase Auth', async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'admin@example.com' } },
      error: null,
    });

    const { authorizeAdminCredentials } = await import('./config');
    const result = await authorizeAdminCredentials('admin@example.com', 'correct-password');

    expect(result).toEqual({ id: 'user-1', email: 'admin@example.com', role: 'admin' });
  });

  it('rejects non-admin users even when they authenticate successfully', async () => {
    signInWithPasswordMock.mockResolvedValue({
      data: { user: { id: 'user-2', email: 'guest@example.com' } },
      error: null,
    });

    const { authorizeAdminCredentials } = await import('./config');
    const result = await authorizeAdminCredentials('guest@example.com', 'password');

    expect(result).toBeNull();
  });

  it('fails closed when the session is missing the admin role or email', async () => {
    const { hasAdminAccess } = await import('./config');

    expect(hasAdminAccess(null)).toBe(false);
    expect(hasAdminAccess({ email: 'guest@example.com', role: 'admin' })).toBe(false);
    expect(hasAdminAccess({ email: 'admin@example.com', role: 'user' })).toBe(false);
    expect(hasAdminAccess({ email: 'admin@example.com', role: 'admin' })).toBe(true);
  });

  afterAll(() => {
    if (originalAdminEmail === undefined) {
      delete process.env.SUPABASE_ADMIN_EMAIL;
    } else {
      process.env.SUPABASE_ADMIN_EMAIL = originalAdminEmail;
    }

    if (originalSupabaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
    }

    if (originalSupabaseAnonKey === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalSupabaseAnonKey;
    }
  });
});
