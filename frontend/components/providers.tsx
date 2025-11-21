'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { I18nProvider } from '@lingui/react';
import { i18n, dynamicActivate } from '@/lib/i18n';

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    // Initialize i18n with default locale (English)
    dynamicActivate('en').then(() => {
      setI18nReady(true);
    });
  }, []);

  // Don't render children until i18n is ready
  if (!i18nReady) {
    return null;
  }

  return (
    <SessionProvider session={session}>
      <I18nProvider i18n={i18n}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ThemeProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
