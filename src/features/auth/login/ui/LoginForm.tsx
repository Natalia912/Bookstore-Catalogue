'use client';

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/src/shared/components';
import { useLogin } from '../model/use-login';

export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    isCredentialsError,
    handleSubmit,
  } = useLogin();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate id="login-form">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={isCredentialsError || undefined}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                aria-invalid={isCredentialsError || undefined}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isLoading} form="login-form">
          {isLoading ? 'Signing in...' : 'Login'}
        </Button>
        {error && (
          <div
            role="alert"
            className="bg-destructive/10 border-destructive/30 text-destructive rounded border p-3 text-sm"
          >
            {error}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
