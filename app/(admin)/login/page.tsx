'use client';
import { Suspense, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/src/shared/components';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getLoginErrorMessage(error: string | null): string | null {
  if (error === 'CredentialsSignin' || error === 'invalid_credentials') {
    return 'Invalid email or password';
  }

  if (error === 'unauthorized') {
    return 'Please sign in to access the admin dashboard.';
  }

  if (error === 'configuration') {
    return 'Admin sign-in is not configured correctly.';
  }

  return null;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const error = useSearchParams().get('error');
  const errorMessage = getLoginErrorMessage(error);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (errorMessage) {
      errorRef.current?.focus();
    }
  }, [errorMessage]);

  const isCredentialsError = error === 'CredentialsSignin' || error === 'invalid_credentials';

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

    window.location.assign(signInError ? '/login?error=invalid_credentials' : '/dashboard');
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-neutral-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Login to admin panel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="login-form" noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  aria-invalid={isCredentialsError || undefined}
                  aria-describedby={errorMessage ? 'login-error' : undefined}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  aria-invalid={isCredentialsError || undefined}
                  aria-describedby={errorMessage ? 'login-error' : undefined}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" form="login-form">
            Login
          </Button>
          {errorMessage && (
            <p
              id="login-error"
              ref={errorRef}
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
              className="text-destructive self-start text-sm focus:outline-none"
            >
              {errorMessage}
            </p>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
