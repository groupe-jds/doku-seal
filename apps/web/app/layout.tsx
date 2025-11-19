import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Doku-Seal - Open Source Document Signing',
    template: '%s | Doku-Seal',
  },
  description: 'The open source DocuSign alternative',
  keywords: ['document signing', 'e-signature', 'open source'],
  authors: [{ name: 'Doku-Seal Team' }],
  creator: 'Doku-Seal',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://doku-seal.com',
    title: 'Doku-Seal',
    description: 'The open source DocuSign alternative',
    siteName: 'Doku-Seal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doku-Seal',
    description: 'The open source DocuSign alternative',
    creator: '@dokuseal',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
