import Link from 'next/link'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

export default function PromoCard() {
  return (
    <Link
      href="/store"
      className="group relative block overflow-hidden rounded-3xl border border-[#FF1F7D]/20 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_60px_rgba(255,31,125,0.5)]"
    >
      {/* Animated gradient border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#FF1F7D]/30 via-[#FFC700]/30 to-[#FF1F7D]/30 blur-xl"
             style={{ animation: 'pulse 3s ease-in-out infinite' }} />
      </div>

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 via-[#FFC700]/10 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

      {/* Product Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Image with zoom effect */}
        <Image
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
          alt="Limited Edition Tour T-Shirt"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Colorful gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF1F7D]/30 via-transparent to-[#FFC700]/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* NEW ARRIVAL Badge */}
        <div className="absolute left-4 top-4">
          <div className="relative">
            {/* Pulsing glow behind badge */}
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#00F5FF] blur-lg opacity-60" />

            {/* Badge */}
            <div className="relative flex items-center gap-2 rounded-full border border-[#00F5FF]/50 bg-[#00F5FF]/20 px-4 py-2 backdrop-blur-md">
              <Sparkles className="h-4 w-4 animate-pulse text-[#00F5FF]" />
              <span className="font-display text-xs font-black uppercase tracking-widest text-white">
                New Arrival
              </span>
            </div>
          </div>
        </div>

        {/* LIMITED EDITION Badge */}
        <div className="absolute right-4 top-4">
          <div className="rounded-full border border-[#FFC700]/40 bg-gradient-to-r from-[#FFC700]/20 to-[#FF1F7D]/20 px-3 py-1.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#FFC700]" />
              <span className="font-display text-xs font-bold uppercase tracking-wider text-[#FFC700]">
                Limited
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="relative space-y-4 p-6">
        {/* Eyebrow */}
        <div className="font-display text-xs font-bold uppercase tracking-[0.3em] text-[#FF1F7D]">
          Featured Drop
        </div>

        {/* Product Name */}
        <div>
          <h3 className="font-display text-xl font-black leading-tight text-white">
            Limited Edition Tour T-Shirt
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Exclusive design. Limited quantities. Don't miss out.
          </p>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-4">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-black tabular-nums text-[#FFC700]">
              $29
            </span>
            <span className="font-display text-lg font-bold text-[#FFC700]/60">
              .99
            </span>
          </div>

          {/* CTA Button */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#FFC700] px-6 py-2.5 font-display text-sm font-bold text-white shadow-lg shadow-[#FF1F7D]/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-[#FF1F7D]/60">
            Shop Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{
            transform: 'translateX(-100%)',
            animation: 'shine 2s ease-in-out infinite',
          }}
        />
      </div>
    </Link>
  )
}
