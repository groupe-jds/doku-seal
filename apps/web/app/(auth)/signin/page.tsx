'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInSchema, type SignInDto } from '@doku-seal/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInDto>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="border-border dark:bg-background z-10 w-full rounded-xl border bg-neutral-100 p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold">Sign in to your account</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Welcome back, we are lucky to have you.
        </p>
      </div>

      <hr className="border-border -mx-6 my-4" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
            disabled={isLoading}
            className="bg-background"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-muted-foreground text-sm font-medium">
              Password
            </Label>
            <Link
              href="/reset-password"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register('password')}
            disabled={isLoading}
            className="bg-background"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Don't have an account?{' '}
        <Link href="/signup" className="text-doku-seal-700 dark:text-doku-seal-500 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
