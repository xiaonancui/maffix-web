'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PrizeRedeemButton({ prizeId }: { prizeId: string }) {
  const router = useRouter()
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleRedeem = async () => {
    setIsRedeeming(true)

    try {
      const response = await fetch(`/api/prizes/${prizeId}/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to redeem prize')
        return
      }

      alert('Prize redeemed successfully! Check your email for details.')
      router.refresh()
    } catch (error) {
      console.error('Prize redemption error:', error)
      alert('An error occurred while redeeming the prize')
    } finally {
      setIsRedeeming(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Redeem this prize? You will receive instructions via email.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleRedeem}
            disabled={isRedeeming}
            className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
          >
            {isRedeeming ? 'Redeeming...' : 'Yes, Redeem'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isRedeeming}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
    >
      Redeem Prize
    </button>
  )
}

