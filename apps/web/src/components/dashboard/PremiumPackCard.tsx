'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Prize = {
  id: string
  name: string
  rarity: string
  image: string | null
}

type PremiumPack = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl: string | null
  featured: boolean
  bonusTickets: number
  bonusDiamonds: number
  guaranteedPrize: Prize | null
  isActive: boolean
}

export default function PremiumPackCard({ pack }: { pack: PremiumPack }) {
  const router = useRouter()
  const [isPurchasing, setIsPurchasing] = useState(false)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'SSR':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'EPIC':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'RARE':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'COMMON':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRarityEmoji = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return '👑'
      case 'SSR':
        return '⭐'
      case 'EPIC':
        return '💜'
      case 'RARE':
        return '💙'
      case 'COMMON':
        return '⚪'
      default:
        return '🎁'
    }
  }

  const handlePurchase = async () => {
    setIsPurchasing(true)
    try {
      // Initiate payment
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packId: pack.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to initiate payment')
        return
      }

      // Redirect to payment page with session data
      // For now, we'll show an alert
      // In production, you would integrate Klarna's payment widget here
      alert(
        `Payment initiated!\n\nPack: ${pack.name}\nPrice: $${pack.price}\n\nIn production, this would open the Klarna payment widget.\n\nSession ID: ${data.session.session_id}`
      )

      // TODO: Integrate Klarna payment widget
      // loadKlarnaWidget(data.session.client_token, data.session.session_id)
    } catch (error) {
      console.error('Purchase error:', error)
      alert('An error occurred while initiating payment')
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div
      className={`relative rounded-lg border-2 bg-white shadow-lg transition-all hover:shadow-xl ${
        pack.featured ? 'border-yellow-400' : 'border-gray-200'
      }`}
    >
      {/* Featured Badge */}
      {pack.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
          <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1 text-xs font-bold text-white shadow-md">
            ⭐ FEATURED
          </span>
        </div>
      )}

      {/* Pack Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-purple-100 to-pink-100">
        {pack.imageUrl ? (
          <Image
            src={pack.imageUrl}
            alt={pack.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            📦
          </div>
        )}
      </div>

      {/* Pack Details */}
      <div className="p-6">
        {/* Name */}
        <h3 className="mb-2 text-xl font-bold text-gray-900">{pack.name}</h3>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {pack.description}
        </p>

        {/* Price */}
        <div className="mb-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-center">
          <p className="text-sm text-gray-600">Price</p>
          <p className="text-3xl font-bold text-green-600">
            ${pack.price.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">{pack.currency}</p>
        </div>

        {/* Guaranteed Prize */}
        {pack.guaranteedPrize && (
          <div
            className={`mb-3 rounded-lg border-2 p-3 ${getRarityColor(
              pack.guaranteedPrize.rarity
            )}`}
          >
            <p className="text-xs font-semibold mb-1">
              {getRarityEmoji(pack.guaranteedPrize.rarity)} GUARANTEED PRIZE
            </p>
            <p className="text-sm font-bold">{pack.guaranteedPrize.name}</p>
            <p className="text-xs opacity-75">{pack.guaranteedPrize.rarity}</p>
          </div>
        )}

        {/* Bonuses */}
        <div className="mb-4 space-y-2">
          {pack.bonusDiamonds > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
              <span className="text-sm font-medium text-blue-900">
                💎 Bonus Diamonds
              </span>
              <span className="text-sm font-bold text-blue-600">
                +{pack.bonusDiamonds.toLocaleString()}
              </span>
            </div>
          )}
          {pack.bonusTickets > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2">
              <span className="text-sm font-medium text-purple-900">
                🎫 Draw Tickets
              </span>
              <span className="text-sm font-bold text-purple-600">
                +{pack.bonusTickets}
              </span>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isPurchasing || !pack.isActive}
          className={`w-full rounded-lg px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 ${
            pack.featured
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
        >
          {isPurchasing ? (
            <>
              <span className="animate-spin">⏳</span> Processing...
            </>
          ) : !pack.isActive ? (
            'Unavailable'
          ) : (
            <>🛒 Purchase Now</>
          )}
        </button>

        {/* Value Indicator */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Total Value: $
            {(
              pack.price +
              (pack.bonusDiamonds / 100) +
              pack.bonusTickets * 1
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

