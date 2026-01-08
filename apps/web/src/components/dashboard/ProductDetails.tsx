'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, AlertCircle } from 'lucide-react'

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
  label?: string
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
  // No default selection - user must choose
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length === 1 ? colors[0] : null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Find the selected variant
  const selectedVariant = merchandise.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  const isInStock = selectedVariant ? selectedVariant.inStock && selectedVariant.stockQuantity > 0 : merchandise.inStock
  const maxQuantity = selectedVariant ? Math.min(selectedVariant.stockQuantity, 99) : 99

  // Determine if size selection is required
  const sizeRequired = sizes.length > 0
  const colorRequired = colors.length > 0
  const sizeSelected = !sizeRequired || selectedSize !== null
  const colorSelected = !colorRequired || selectedColor !== null
  const canAddToCart = isInStock && sizeSelected && colorSelected

  const handleAddToCart = async () => {
    if (!isInStock) {
      setMessage({ type: 'error', text: 'This item is out of stock' })
      return
    }

    if (sizeRequired && !selectedSize) {
      setMessage({ type: 'error', text: 'Please select a size' })
      return
    }

    if (colorRequired && !selectedColor) {
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

      // Refresh cart count
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
    <div className="space-y-6">
      {/* Product Label & Name */}
      <div>
        {merchandise.label && (
          <span className="mb-2 inline-block font-mono text-sm font-medium tracking-wider text-white/50">
            {merchandise.label}
          </span>
        )}
        <h1 className="font-display text-3xl font-black text-white md:text-4xl">
          {merchandise.name}
        </h1>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-4xl font-black tabular-nums text-white">
          £{merchandise.price.toFixed(2)}
        </span>
        <span className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
          GBP
        </span>
      </div>

      {/* Stock Status */}
      <div>
        {isInStock ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/50 bg-[#10B981]/20 px-4 py-2 font-display text-sm font-bold text-[#10B981]">
            <Check className="h-4 w-4" />
            In Stock
            {selectedVariant && ` · ${selectedVariant.stockQuantity} available`}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF1F7D]/50 bg-[#FF1F7D]/20 px-4 py-2 font-display text-sm font-bold text-[#FF1F7D]">
            <AlertCircle className="h-4 w-4" />
            Out of Stock
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-base leading-relaxed text-white/70">
        {merchandise.description}
      </p>

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Size {!selectedSize && <span className="text-[#FF1F7D]">*</span>}
            </label>
            {selectedSize && (
              <span className="text-sm font-medium text-white/50">
                Selected: {selectedSize}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => {
              const sizeVariants = merchandise.variants?.filter((v) => v.size === size)
              const sizeInStock = sizeVariants?.some((v) => v.inStock && v.stockQuantity > 0) ?? true
              const isSelected = selectedSize === size

              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!sizeInStock}
                  className={`min-w-[60px] rounded-xl border-2 px-5 py-3 font-display text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    isSelected
                      ? 'border-[#FF1F7D] bg-[#FF1F7D]/20 text-white shadow-lg shadow-[#FF1F7D]/30 scale-105'
                      : sizeInStock
                        ? 'border-white/20 bg-surface-card/50 text-white/70 hover:border-white/40 hover:bg-surface-card/80 hover:text-white hover:scale-105'
                        : 'border-white/10 bg-surface-card/30 text-white/30 cursor-not-allowed line-through'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
          {!selectedSize && (
            <p className="text-sm font-medium text-[#FFC700]">
              Please select a size to continue
            </p>
          )}
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Color {!selectedColor && <span className="text-[#FF1F7D]">*</span>}
            </label>
            {selectedColor && (
              <span className="text-sm font-medium text-white/50">
                Selected: {selectedColor}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const colorVariants = merchandise.variants?.filter((v) => v.color === color)
              const colorInStock = colorVariants?.some((v) => v.inStock && v.stockQuantity > 0) ?? true
              const isSelected = selectedColor === color

              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!colorInStock}
                  className={`rounded-xl border-2 px-5 py-3 font-display text-sm font-bold transition-all duration-300 ${
                    isSelected
                      ? 'border-[#FF1F7D] bg-[#FF1F7D]/20 text-white shadow-lg shadow-[#FF1F7D]/30 scale-105'
                      : colorInStock
                        ? 'border-white/20 bg-surface-card/50 text-white/70 hover:border-white/40 hover:bg-surface-card/80 hover:text-white hover:scale-105'
                        : 'border-white/10 bg-surface-card/30 text-white/30 cursor-not-allowed line-through'
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
      <div className="space-y-3">
        <label className="font-display text-sm font-bold uppercase tracking-wider text-white">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white/20 bg-surface-card/50 font-display text-xl font-bold text-white transition-all duration-300 hover:border-white/40 hover:bg-surface-card/80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="w-12 text-center font-display text-2xl font-black tabular-nums text-white">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white/20 bg-surface-card/50 font-display text-xl font-bold text-white transition-all duration-300 hover:border-white/40 hover:bg-surface-card/80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-2xl border-2 p-4 ${
            message.type === 'success'
              ? 'border-[#10B981]/50 bg-[#10B981]/20 text-[#10B981]'
              : 'border-[#FF1F7D]/50 bg-[#FF1F7D]/20 text-[#FF1F7D]'
          }`}
        >
          <p className="font-display font-bold">{message.text}</p>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!canAddToCart || isAdding}
        className={`group relative w-full overflow-hidden rounded-2xl border-2 px-8 py-4 font-display text-base font-black uppercase tracking-wider transition-all duration-300 ${
          canAddToCart && !isAdding
            ? 'border-[#FF1F7D] bg-gradient-to-r from-[#FF1F7D] to-[#8B5CF6] text-white shadow-lg shadow-[#FF1F7D]/40 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#FF1F7D]/60'
            : 'border-white/20 bg-surface-card/50 text-white/40 cursor-not-allowed'
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isAdding ? (
            <>
              <span className="animate-spin">⏳</span>
              Adding to Cart...
            </>
          ) : !isInStock ? (
            <>
              <AlertCircle className="h-5 w-5" />
              Out of Stock
            </>
          ) : !sizeSelected ? (
            <>
              <AlertCircle className="h-5 w-5" />
              Select a Size
            </>
          ) : !colorSelected ? (
            <>
              <AlertCircle className="h-5 w-5" />
              Select a Color
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
              Add to Cart
            </>
          )}
        </span>
      </button>

      {/* Product Details */}
      {(merchandise.material || merchandise.features) && (
        <div className="space-y-6 border-t border-white/10 pt-6">
          {merchandise.material && (
            <div>
              <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-white">
                Material
              </h3>
              <p className="text-white/70">{merchandise.material}</p>
            </div>
          )}

          {merchandise.features && merchandise.features.length > 0 && (
            <div>
              <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-white">
                Features
              </h3>
              <ul className="space-y-2">
                {merchandise.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/70">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#10B981]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
