'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type CartItem = {
  id: string
  merchandiseId: string
  variantId: string | null
  quantity: number
  merchandise: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
  variant: {
    id: string
    size: string | null
    color: string | null
    priceModifier: number
  } | null
}

export default function CartItemCard({ item }: { item: CartItem }) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const basePrice = item.merchandise.price
  const variantPrice = item.variant?.priceModifier || 0
  const itemPrice = basePrice + variantPrice
  const totalPrice = itemPrice * quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return
    setQuantity(newQuantity)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleRemove = () => {
    if (confirm('Remove this item from cart?')) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
  }

  return (
    <div className="relative rounded-lg bg-secondary border border-border p-4 shadow-md hover:border-[#FF5656] transition-colors">
      <div className="flex gap-4">
        {/* Image */}
        <Link href={`/store/${item.merchandise.id}`} className="relative h-24 w-24 flex-shrink-0">
          <Image
            src={item.merchandise.imageUrl}
            alt={item.merchandise.name}
            fill
            sizes="96px"
            className="rounded-lg object-cover"
          />
        </Link>

        {/* Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Link
              href={`/store/${item.merchandise.id}`}
              className="text-lg font-semibold text-foreground hover:text-[#FF5656] transition-colors"
            >
              {item.merchandise.name}
            </Link>
            {item.variant && (
              <div className="mt-1 flex gap-3 text-sm text-muted-foreground">
                {item.variant.size && <span>Size: {item.variant.size}</span>}
                {item.variant.color && <span>Color: {item.variant.color}</span>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isUpdating}
                className="rounded-md border border-gray-600 bg-secondary px-3 py-1 text-muted-foreground hover:bg-gray-700 hover:text-foreground disabled:opacity-50 transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-foreground">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 99 || isUpdating}
                className="rounded-md border border-gray-600 bg-secondary px-3 py-1 text-muted-foreground hover:bg-gray-700 hover:text-foreground disabled:opacity-50 transition-colors"
              >
                +
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">£{totalPrice.toFixed(2)}</p>
              {quantity > 1 && (
                <p className="text-sm text-muted-foreground">£{itemPrice.toFixed(2)} each</p>
              )}
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-red-900/20 hover:text-red-400 transition-colors"
          title="Remove from cart"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in rounded-lg bg-[#FF5656] px-6 py-3 text-foreground shadow-lg">
          <p className="font-semibold">🛒 Cart update coming soon!</p>
          <p className="text-sm opacity-90">购物车功能开发中</p>
        </div>
      )}
    </div>
  )
}
