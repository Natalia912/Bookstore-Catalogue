import { Suspense } from 'react';
import { LoginForm } from '@/src/features/auth/login';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-neutral-100 p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
