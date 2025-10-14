import type { Metadata } from 'next'
import './globals.css'
import SessionProvider from '@/components/auth/SessionProvider'

export const metadata: Metadata = {
  title: 'Maffix - Independent Musician Fan Engagement Platform',
  description: 'Engage with your favorite independent musicians through gamified experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}

