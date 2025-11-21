'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/primitives/use-toast';

const SignInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof SignInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: 'Unable to sign in',
          description: 'The email or password provided is incorrect',
          variant: 'destructive',
        });
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-screen max-w-lg px-4">
      <div className="border-border bg-card z-10 rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">Sign in to your account</h1>

        <p className="text-muted-foreground mt-2 text-sm">
          Welcome back, we are lucky to have you.
        </p>

        <hr className="border-border -mx-6 my-4" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-y-4">
            <fieldset className="flex w-full flex-col gap-y-4" disabled={isSubmitting}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="mt-2 text-right">
                      <Link
                        href="/forgot-password"
                        className="text-muted-foreground text-sm duration-200 hover:opacity-70"
                      >
                        Forgot your password?
                      </Link>
                    </p>
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </fieldset>
          </form>
        </Form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-doku-seal-700 duration-200 hover:opacity-70">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
