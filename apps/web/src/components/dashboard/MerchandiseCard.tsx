'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Eye, Star } from 'lucide-react'

interface MerchandiseItem {
  id: string
  name: string
  description: string
  price: number
  currency: string
  category: string
  sizes: string[]
  colors: string[]
  imageUrl: string
  inStock: boolean
  featured: boolean
  tags: string[]
  material?: string
  features?: string[]
  label?: string
  type?: string
}

interface MerchandiseCardProps {
  item: MerchandiseItem
  variant?: 'default' | 'minimal'
}

export default function MerchandiseCard({ item, variant = 'default' }: MerchandiseCardProps) {
  const [selectedSize, setSelectedSize] = useState(item.sizes[0])
  const [selectedColor, setSelectedColor] = useState(item.colors[0])
  const [showToast, setShowToast] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  const handleAddToCart = () => {
    setIsAdding(true)

    // Show success toast (demo mode - using mock data)
    setShowToast(true)

    // Redirect to cart page after 1 second
    setTimeout(() => {
      setShowToast(false)
      setIsAdding(false)
      router.push('/cart')
    }, 1000)
  }

  // Minimal variant - Yeezy-style clean product card
  if (variant === 'minimal') {
    return (
      <Link
        href={`/store/${item.id}`}
        className="group relative block overflow-hidden bg-surface-card transition-all duration-300 hover:bg-surface-raised"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {!item.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-white/80">
                Sold Out
              </span>
            </div>
          )}
          {item.label && (
            <span className="absolute left-3 top-3 font-mono text-[10px] font-medium tracking-wider text-white/60">
              {item.label}
            </span>
          )}
        </div>

        {/* Content - Minimal */}
        <div className="p-4">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white truncate">
            {item.name}
          </h3>
          <p className="mt-1 font-display text-sm font-medium tabular-nums text-white/70">
            £{item.price.toFixed(2)}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/50 hover:shadow-[0_0_40px_rgba(255,31,125,0.3)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-150" />

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-raised">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.featured && (
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border-2 border-[#FFC700] bg-[#FFC700]/30 px-3 py-1.5 font-display text-xs font-black uppercase tracking-wider text-white backdrop-blur-sm shadow-lg shadow-[#FFC700]/50">
            <Star className="h-3.5 w-3.5 fill-[#FFC700] text-[#FFC700]" />
            Featured
          </span>
        )}
        {!item.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-2xl border-2 border-[#FF1F7D] bg-[#FF1F7D]/20 px-6 py-3 font-display text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/50">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-col p-6 h-full">
        {/* Top Content - Will grow to push buttons to bottom */}
        <div className="flex-grow">
          {/* Category & Tags */}
          <div className="mb-3 flex items-center gap-2">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-white/50">{item.category}</span>
            {item.tags.includes('bestseller') && (
              <span className="rounded-full border border-[#00F5FF]/50 bg-[#00F5FF]/20 px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-[#00F5FF]">
                Bestseller
              </span>
            )}
            {item.tags.includes('new') && (
              <span className="rounded-full border border-[#10B981]/50 bg-[#10B981]/20 px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-[#10B981]">
                New
              </span>
            )}
          </div>

          {/* Name & Description */}
          <h3 className="mb-2 font-display text-lg font-black text-white">{item.name}</h3>
          <p className="mb-4 line-clamp-2 text-sm font-medium text-white/60">{item.description}</p>

          {/* Price */}
          <div className="mb-5">
            <span className="font-display text-3xl font-black tabular-nums text-white">
              £{item.price.toFixed(2)}
            </span>
            <span className="ml-2 text-sm font-semibold uppercase tracking-wider text-white/50">GBP</span>
          </div>

          {/* Color Selection */}
          {item.colors.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-white/70">
                Color: {selectedColor}
              </p>
              <div className="flex gap-2">
                {item.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative h-9 w-9 rounded-full border-2 transition-all duration-300 ${
                      selectedColor === color
                        ? 'border-[#FF1F7D] ring-2 ring-[#FF1F7D]/50 ring-offset-2 ring-offset-surface-card scale-110'
                        : 'border-white/30 hover:border-white/50 hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() === 'black' ? '#000000' : color.toLowerCase(),
                    }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-black">
                        {color.toLowerCase() === 'white' || color.toLowerCase() === 'gray' ? '✓' : '✓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {item.sizes.length > 0 && item.sizes[0] !== 'One Size' && (
            <div className="mb-5">
              <p className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-white/70">
                Size: {selectedSize}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl border-2 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                      selectedSize === size
                        ? 'border-[#FF1F7D] bg-[#FF1F7D]/20 text-white shadow-lg shadow-[#FF1F7D]/30 scale-105'
                        : 'border-white/20 bg-surface-card/50 text-white/60 hover:border-white/40 hover:bg-surface-card/80 hover:text-white hover:scale-105'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions - Always at bottom */}
        <div className="space-y-3 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={!item.inStock || isAdding}
            className={`w-full rounded-2xl px-6 py-3.5 font-display text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
              item.inStock && !isAdding
                ? 'border-2 border-[#FF1F7D] bg-gradient-to-r from-[#FF1F7D] to-[#8B5CF6] text-white shadow-lg shadow-[#FF1F7D]/40 hover:scale-105 hover:shadow-xl hover:shadow-[#FF1F7D]/60'
                : 'cursor-not-allowed border-2 border-white/10 bg-surface-card/50 text-white/30'
            }`}
          >
            {!item.inStock ? (
              'Out of Stock'
            ) : isAdding ? (
              'Adding...'
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>

          <Link
            href={`/store/${item.id}`}
            className="flex items-center justify-center gap-2 w-full rounded-2xl border-2 border-white/20 bg-surface-card/50 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-surface-card/80 hover:text-white hover:scale-105"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in rounded-3xl border-2 border-[#FF1F7D] bg-gradient-to-br from-[#FF1F7D]/30 to-[#8B5CF6]/20 px-8 py-4 text-white shadow-2xl shadow-[#FF1F7D]/50 backdrop-blur-xl">
            <p className="font-display font-black text-lg">🛒 Payment integration coming soon!</p>
            <p className="text-sm font-semibold opacity-90">支付功能开发中，敬请期待</p>
          </div>
        )}
      </div>
    </div>
  )
}
