'use client'

import Image from 'next/image'
import Link from 'next/link'

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
  // Minimal variant - Yeezy-style ultra-clean product card
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
          {/* Product Label Overlay */}
          {item.label && (
            <span className="absolute left-3 top-3 font-mono text-[10px] font-medium tracking-wider text-white/70 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
              {item.label}
            </span>
          )}
          {/* Sold Out Overlay */}
          {!item.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-white/80">
                Sold Out
              </span>
            </div>
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

  // Default variant - Clean card with more details but no buttons
  return (
    <Link
      href={`/store/${item.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/50 hover:shadow-[0_0_40px_rgba(255,31,125,0.3)]"
    >
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

        {/* Product Label Overlay - Top Left */}
        {item.label && (
          <span className="absolute left-4 top-4 font-mono text-xs font-semibold tracking-wider text-white bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            {item.label}
          </span>
        )}

        {/* Featured Badge - Top Right (only if no label or alongside label) */}
        {item.featured && (
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-[#FFC700]/50 bg-[#FFC700]/20 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-[#FFC700] backdrop-blur-sm">
            Featured
          </span>
        )}

        {/* Sold Out Overlay */}
        {!item.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-2xl border-2 border-[#FF1F7D] bg-[#FF1F7D]/20 px-6 py-3 font-display text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/50">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-6">
        {/* Category & Tags */}
        <div className="mb-3 flex items-center gap-2">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-white/50">
            {item.category}
          </span>
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
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-2xl font-black tabular-nums text-white">
              £{item.price.toFixed(2)}
            </span>
            <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              GBP
            </span>
          </div>

          {/* Visual CTA hint on hover */}
          <span className="font-display text-xs font-bold uppercase tracking-wider text-[#FF1F7D] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
