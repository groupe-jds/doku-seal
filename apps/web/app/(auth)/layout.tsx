import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 md:p-12 lg:p-24">
      {/* Background pattern with radial gradient mask */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div
          className="absolute inset-[-200%] opacity-70"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(162, 231, 113, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(162, 231, 113, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(162, 231, 113, 0.08) 0%, transparent 50%)
            `,
            mask: 'radial-gradient(rgba(0, 0, 0, 1) 0%, transparent 80%)',
            WebkitMask: 'radial-gradient(rgba(0, 0, 0, 1) 0%, transparent 80%)',
          }}
        />
      </div>

      <div className="w-full max-w-lg">
        {children}
      </div>
    </main>
  );
}
