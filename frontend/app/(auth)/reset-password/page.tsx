'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RequestPasswordResetSchema,
  type RequestPasswordResetDto,
} from '@doku-seal/validators';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Must contain uppercase, lowercase, and number'
    ),
});

type NewPasswordDto = z.infer<typeof NewPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestForm = useForm<RequestPasswordResetDto>({
    resolver: zodResolver(RequestPasswordResetSchema),
  });

  const resetForm = useForm<NewPasswordDto>({
    resolver: zodResolver(NewPasswordSchema),
  });

  const onRequestReset = async (data: RequestPasswordResetDto) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/request-password-reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Failed to send reset email');
        setIsLoading(false);
        return;
      }

      setSuccess('If the email exists, a reset link will be sent to your inbox');
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: NewPasswordDto) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            password: data.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Failed to reset password');
        setIsLoading(false);
        return;
      }

      setSuccess('Password successfully reset! Redirecting to sign in...');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="border-border dark:bg-background z-10 w-full rounded-xl border bg-neutral-100 p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold">
          {token ? 'Reset your password' : 'Forgot your password?'}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {token
            ? 'Enter your new password below'
            : 'No worries, we will send you reset instructions'}
        </p>
      </div>

      <hr className="border-border -mx-6 my-4" />

      {!token ? (
        <form onSubmit={requestForm.handleSubmit(onRequestReset)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...requestForm.register('email')}
              disabled={isLoading}
              className="bg-background"
            />
            {requestForm.formState.errors.email && (
              <p className="text-sm text-red-500">
                {requestForm.formState.errors.email.message}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-md p-3">
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      ) : (
        <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground text-sm font-medium">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...resetForm.register('password')}
              disabled={isLoading}
              className="bg-background"
            />
            {resetForm.formState.errors.password && (
              <p className="text-sm text-red-500">
                {resetForm.formState.errors.password.message}
              </p>
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

          {success && (
            <div className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-md p-3">
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      )}

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Remember your password?{' '}
        <Link href="/signin" className="text-doku-seal-700 dark:text-doku-seal-500 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
