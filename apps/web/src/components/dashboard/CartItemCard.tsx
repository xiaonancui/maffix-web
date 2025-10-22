'use client'

import { useState } from 'react'
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
    <div className="relative rounded-lg bg-white p-4 shadow-md">
      <div className="flex gap-4">
        {/* Image */}
        <Link href={`/store/${item.merchandise.id}`} className="flex-shrink-0">
          <img
            src={item.merchandise.imageUrl}
            alt={item.merchandise.name}
            className="h-24 w-24 rounded-lg object-cover"
          />
        </Link>

        {/* Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Link
              href={`/store/${item.merchandise.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600"
            >
              {item.merchandise.name}
            </Link>
            {item.variant && (
              <div className="mt-1 flex gap-3 text-sm text-gray-600">
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
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 99 || isUpdating}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                +
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
              {quantity > 1 && (
                <p className="text-sm text-gray-500">${itemPrice.toFixed(2)} each</p>
              )}
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
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
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in rounded-lg bg-blue-600 px-6 py-3 text-white shadow-lg">
          <p className="font-semibold">🛒 Cart update coming soon!</p>
          <p className="text-sm opacity-90">购物车功能开发中</p>
        </div>
      )}
    </div>
  )
}

