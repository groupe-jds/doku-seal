import Link from 'next/link';
import { Button } from '@doku-seal/ui/primitives/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        <h1 className="text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
          Welcome to{' '}
          <span className="text-doku-seal-600">Doku-Seal</span>
        </h1>

        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          The open source DocuSign alternative - Sign documents digitally with confidence
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>

        <div className="mt-16 text-sm text-muted-foreground">
          <p>🚀 Next.js 15 + NestJS Migration - Phase 1 Active</p>
        </div>
      </div>
    </main>
  );
}
