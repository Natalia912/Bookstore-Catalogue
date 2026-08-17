'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorMessage =
    error === 'CredentialsSignin'
      ? 'Invalid email or password'
      : error === 'unauthorized'
        ? 'You are not authorized to access the admin dashboard.'
        : null;

  const handleSubmit = async (formData: FormData) => {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      callbackUrl: '/dashboard',
    });
  };

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign in</button>

      <p style={{ color: 'red' }}>{errorMessage}</p>
    </form>
  );
}
