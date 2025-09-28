import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ClientSessionProvider } from '@/components/session-provider';
import { Providers } from '@/components/providers';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'TenTenTen - Gacha Task Platform',
    template: '%s | TenTenTen',
  },
  description:
    'Complete tasks, earn diamonds, and win prizes in our gamified task platform.',
  keywords: [
    'tasks',
    'gacha',
    'rewards',
    'gamification',
    'productivity',
    'diamonds',
  ],
  authors: [
    {
      name: 'TenTenTen Team',
    },
  ],
  creator: 'TenTenTen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXTAUTH_URL,
    title: 'TenTenTen - Gacha Task Platform',
    description:
      'Complete tasks, earn diamonds, and win prizes in our gamified task platform.',
    siteName: 'TenTenTen',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TenTenTen - Gacha Task Platform',
    description:
      'Complete tasks, earn diamonds, and win prizes in our gamified task platform.',
    creator: '@tententen',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={inter.variable}>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <ClientSessionProvider>
          <Providers>{children}</Providers>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
