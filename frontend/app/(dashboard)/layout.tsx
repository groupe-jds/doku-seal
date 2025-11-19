import { ReactNode } from 'react';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-border sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Doku-Seal</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">{session.user?.email}</span>
          </div>
        </div>
      </header>
      <main className="py-8">{children}</main>
    </div>
  );
}
