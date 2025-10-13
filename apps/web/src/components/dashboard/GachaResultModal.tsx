'use client'

import { useEffect, useState } from 'react'

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

export default function GachaResultModal({
  result,
  onClose,
}: {
  result: GachaResult
  onClose: () => void
}) {
  const [isRevealing, setIsRevealing] = useState(true)

  useEffect(() => {
    // Reveal animation
    const timer = setTimeout(() => {
      setIsRevealing(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'from-yellow-400 to-orange-500'
      case 'EPIC':
        return 'from-purple-400 to-pink-500'
      case 'RARE':
        return 'from-blue-400 to-cyan-500'
      case 'COMMON':
        return 'from-gray-400 to-gray-500'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityEmoji = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return '🌟'
      case 'EPIC':
        return '💜'
      case 'RARE':
        return '💙'
      case 'COMMON':
        return '⚪'
      default:
        return '❓'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-md">
        {isRevealing ? (
          // Revealing animation
          <div className="animate-pulse rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center shadow-2xl">
            <div className="mb-4 text-6xl animate-bounce">🎁</div>
            <p className="text-2xl font-bold text-white">Opening...</p>
          </div>
        ) : (
          // Result display
          <div
            className={`animate-scale-in rounded-lg bg-gradient-to-r ${getRarityColor(
              result.prize.rarity
            )} p-8 text-center shadow-2xl`}
          >
            {/* Rarity Badge */}
            <div className="mb-4">
              <span className="inline-block rounded-full bg-white bg-opacity-30 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                {getRarityEmoji(result.prize.rarity)} {result.prize.rarity}
              </span>
            </div>

            {/* Prize Image/Icon */}
            <div className="mb-4 text-6xl">
              {result.prize.imageUrl ? (
                <img
                  src={result.prize.imageUrl}
                  alt={result.prize.name}
                  className="mx-auto h-32 w-32 rounded-lg object-cover"
                />
              ) : (
                <div className="text-8xl">🎁</div>
              )}
            </div>

            {/* Prize Name */}
            <h2 className="mb-2 text-3xl font-bold text-white">
              {result.prize.name}
            </h2>

            {/* Prize Description */}
            <p className="mb-4 text-white opacity-90">
              {result.prize.description}
            </p>

            {/* Prize Value */}
            <div className="mb-6 rounded-lg bg-white bg-opacity-20 p-4 backdrop-blur-sm">
              <p className="text-sm text-white opacity-90">Value</p>
              <p className="text-2xl font-bold text-white">
                💎 {result.prize.value}
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white bg-opacity-20 p-3 backdrop-blur-sm">
                <p className="text-xs text-white opacity-90">New Balance</p>
                <p className="text-lg font-bold text-white">
                  💎 {result.newBalance}
                </p>
              </div>
              <div className="rounded-lg bg-white bg-opacity-20 p-3 backdrop-blur-sm">
                <p className="text-xs text-white opacity-90">Total Pulls</p>
                <p className="text-lg font-bold text-white">
                  {result.totalPulls}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-white px-6 py-3 font-bold text-gray-900 transition-all hover:scale-105 hover:shadow-lg"
            >
              Awesome! 🎉
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

