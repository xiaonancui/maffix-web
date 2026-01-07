'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Loader2, Star, Sparkles } from 'lucide-react'
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
        return 'text-[#FF5656] bg-purple-50 border-purple-200'
      case 'RARE':
        return 'text-[#FF5656] bg-blue-50 border-blue-200'
      case 'COMMON':
        return 'text-muted-foreground bg-gray-50 border-border'
      default:
        return 'text-muted-foreground bg-gray-50 border-border'
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
      className={`relative rounded-lg border-2 bg-card shadow-lg transition-all hover:shadow-xl ${
        pack.featured ? 'border-yellow-600' : 'border-border'
      }`}
    >
      {/* Featured Badge */}
      {pack.featured && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 transform">
          <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1 text-xs font-bold text-foreground shadow-md flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            FEATURED
          </span>
        </div>
      )}

      {/* Pack Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
        {pack.imageUrl ? (
          <Image
            src={pack.imageUrl}
            alt={pack.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Sparkles className="h-16 w-16 text-primary" />
          </div>
        )}
      </div>

      {/* Pack Details */}
      <div className="p-6">
        {/* Name */}
        <h3 className="mb-2 text-xl font-bold text-foreground">{pack.name}</h3>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {pack.description}
        </p>

        {/* Price */}
        <div className="mb-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-center">
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="text-3xl font-bold text-green-600">
            £{pack.price.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">GBP</p>
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
              <span className="text-sm font-bold text-[#FF5656]">
                +{pack.bonusDiamonds.toLocaleString()}
              </span>
            </div>
          )}
          {pack.bonusTickets > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2">
              <span className="text-sm font-medium text-purple-900">
                🎫 Draw Tickets
              </span>
              <span className="text-sm font-bold text-[#FF5656]">
                +{pack.bonusTickets}
              </span>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isPurchasing || !pack.isActive}
          className={`w-full rounded-lg px-6 py-3 font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 ${
            pack.featured
              ? 'border-2 border-yellow-600 bg-transparent text-yellow-600 hover:bg-yellow-600/10 dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-500 dark:text-foreground dark:border-transparent'
              : 'border-2 border-purple-600 bg-transparent text-purple-600 hover:bg-purple-600/10 dark:bg-gradient-to-r dark:from-purple-500 dark:to-pink-500 dark:text-primary-foreground dark:border-transparent'
          }`}
        >
          {isPurchasing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : !pack.isActive ? (
            'Unavailable'
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>Purchase Now</span>
            </>
          )}
        </button>

        {/* Value Indicator */}
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
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

