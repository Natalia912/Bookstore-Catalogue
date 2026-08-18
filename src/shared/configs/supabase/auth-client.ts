import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import { getPublicSupabaseConfig } from './public';

type CookieStore = {
  getAll: () => { name: string; value: string }[];
  set: (name: string, value: string, options: CookieOptions) => void;
};

export function createAuthServerClient(cookieStore: CookieStore) {
  const configuration = getPublicSupabaseConfig();

  if (!configuration) {
    return null;
  }

  return createServerClient(configuration.url, configuration.publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; middleware refreshes sessions instead.
        }
      },
    },
  });
}

export function createAuthMiddlewareClient(request: NextRequest, response: NextResponse) {
  const configuration = getPublicSupabaseConfig();

  if (!configuration) {
    return null;
  }

  return createServerClient(configuration.url, configuration.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
}
