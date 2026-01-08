import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import MerchandiseCard from '@/components/dashboard/MerchandiseCard'
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { db } from '@/lib/db'

export default async function StorePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch real merchandise from database - only MAIN and BUNDLE types (exclude ACCESSORY)
  let merchandise: any[] = []

  try {
    merchandise = await db.merchandise.findMany({
      where: {
        type: {
          in: ['MAIN', 'BUNDLE'],
        },
        inStock: true,
      },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        variants: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    // Transform for MerchandiseCard compatibility
    merchandise = merchandise.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      currency: 'GBP',
      category: item.category,
      type: item.type,
      label: item.label,
      sizes: item.sizes || [],
      colors: [...new Set(item.variants.map((v: any) => v.color).filter(Boolean))],
      imageUrl: item.imageUrl,
      inStock: item.inStock,
      featured: item.featured,
      tags: item.tags || [],
      material: item.material,
      features: item.features || [],
    }))
  } catch (error) {
    console.error('Failed to fetch merchandise:', error)
    // Return empty array on error
    merchandise = []
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimalist Header - Yeezy Style */}
      <div className="border-b border-white/10 bg-surface-base/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-black text-white tracking-tight text-center">
            STORE
          </h1>
        </div>
      </div>

      {/* Product Grid - Yeezy Style: Flush layout, minimal gaps */}
      <div className="mx-auto max-w-7xl">
        {merchandise.length === 0 ? (
          <div className="px-4 py-20 text-center">
            <div className="mb-4 text-6xl">🛍️</div>
            <p className="text-lg font-semibold text-white/70">No merchandise available at the moment.</p>
            <p className="mt-2 text-sm text-white/50">Check back soon for new items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5">
            {merchandise.map((item) => (
              <MerchandiseCard key={item.id} item={item} variant="minimal" />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Premium Quality */}
          <div className="group relative overflow-hidden rounded-3xl border border-[#00F5FF]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#00F5FF]/60 hover:shadow-[0_0_40px_rgba(0,245,255,0.4)]">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

            {/* Hover overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl bg-[#00F5FF]/20 p-4 ring-2 ring-[#00F5FF]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <ShieldCheck className="h-12 w-12 text-[#00F5FF]" />
                </div>
              </div>
              <h3 className="mb-3 font-display text-2xl font-black text-white uppercase tracking-wider">Premium Quality</h3>
              <p className="text-sm text-white/70 font-medium leading-relaxed">
                All merchandise is made with high-quality materials and craftsmanship
              </p>
            </div>
          </div>

          {/* Fast Shipping */}
          <div className="group relative overflow-hidden rounded-3xl border border-[#10B981]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#10B981]/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#10B981]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

            {/* Hover overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl bg-[#10B981]/20 p-4 ring-2 ring-[#10B981]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Truck className="h-12 w-12 text-[#10B981]" />
                </div>
              </div>
              <h3 className="mb-3 font-display text-2xl font-black text-white uppercase tracking-wider">Fast Shipping</h3>
              <p className="text-sm text-white/70 font-medium leading-relaxed">
                Free worldwide shipping on orders over $50. Delivered within 5-7 business days
              </p>
            </div>
          </div>

          {/* Easy Returns */}
          <div className="group relative overflow-hidden rounded-3xl border border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

            {/* Hover overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl bg-[#8B5CF6]/20 p-4 ring-2 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <RefreshCw className="h-12 w-12 text-[#8B5CF6]" />
                </div>
              </div>
              <h3 className="mb-3 font-display text-2xl font-black text-white uppercase tracking-wider">Easy Returns</h3>
              <p className="text-sm text-white/70 font-medium leading-relaxed">
                Not satisfied? Return within 30 days for a full refund, no questions asked
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-display text-4xl font-black text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-3xl space-y-4">
          <details className="group rounded-3xl bg-gradient-to-br from-surface-card/90 to-surface-raised/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl transition-all hover:shadow-[0_0_30px_rgba(255,31,125,0.3)] hover:border-[#FF1F7D]/50">
            <summary className="flex cursor-pointer items-center justify-between font-display font-bold text-white">
              <span>What sizes are available?</span>
              <svg
                className="h-5 w-5 transition-transform group-open:rotate-180 text-[#FF1F7D]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </summary>
            <p className="mt-4 text-sm text-white/70 font-medium leading-relaxed">
              Most apparel items are available in sizes XS to XXL. Hats and accessories are
              typically one-size-fits-all. Check individual product pages for specific sizing
              information and size charts.
            </p>
          </details>

          <details className="group rounded-3xl bg-gradient-to-br from-surface-card/90 to-surface-raised/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl transition-all hover:shadow-[0_0_30px_rgba(255,31,125,0.3)] hover:border-[#FF1F7D]/50">
            <summary className="flex cursor-pointer items-center justify-between font-display font-bold text-white">
              <span>How long does shipping take?</span>
              <svg
                className="h-5 w-5 transition-transform group-open:rotate-180 text-[#FF1F7D]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </summary>
            <p className="mt-4 text-sm text-white/70 font-medium leading-relaxed">
              Standard shipping takes 5-7 business days for domestic orders and 10-14 business
              days for international orders. Express shipping options are available at checkout
              for faster delivery.
            </p>
          </details>

          <details className="group rounded-3xl bg-gradient-to-br from-surface-card/90 to-surface-raised/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl transition-all hover:shadow-[0_0_30px_rgba(255,31,125,0.3)] hover:border-[#FF1F7D]/50">
            <summary className="flex cursor-pointer items-center justify-between font-display font-bold text-white">
              <span>What is your return policy?</span>
              <svg
                className="h-5 w-5 transition-transform group-open:rotate-180 text-[#FF1F7D]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </summary>
            <p className="mt-4 text-sm text-white/70 font-medium leading-relaxed">
              We offer a 30-day return policy for unworn, unwashed items with original tags
              attached. Simply contact our support team to initiate a return. Refunds are
              processed within 5-7 business days after we receive your return.
            </p>
          </details>

          <details className="group rounded-3xl bg-gradient-to-br from-surface-card/90 to-surface-raised/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl transition-all hover:shadow-[0_0_30px_rgba(255,31,125,0.3)] hover:border-[#FF1F7D]/50">
            <summary className="flex cursor-pointer items-center justify-between font-display font-bold text-white">
              <span>How do I care for my merchandise?</span>
              <svg
                className="h-5 w-5 transition-transform group-open:rotate-180 text-[#FF1F7D]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </summary>
            <p className="mt-4 text-sm text-white/70 font-medium leading-relaxed">
              For best results, machine wash cold with like colors and tumble dry on low heat.
              Avoid bleach and ironing directly on printed designs. Check the care label on each
              item for specific instructions.
            </p>
          </details>

          <details className="group rounded-3xl bg-gradient-to-br from-surface-card/90 to-surface-raised/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl transition-all hover:shadow-[0_0_30px_rgba(255,31,125,0.3)] hover:border-[#FF1F7D]/50">
            <summary className="flex cursor-pointer items-center justify-between font-display font-bold text-white">
              <span>Do you offer international shipping?</span>
              <svg
                className="h-5 w-5 transition-transform group-open:rotate-180 text-[#FF1F7D]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </summary>
            <p className="mt-4 text-sm text-white/70 font-medium leading-relaxed">
              Yes! We ship worldwide. International orders over £50 qualify for free shipping.
              Please note that customs fees and import duties may apply depending on your
              country&apos;s regulations.
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}
