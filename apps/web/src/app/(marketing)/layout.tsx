import type { Metadata } from 'next'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Maffix - Independent Musician Fan Engagement Platform',
    template: '%s | Maffix',
  },
  description:
    'Connect with your favorite independent musicians through gamified missions, exclusive prizes, and community engagement. Earn diamonds, draw prizes, and support artists on TikTok.',
  keywords: [
    'independent musicians',
    'fan engagement',
    'TikTok missions',
    'gacha system',
    'music community',
    'artist support',
    'virtual currency',
    'prize draws',
  ],
  authors: [{ name: 'Maffix' }],
  creator: 'Maffix',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://maffix.com',
    siteName: 'Maffix',
    title: 'Maffix - Independent Musician Fan Engagement Platform',
    description:
      'Connect with your favorite independent musicians through gamified missions, exclusive prizes, and community engagement.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Maffix Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maffix - Independent Musician Fan Engagement Platform',
    description:
      'Connect with your favorite independent musicians through gamified missions, exclusive prizes, and community engagement.',
    images: ['/og-image.svg'],
    creator: '@maffix',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo.svg',
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
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

