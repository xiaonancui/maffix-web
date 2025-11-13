import Hero from '@/components/marketing/Hero'
import SectionHeading from '@/components/marketing/SectionHeading'
import AnimatedSection from '@/components/marketing/AnimatedSection'
import CTA from '@/components/marketing/CTA'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'Exclusive Store - Official Merchandise & Premium Packs',
  description:
    'Shop official artist merchandise and premium packs. Get guaranteed items, bonus draw tickets, and exclusive access to limited edition products.',
  keywords: ['artist merchandise', 'premium packs', 'exclusive items', 'limited edition', 'Klarna payment'],
  url: '/features/store',
})

const storeCategories = [
  {
    icon: '👕',
    title: 'Artist Merchandise',
    description: 'Official t-shirts, hoodies, posters, and more from your favorite independent musicians.',
    features: ['Authentic products', 'Artist-approved designs', 'High quality materials', 'Worldwide shipping'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🎁',
    title: 'Premium Packs',
    description: 'Curated packs with guaranteed merchandise plus bonus draw tickets. Best value for fans.',
    features: ['Guaranteed items', 'Bonus draw tickets', 'Exclusive content', 'Limited editions'],
    color: 'from-purple-500 to-pink-500',
  },
]

const premiumPackBenefits = [
  {
    icon: '✅',
    title: 'Guaranteed Items',
    description: 'Every premium pack includes guaranteed physical merchandise. No randomness, you know what you get.',
  },
  {
    icon: '🎫',
    title: 'Bonus Tickets',
    description: 'Get free gacha draw tickets with every pack purchase. More chances to win rare prizes.',
  },
  {
    icon: '🌟',
    title: 'Exclusive Access',
    description: 'Premium pack buyers get early access to new releases and limited edition items.',
  },
  {
    icon: '💎',
    title: 'Bonus Diamonds',
    description: 'Receive bonus diamonds with pack purchases. Use them for more gacha draws.',
  },
]

const paymentFeatures = [
  {
    icon: '💳',
    title: 'Klarna Payments',
    description: 'Shop now, pay later with Klarna. Split your purchase into interest-free installments.',
  },
  {
    icon: '🔒',
    title: 'Secure Checkout',
    description: 'Your payment information is encrypted and secure. We never store your card details.',
  },
  {
    icon: '🚚',
    title: 'Fast Shipping',
    description: 'Orders ship within 2-3 business days. Track your package every step of the way.',
  },
  {
    icon: '↩️',
    title: 'Easy Returns',
    description: '30-day return policy on all merchandise. Not satisfied? Get a full refund.',
  },
]

export default function StoreFeaturePage() {
  return (
    <div className="bg-white">
      <Hero
        badge="🛍️ Exclusive Store"
        title="Official Merchandise & Premium Packs"
        subtitle="Support artists while getting amazing products"
        description="Shop authentic artist merchandise and curated premium packs. Every purchase directly supports independent musicians."
        primaryCTA={{ text: 'Browse Store', href: '/register' }}
        secondaryCTA={{ text: 'View All Features', href: '/features' }}
      />

      {/* Store Categories */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="🏪 What We Offer"
            title="Two Ways to Shop"
            subtitle="Choose between individual merchandise or value-packed premium bundles."
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {storeCategories.map((category, index) => (
              <AnimatedSection key={category.title} delay={index * 0.2}>
                <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-gray-100">
                  <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-4xl`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <ul className="space-y-3">
                    {category.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-700">
                        <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Pack Benefits */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="⭐ Premium Packs"
            title="Why Choose Premium Packs?"
            subtitle="Get more value with curated bundles that include merchandise, tickets, and exclusive perks."
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {premiumPackBenefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-3xl">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Example Pack */}
          <AnimatedSection delay={0.4}>
            <div className="mt-16 max-w-2xl mx-auto rounded-2xl bg-white p-8 shadow-xl border-4 border-purple-300">
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                  EXAMPLE PACK
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Artist Starter Pack</h3>
                <div className="text-4xl font-bold text-[#FF5656] mb-4">$29.99</div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Official Artist T-Shirt</span>
                  <span className="font-semibold text-gray-900">✓ Included</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Signed Poster</span>
                  <span className="font-semibold text-gray-900">✓ Included</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Gacha Draw Tickets</span>
                  <span className="font-semibold text-[#FF5656]">+5 Tickets</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">Bonus Diamonds</span>
                  <span className="font-semibold text-[#FF5656]">+500 💎</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mb-4">
                Pay with Klarna: 4 interest-free payments of $7.50
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Payment & Shipping */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="💳 Shopping Experience"
            title="Safe, Easy, and Convenient"
            subtitle="We've made shopping as smooth as possible with secure payments and fast shipping."
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {paymentFeatures.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <div className="rounded-xl bg-white p-6 shadow-md border border-gray-200">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Ready to Shop?"
        description="Browse our exclusive collection of artist merchandise and premium packs. Support independent musicians today!"
        primaryButton={{ text: 'Visit Store', href: '/register' }}
        secondaryButton={{ text: 'Learn More', href: '/how-it-works' }}
      />
    </div>
  )
}

