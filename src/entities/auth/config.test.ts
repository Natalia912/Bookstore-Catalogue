import { describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));

describe('admin access contract', () => {
  it('grants access only when the authenticated user has the persisted admin flag', async () => {
    const { isSupabaseUserAdmin } = await import('./config');
    const maybeSingle = vi.fn().mockResolvedValue({ data: { is_admin: true }, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const supabase = { from: vi.fn().mockReturnValue({ select }) };

    await expect(isSupabaseUserAdmin(supabase as never, 'admin-user-id')).resolves.toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('admin_profiles');
    expect(eq).toHaveBeenCalledWith('id', 'admin-user-id');
  });

  it('fails closed when the profile is missing or not marked as admin', async () => {
    const { isSupabaseUserAdmin } = await import('./config');
    const maybeSingle = vi.fn().mockResolvedValue({ data: { is_admin: false }, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const supabase = { from: vi.fn().mockReturnValue({ select }) };

    await expect(isSupabaseUserAdmin(supabase as never, 'regular-user-id')).resolves.toBe(false);
  });
});
