import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MerchandiseCard from '@/components/dashboard/MerchandiseCard'
import MerchandiseFilters from '@/components/dashboard/MerchandiseFilters'
import { ShieldCheck, Truck, RefreshCw, Star, Sparkles } from 'lucide-react'

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
      diamondBalance: 500,
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filters */}
        <MerchandiseFilters categories={categories} />

        {/* Featured Banner */}
        {merchandise.some((item) => item.featured) && (
          <div className="mb-8 rounded-lg border-2 border-yellow-600 bg-transparent p-6 dark:bg-gradient-to-r dark:from-yellow-900/20 dark:to-orange-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-600 fill-yellow-600" />
                <div>
                  <h3 className="text-lg font-bold text-foreground">Featured Items</h3>
                  <p className="text-sm text-muted-foreground">
                    Check out our most popular merchandise
                  </p>
                </div>
              </div>
              <span className="rounded-full border-2 border-orange-600 bg-transparent px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-600 dark:text-primary-foreground">
                Limited Stock
              </span>
            </div>
          </div>
        )}

        {/* Merchandise Grid */}
        {merchandise.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-12 text-center shadow">
            <div className="mb-4 text-6xl">🛍️</div>
            <p className="text-lg text-muted-foreground">No merchandise available at the moment.</p>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon for new items!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {merchandise.map((item) => (
              <MerchandiseCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-card border border-border p-6 text-center shadow hover:border-[#FF5656] transition-colors">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-900/20">
                <svg
                  className="h-8 w-8 text-[#FF5656]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">Premium Quality</h3>
            <p className="text-sm text-muted-foreground">
              All merchandise is made with high-quality materials and craftsmanship
            </p>
          </div>

          <div className="rounded-lg bg-card border border-border p-6 text-center shadow hover:border-[#FF5656] transition-colors">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-900/20">
                <svg
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">Fast Shipping</h3>
            <p className="text-sm text-muted-foreground">
              Free worldwide shipping on orders over $50. Delivered within 5-7 business days
            </p>
          </div>

          <div className="rounded-lg bg-card border border-border p-6 text-center shadow hover:border-[#FF5656] transition-colors">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/20">
                <svg
                  className="h-8 w-8 text-[#FF5656]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">
              Not satisfied? Return within 30 days for a full refund, no questions asked
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            <details className="group rounded-lg bg-card border border-border p-6 shadow transition-all hover:shadow-md hover:border-[#FF5656]">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground">
                <span>What sizes are available?</span>
                <svg
                  className="h-5 w-5 transition-transform group-open:rotate-180 text-muted-foreground"
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
              <p className="mt-4 text-sm text-muted-foreground">
                Most apparel items are available in sizes XS to XXL. Hats and accessories are
                typically one-size-fits-all. Check individual product pages for specific sizing
                information and size charts.
              </p>
            </details>

            <details className="group rounded-lg bg-card border border-border p-6 shadow transition-all hover:shadow-md hover:border-[#FF5656]">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground">
                <span>How long does shipping take?</span>
                <svg
                  className="h-5 w-5 transition-transform group-open:rotate-180 text-muted-foreground"
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
              <p className="mt-4 text-sm text-muted-foreground">
                Standard shipping takes 5-7 business days for domestic orders and 10-14 business
                days for international orders. Express shipping options are available at checkout
                for faster delivery.
              </p>
            </details>

            <details className="group rounded-lg bg-card border border-border p-6 shadow transition-all hover:shadow-md hover:border-[#FF5656]">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground">
                <span>What is your return policy?</span>
                <svg
                  className="h-5 w-5 transition-transform group-open:rotate-180 text-muted-foreground"
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
              <p className="mt-4 text-sm text-muted-foreground">
                We offer a 30-day return policy for unworn, unwashed items with original tags
                attached. Simply contact our support team to initiate a return. Refunds are
                processed within 5-7 business days after we receive your return.
              </p>
            </details>

            <details className="group rounded-lg bg-card border border-border p-6 shadow transition-all hover:shadow-md hover:border-[#FF5656]">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground">
                <span>How do I care for my merchandise?</span>
                <svg
                  className="h-5 w-5 transition-transform group-open:rotate-180 text-muted-foreground"
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
              <p className="mt-4 text-sm text-muted-foreground">
                For best results, machine wash cold with like colors and tumble dry on low heat.
                Avoid bleach and ironing directly on printed designs. Check the care label on each
                item for specific instructions.
              </p>
            </details>

            <details className="group rounded-lg bg-card border border-border p-6 shadow transition-all hover:shadow-md hover:border-[#FF5656]">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground">
                <span>Do you offer international shipping?</span>
                <svg
                  className="h-5 w-5 transition-transform group-open:rotate-180 text-muted-foreground"
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
              <p className="mt-4 text-sm text-muted-foreground">
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
