import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    // User is authenticated, redirect to dashboard
    redirect('/dashboard');
  }

  // User is not authenticated, redirect to signin
  redirect('/signin');
}
