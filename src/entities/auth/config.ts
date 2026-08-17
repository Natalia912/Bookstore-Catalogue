import { createClient } from '@supabase/supabase-js';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export type AdminAccessUser = {
  id?: string | null;
  email?: string | null;
  role?: string | null;
};

export type AdminSessionUser = AdminAccessUser & {
  id: string;
  email: string;
  role: 'admin';
};

export function getConfiguredAdminEmail(): string {
  return (process.env.SUPABASE_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) {
    return false;
  }

  const configuredAdminEmail = getConfiguredAdminEmail();
  return Boolean(configuredAdminEmail) && email.trim().toLowerCase() === configuredAdminEmail;
}

export function hasAdminAccess(user?: AdminAccessUser | null): boolean {
  if (!user || !user.email) {
    return false;
  }

  return isAdminEmail(user.email) && user.role === 'admin';
}

export async function authorizeAdminCredentials(
  email: string,
  password: string,
): Promise<AdminSessionUser | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user || !data.user.email) {
    return null;
  }

  if (!isAdminEmail(data.user.email)) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email,
    role: 'admin',
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? '').trim();
        const password = String(credentials?.password ?? '');

        if (!email || !password) {
          return null;
        }

        return authorizeAdminCredentials(email, password);
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      const userEmail = user?.email ?? token.email;

      if (userEmail) {
        token.email = userEmail;
        token.role = isAdminEmail(userEmail) ? 'admin' : 'user';
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email ?? session.user.email;
        session.user.name = session.user.name ?? token.email ?? null;
        (session.user as { role?: string }).role = String(token.role ?? 'user');
      }

      return session;
    },
  },
});
