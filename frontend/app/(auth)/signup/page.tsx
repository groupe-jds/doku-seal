'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema, type SignUpDto } from '@doku-seal/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDto>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpDto) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call signup endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but failed to sign in. Please sign in manually.');
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
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign up to start signing documents with Doku-Seal.
        </p>
      </div>

      <hr className="border-border -mx-6 my-4" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-muted-foreground text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            {...register('name')}
            disabled={isLoading}
            className="bg-background"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

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
          <Label htmlFor="password" className="text-muted-foreground text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            {...register('password')}
            disabled={isLoading}
            className="bg-background"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          <p className="text-muted-foreground text-xs">
            Must be at least 8 characters with uppercase, lowercase, and a number
          </p>
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
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link href="/signin" className="text-doku-seal-700 dark:text-doku-seal-500 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
