'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Merchandise = {
  id: string
  name: string
  description: string
  price: number
  currency?: string
  category: string
  material?: string
  features?: string[]
  tags?: string[]
  inStock: boolean
  variants?: any[]
}

export default function ProductDetails({
  merchandise,
  sizes,
  colors,
}: {
  merchandise: Merchandise
  sizes: string[]
  colors: string[]
}) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] || null)
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Find the selected variant
  const selectedVariant = merchandise.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  const isInStock = selectedVariant ? selectedVariant.inStock && selectedVariant.stockQuantity > 0 : merchandise.inStock
  const maxQuantity = selectedVariant ? Math.min(selectedVariant.stockQuantity, 99) : 99

  const handleAddToCart = async () => {
    if (!isInStock) {
      setMessage({ type: 'error', text: 'This item is out of stock' })
      return
    }

    if (sizes.length > 0 && !selectedSize) {
      setMessage({ type: 'error', text: 'Please select a size' })
      return
    }

    if (colors.length > 0 && !selectedColor) {
      setMessage({ type: 'error', text: 'Please select a color' })
      return
    }

    setIsAdding(true)
    setMessage(null)

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchandiseId: merchandise.id,
          variantId: selectedVariant?.id,
          quantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      setMessage({ type: 'success', text: 'Added to cart!' })
      
      // Refresh cart count (you might want to use a global state management solution)
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error: any) {
      console.error('Error adding to cart:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      {/* Product Name and Price */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{merchandise.name}</h1>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#FF5656]">
            ${merchandise.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">{merchandise.currency || 'USD'}</span>
        </div>
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        {isInStock ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
            ✓ In Stock
            {selectedVariant && ` (${selectedVariant.stockQuantity} available)`}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
            ✗ Out of Stock
          </span>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700">{merchandise.description}</p>
      </div>

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-900">Size</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const sizeVariants = merchandise.variants?.filter((v) => v.size === size)
              const sizeInStock = sizeVariants?.some((v) => v.inStock && v.stockQuantity > 0)
              
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!sizeInStock}
                  className={`rounded-lg border-2 px-4 py-2 font-semibold transition-all ${
                    selectedSize === size
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : sizeInStock
                      ? 'border-border bg-white text-gray-700 hover:border-gray-400'
                      : 'border-border bg-gray-100 text-muted-foreground cursor-not-allowed line-through'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-900">Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const colorVariants = merchandise.variants?.filter((v) => v.color === color)
              const colorInStock = colorVariants?.some((v) => v.inStock && v.stockQuantity > 0)
              
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!colorInStock}
                  className={`rounded-lg border-2 px-4 py-2 font-semibold transition-all ${
                    selectedColor === color
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : colorInStock
                      ? 'border-border bg-white text-gray-700 hover:border-gray-400'
                      : 'border-border bg-gray-100 text-muted-foreground cursor-not-allowed line-through'
                  }`}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-gray-900">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="rounded-lg border-2 border-border bg-white px-4 py-2 font-bold text-gray-700 transition-all hover:border-gray-400 disabled:opacity-50"
          >
            −
          </button>
          <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="rounded-lg border-2 border-border bg-white px-4 py-2 font-bold text-gray-700 transition-all hover:border-gray-400 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 rounded-lg p-3 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!isInStock || isAdding}
        className="w-full rounded-lg border-2 border-blue-600 bg-transparent px-6 py-3 font-bold text-blue-600 transition-all hover:scale-105 hover:bg-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 dark:text-primary-foreground dark:border-transparent"
      >
        {isAdding ? '⏳ Adding...' : isInStock ? '🛒 Add to Cart' : '✗ Out of Stock'}
      </button>

      {/* Product Details */}
      {(merchandise.material || merchandise.features) && (
        <div className="mt-8 space-y-4 border-t pt-6">
          {merchandise.material && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Material</h3>
              <p className="text-gray-700">{merchandise.material}</p>
            </div>
          )}

          {merchandise.features && merchandise.features.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Features</h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                {merchandise.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

