'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GachaResultModal from './GachaResultModal'
import { Loader2, Sparkles } from 'lucide-react'

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

type Gacha10xResult = {
  prizes: Prize[]
  userPrizes: Array<{
    id: string
    wonAt: Date
  }>
  cost: number
  newBalance: number
  totalPulls: number
  guaranteedSSR: boolean
}

export default function GachaPullButton({
  currentBalance,
  cost,
  pullType = 'single',
}: {
  currentBalance: number
  cost: number
  pullType?: 'single' | '10x'
}) {
  const router = useRouter()
  const [isPulling, setIsPulling] = useState(false)
  const [result, setResult] = useState<GachaResult | Gacha10xResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handlePull = async () => {
    if (currentBalance < cost) {
      alert('Not enough diamonds!')
      return
    }

    setIsPulling(true)

    try {
      const endpoint = pullType === '10x' ? '/api/gacha/pull-10x' : '/api/gacha/pull'
      const response = await fetch(endpoint, {
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
        className={`w-full rounded-lg px-6 py-3 font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 ${
          pullType === '10x'
            ? 'border-2 border-purple-600 bg-transparent text-purple-600 hover:bg-purple-600/10 text-lg dark:bg-gradient-to-r dark:from-purple-500 dark:to-blue-500 dark:text-primary-foreground dark:border-transparent'
            : 'border-2 border-primary bg-transparent text-primary hover:bg-primary/10 text-base dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-500 dark:text-foreground dark:border-transparent'
        }`}
      >
        {isPulling ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Pulling...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            <span>{pullType === '10x' ? 'Pull 10x' : 'Pull Once'} ({cost})</span>
          </>
        )}
      </button>

      {showResult && result && (
        <GachaResultModal result={result} onClose={handleCloseModal} pullType={pullType} />
      )}
    </>
  )
}

