import { createSupabaseBrowserClient } from '@/src/shared/configs/supabase';
import { useState } from 'react';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isCredentialsError = error?.includes('Invalid');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Client-side validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setError('Initialization error.');
        setIsLoading(false);
        return;
      }
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password.');
        } else {
          setError('Something went wrong. Please try again.');
        }
        setPassword('');
        return;
      }

      if (data.user) {
        // window.location here used deliberately to force a full page reload and ensure the session is properly set in the browser.
        window.location.assign('/dashboard');
      }
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    isCredentialsError,
    handleSubmit,
  };
}
