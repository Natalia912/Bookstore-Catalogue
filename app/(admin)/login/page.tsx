'use client';
import { Suspense } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const error = useSearchParams().get('error');
  const errorMessage =
    error === 'CredentialsSignin'
      ? 'Invalid email or password'
      : error === 'unauthorized'
        ? 'You are not authorized to access the admin dashboard.'
        : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');

    if (!supabaseUrl || !supabasePublishableKey) {
      window.location.assign('/login?error=configuration');
      return;
    }

    const supabase = createBrowserClient(supabaseUrl, supabasePublishableKey);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    window.location.assign(signInError ? '/login?error=CredentialsSignin' : '/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign in</button>

      <p style={{ color: 'red' }}>{errorMessage}</p>
    </form>
  );
}
