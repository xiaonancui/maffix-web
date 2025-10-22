'use client'

import Image from 'next/image'
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

export default function GachaResultModal({
  result,
  onClose,
  pullType = 'single',
}: {
  result: GachaResult | Gacha10xResult
  onClose: () => void
  pullType?: 'single' | '10x'
}) {
  const [isRevealing, setIsRevealing] = useState(true)

  useEffect(() => {
    // Reveal animation
    const timer = setTimeout(() => {
      setIsRevealing(false)
    }, pullType === '10x' ? 3000 : 2000)

    return () => clearTimeout(timer)
  }, [pullType])

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

  // Check if it's a 10x result
  const is10x = 'prizes' in result

  if (is10x) {
    const result10x = result as Gacha10xResult
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {isRevealing ? (
            // Revealing animation for 10x
            <div className="animate-pulse rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center shadow-2xl">
              <div className="mb-4 text-6xl animate-bounce">🎁✨🎁</div>
              <p className="text-3xl font-bold text-white">Opening 10 Prizes...</p>
              {result10x.guaranteedSSR && (
                <p className="mt-2 text-lg text-yellow-300">SSR Guaranteed!</p>
              )}
            </div>
          ) : (
            // 10x Results display
            <div className="animate-scale-in rounded-lg bg-white p-8 shadow-2xl">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900">10x Draw Results!</h2>
                {result10x.guaranteedSSR && (
                  <p className="mt-2 text-sm text-yellow-600 font-semibold">
                    ✨ SSR Guarantee Activated!
                  </p>
                )}
              </div>

              {/* Prizes Grid */}
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {result10x.prizes.map((prize, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border-2 p-3 text-center transition-all hover:scale-105 ${
                      prize.rarity === 'LEGENDARY' || prize.rarity === 'EPIC'
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="mb-2 text-3xl">{getRarityEmoji(prize.rarity)}</div>
                    <div
                      className={`mb-1 text-xs font-bold ${
                        prize.rarity === 'LEGENDARY'
                          ? 'text-yellow-600'
                          : prize.rarity === 'EPIC'
                          ? 'text-purple-600'
                          : prize.rarity === 'RARE'
                          ? 'text-blue-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {prize.rarity}
                    </div>
                    <div className="text-xs font-medium text-gray-900 line-clamp-2">
                      {prize.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <p className="text-sm text-gray-600">New Balance</p>
                  <p className="text-xl font-bold text-blue-600">
                    💎 {result10x.newBalance}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center">
                  <p className="text-sm text-gray-600">Total Pulls</p>
                  <p className="text-xl font-bold text-purple-600">
                    {result10x.totalPulls}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <p className="text-sm text-gray-600">Prizes Won</p>
                  <p className="text-xl font-bold text-green-600">
                    {result10x.prizes.length}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:opacity-90"
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

  // Single pull result
  const singleResult = result as GachaResult
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
              singleResult.prize.rarity
            )} p-8 text-center shadow-2xl`}
          >
            {/* Rarity Badge */}
            <div className="mb-4">
              <span className="inline-block rounded-full bg-white bg-opacity-30 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                {getRarityEmoji(singleResult.prize.rarity)} {singleResult.prize.rarity}
              </span>
            </div>

            {/* Prize Image/Icon */}
            <div className="mb-4 text-6xl">
              {singleResult.prize.imageUrl ? (
                <Image
                  src={singleResult.prize.imageUrl}
                  alt={singleResult.prize.name}
                  width={128}
                  height={128}
                  className="mx-auto h-32 w-32 rounded-lg object-cover"
                />
              ) : (
                <div className="text-8xl">🎁</div>
              )}
            </div>

            {/* Prize Name */}
            <h2 className="mb-2 text-3xl font-bold text-white">
              {singleResult.prize.name}
            </h2>

            {/* Prize Description */}
            <p className="mb-4 text-white opacity-90">
              {singleResult.prize.description}
            </p>

            {/* Prize Value */}
            <div className="mb-6 rounded-lg bg-white bg-opacity-20 p-4 backdrop-blur-sm">
              <p className="text-sm text-white opacity-90">Value</p>
              <p className="text-2xl font-bold text-white">
                💎 {singleResult.prize.value}
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white bg-opacity-20 p-3 backdrop-blur-sm">
                <p className="text-xs text-white opacity-90">New Balance</p>
                <p className="text-lg font-bold text-white">
                  💎 {singleResult.newBalance}
                </p>
              </div>
              <div className="rounded-lg bg-white bg-opacity-20 p-3 backdrop-blur-sm">
                <p className="text-xs text-white opacity-90">Total Pulls</p>
                <p className="text-lg font-bold text-white">
                  {singleResult.totalPulls}
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
