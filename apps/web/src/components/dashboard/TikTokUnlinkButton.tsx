'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TikTokUnlinkButton() {
  const router = useRouter()
  const [isUnlinking, setIsUnlinking] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleUnlink = async () => {
    setIsUnlinking(true)

    try {
      const response = await fetch('/api/user/unlink-tiktok', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unlink TikTok account')
      }

      // Refresh the page to show updated status
      router.refresh()
    } catch (error) {
      console.error('TikTok unlink error:', error)
      alert('Failed to unlink TikTok account. Please try again.')
    } finally {
      setIsUnlinking(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleUnlink}
          disabled={isUnlinking}
          className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${
            isUnlinking
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isUnlinking ? 'Unlinking...' : 'Confirm Unlink'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isUnlinking}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
    >
      Unlink Account
    </button>
  )
}
