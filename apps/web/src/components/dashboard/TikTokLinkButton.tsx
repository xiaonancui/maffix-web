'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function TikTokLinkButton() {
  const router = useRouter()
  const [isLinking, setIsLinking] = useState(false)

  const handleLink = async () => {
    setIsLinking(true)

    try {
      // Use NextAuth's signIn to initiate TikTok OAuth flow
      // This will redirect to TikTok and back to the callback URL
      await signIn('tiktok', {
        callbackUrl: '/profile/link-tiktok?success=true',
      })
    } catch (error) {
      console.error('TikTok link error:', error)
      alert('Failed to link TikTok account. Please try again.')
      setIsLinking(false)
    }
  }

  return (
    <button
      onClick={handleLink}
      disabled={isLinking}
      className={`rounded-md px-6 py-3 text-base font-semibold text-foreground transition-colors ${
        isLinking
          ? 'cursor-not-allowed bg-gray-400'
          : 'bg-background hover:bg-secondary'
      }`}
    >
      {isLinking ? (
        <span className="flex items-center gap-2">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Connecting...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          </svg>
          Link TikTok Account
        </span>
      )}
    </button>
  )
}
