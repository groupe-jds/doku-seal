'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RequestPasswordResetSchema,
  ResetPasswordSchema,
  type RequestPasswordResetDto,
  type ResetPasswordDto,
} from '@doku-seal/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form for requesting reset (no token)
  const requestForm = useForm<RequestPasswordResetDto>({
    resolver: zodResolver(RequestPasswordResetSchema),
  });

  // Form for resetting password (with token)
  const resetForm = useForm<Omit<ResetPasswordDto, 'token'>>({
    resolver: zodResolver(ResetPasswordSchema.omit({ token: true })),
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

  const onResetPassword = async (data: Omit<ResetPasswordDto, 'token'>) => {
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
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {token ? 'Reset Password' : 'Forgot Password'}
        </CardTitle>
        <CardDescription>
          {token
            ? 'Enter your new password below'
            : 'Enter your email to receive a password reset link'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!token ? (
          <form onSubmit={requestForm.handleSubmit(onRequestReset)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...requestForm.register('email')}
                disabled={isLoading}
              />
              {requestForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {requestForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...resetForm.register('password')}
                disabled={isLoading}
              />
              {resetForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {resetForm.formState.errors.password.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Must contain at least 8 characters, including uppercase, lowercase, and a number
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-600 text-center w-full">
          Remember your password?{' '}
          <Link href="/signin" className="text-doku-seal hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
