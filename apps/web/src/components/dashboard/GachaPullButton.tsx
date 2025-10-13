'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GachaResultModal from './GachaResultModal'

type Prize = {
  id: string
  name: string
  description: string
  rarity: string
  type: string
  imageUrl: string | null
  value: number
}

type GachaResult = {
  prize: Prize
  userPrize: {
    id: string
    wonAt: Date
  }
  cost: number
  newBalance: number
  totalPulls: number
}

export default function GachaPullButton({
  currentBalance,
  cost,
}: {
  currentBalance: number
  cost: number
}) {
  const router = useRouter()
  const [isPulling, setIsPulling] = useState(false)
  const [result, setResult] = useState<GachaResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handlePull = async () => {
    if (currentBalance < cost) {
      alert('Not enough diamonds!')
      return
    }

    setIsPulling(true)

    try {
      const response = await fetch('/api/gacha/pull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to pull gacha')
        return
      }

      // Show result modal
      setResult(data)
      setShowResult(true)
    } catch (error) {
      console.error('Gacha pull error:', error)
      alert('An error occurred while pulling gacha')
    } finally {
      setIsPulling(false)
    }
  }

  const handleCloseModal = () => {
    setShowResult(false)
    setResult(null)
    router.refresh() // Refresh to update balance and prizes
  }

  return (
    <>
      <button
        onClick={handlePull}
        disabled={isPulling || currentBalance < cost}
        className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
      >
        {isPulling ? (
          <>
            <span className="animate-spin">🎰</span> Pulling...
          </>
        ) : (
          <>🎰 Pull Gacha ({cost} 💎)</>
        )}
      </button>

      {showResult && result && (
        <GachaResultModal result={result} onClose={handleCloseModal} />
      )}
    </>
  )
}

