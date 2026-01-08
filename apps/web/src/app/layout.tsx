import type { Metadata } from 'next'
import './globals.css'
import SessionProvider from '@/components/auth/SessionProvider'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/line-awesome@1.3.0/dist/line-awesome/css/line-awesome.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-[#0a0a0f] text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

