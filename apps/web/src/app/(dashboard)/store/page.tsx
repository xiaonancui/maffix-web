import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MerchandiseCard from '@/components/dashboard/MerchandiseCard'
import MerchandiseFilters from '@/components/dashboard/MerchandiseFilters'
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react'

export default async function StorePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Use mock data for all users (database not connected)
  let merchandise: any[] = []
  let user: any = null

  // Always use mock data
  if (true) {
    // Mock data for test accounts
    user = {
      id: session.user.id,
      diamonds: 500,
    }

    merchandise = [
      {
        id: 'merch-1',
        name: 'Classic Logo Hoodie',
        description: 'Premium heavyweight hoodie with embroidered logo',
        price: 65.00,
        currency: 'USD',
        category: 'Hoodies',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Navy', 'Gray'],
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
        inStock: true,
        featured: true,
        tags: ['bestseller', 'new'],
        material: '80% Cotton, 20% Polyester',
        features: [
          'Premium heavyweight fabric (350gsm)',
          'Embroidered logo on chest',
          'Ribbed cuffs and waistband',
          'Kangaroo pocket',
          'Unisex fit',
        ],
      },
      {
        id: 'merch-2',
        name: 'Signature Snapback Cap',
        description: 'Adjustable snapback with 3D embroidered logo',
        price: 35.00,
        currency: 'USD',
        category: 'Hats',
        sizes: ['One Size'],
        colors: ['Black', 'White', 'Red', 'Navy'],
        imageUrl: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80',
        inStock: true,
        featured: true,
        tags: ['bestseller'],
        material: '100% Cotton',
        features: [
          'Adjustable snapback closure',
          '3D embroidered logo',
          'Structured 6-panel design',
          'Curved brim',
          'Breathable eyelets',
        ],
      },
      {
        id: 'merch-3',
        name: 'Tour 2024 T-Shirt',
        description: 'Limited edition tour merchandise',
        price: 35.00,
        currency: 'USD',
        category: 'T-Shirts',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Vintage Gray'],
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
        inStock: true,
        featured: false,
        tags: ['limited', 'tour'],
        material: '100% Organic Cotton',
        features: [
          'Screen printed graphics',
          'Tour dates on back',
          'Soft-washed for comfort',
          'Tapered fit',
          'Reinforced neck seam',
        ],
      },
      {
        id: 'merch-4',
        name: 'Zip-Up Hoodie',
        description: 'Comfortable zip-up hoodie with side pockets',
        price: 75.00,
        currency: 'USD',
        category: 'Hoodies',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Charcoal', 'Navy'],
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
        inStock: true,
        featured: false,
        tags: ['new'],
        material: '80% Cotton, 20% Polyester',
        features: [
          'Full-length YKK zipper',
          'Two side pockets',
          'Drawstring hood',
          'Ribbed cuffs and hem',
          'Brushed fleece interior',
        ],
      },
      {
        id: 'merch-5',
        name: 'Beanie',
        description: 'Warm knit beanie with woven label',
        price: 25.00,
        currency: 'USD',
        category: 'Hats',
        sizes: ['One Size'],
        colors: ['Black', 'Gray', 'Navy', 'Burgundy'],
        imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80',
        inStock: true,
        featured: false,
        tags: [],
        material: '100% Acrylic',
        features: [
          'Soft knit construction',
          'Woven label patch',
          'Fold-up cuff',
          'One size fits most',
          'Machine washable',
        ],
      },
      {
        id: 'merch-6',
        name: 'Crewneck Sweatshirt',
        description: 'Classic crewneck with vintage print',
        price: 55.00,
        currency: 'USD',
        category: 'Sweatshirts',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Sand', 'Forest Green'],
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
        inStock: true,
        featured: true,
        tags: ['bestseller'],
        material: '80% Cotton, 20% Polyester',
        features: [
          'Vintage-style print',
          'Ribbed collar, cuffs, and hem',
          'Soft fleece interior',
          'Relaxed fit',
          'Pre-shrunk fabric',
        ],
      },
      {
        id: 'merch-7',
        name: 'Dad Hat',
        description: 'Unstructured low-profile cap',
        price: 30.00,
        currency: 'USD',
        category: 'Hats',
        sizes: ['One Size'],
        colors: ['Black', 'White', 'Khaki', 'Pink'],
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
        inStock: true,
        featured: false,
        tags: [],
        material: '100% Cotton',
        features: [
          'Unstructured design',
          'Adjustable strap closure',
          'Embroidered logo',
          'Curved brim',
          'Low-profile fit',
        ],
      },
      {
        id: 'merch-8',
        name: 'Long Sleeve T-Shirt',
        description: 'Comfortable long sleeve with sleeve print',
        price: 45.00,
        currency: 'USD',
        category: 'T-Shirts',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Olive'],
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
        inStock: false,
        featured: false,
        tags: ['sold-out'],
        material: '100% Cotton',
        features: [
          'Screen printed graphics',
          'Sleeve print detail',
          'Ribbed crew neck',
          'Regular fit',
          'Durable construction',
        ],
      },
    ]
  }

  // Get unique categories for filtering
  const categories = ['All', ...new Set(merchandise.map((item) => item.category))]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in-up">
        {/* Enhanced Store Header */}
        <div className="mb-12 text-center" style={{ animationDelay: '0ms' }}>
          <h1 className="font-display text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF1F7D] via-[#8B5CF6] to-[#00F5FF] mb-4 drop-shadow-[0_0_30px_rgba(255,31,125,0.5)]" style={{ backgroundSize: '200%', animation: 'gradient-shift 3s ease-in-out infinite' }}>
            OFFICIAL STORE
          </h1>
          <p className="text-xl text-white/70 font-bold uppercase tracking-wider">
            Premium Merchandise • Exclusive Collectibles
          </p>
        </div>

        {/* Filters */}
        <div style={{ animationDelay: '100ms' }}>
          <MerchandiseFilters categories={categories} />
        </div>

        {/* Merchandise Grid */}
        <div style={{ animationDelay: '200ms' }}>
          {merchandise.length === 0 ? (
            <div className="rounded-3xl bg-gradient-to-br from-surface-card/90 to-surface-raised/80 border border-white/10 p-12 text-center shadow-xl backdrop-blur-xl">
              <div className="mb-4 text-6xl">🛍️</div>
              <p className="text-lg font-semibold text-white/70">No merchandise available at the moment.</p>
              <p className="mt-2 text-sm text-white/50">Check back soon for new items!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {merchandise.map((item) => (
                <MerchandiseCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Info Section */}
        <div className="mt-20 grid gap-8 md:grid-cols-3" style={{ animationDelay: '300ms' }}>
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

        {/* FAQ Section */}
        <div className="mt-20" style={{ animationDelay: '400ms' }}>
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
                Yes! We ship worldwide. International orders over $50 qualify for free shipping.
                Please note that customs fees and import duties may apply depending on your
                country&apos;s regulations.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
