import type { Metadata } from 'next';
import { ClientLayout } from '@/components/client-layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Doku-Seal - Open Source Document Signing',
    template: '%s | Doku-Seal',
  },
  description: 'The open source DocuSign alternative',
  keywords: ['document signing', 'e-signature', 'open source'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
