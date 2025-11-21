'use client';

import { Providers } from '@/components/providers';
import { Toaster } from '@doku-seal/ui/primitives/toaster';
import { TooltipProvider } from '@doku-seal/ui/primitives/tooltip';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </Providers>
  );
}
