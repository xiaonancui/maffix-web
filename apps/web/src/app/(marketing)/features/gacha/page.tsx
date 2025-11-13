import Hero from '@/components/marketing/Hero'
import SectionHeading from '@/components/marketing/SectionHeading'
import AnimatedSection from '@/components/marketing/AnimatedSection'
import CTA from '@/components/marketing/CTA'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import Link from 'next/link'

export const metadata = generateSEOMetadata({
  title: 'Gacha Prize System - Win Exclusive Rewards',
  description:
    'Experience our exciting gacha system with guaranteed SSR items on 10x draws. Collect rare prizes, exclusive merchandise, and limited edition items from independent artists.',
  keywords: ['gacha system', 'prize draws', 'SSR guarantee', 'rare items', 'collectibles'],
  url: '/features/gacha',
})

const rarityTiers = [
  {
    name: 'SSR (Super Super Rare)',
    probability: '0.6%',
    color: 'from-yellow-400 to-orange-500',
    description: 'Ultra-rare items, exclusive signed merchandise, and limited edition collectibles.',
  },
  {
    name: 'Legendary',
    probability: '2%',
    color: 'from-purple-500 to-pink-500',
    description: 'Legendary items, premium merchandise, and special edition products.',
  },
  {
    name: 'Epic',
    probability: '7%',
    color: 'from-blue-500 to-purple-500',
    description: 'Epic quality items, official merchandise, and exclusive content.',
  },
  {
    name: 'Rare',
    probability: '20%',
    color: 'from-green-500 to-blue-500',
    description: 'Rare items, quality merchandise, and collectible content.',
  },
  {
    name: 'Common',
    probability: '70.4%',
    color: 'from-gray-400 to-gray-500',
    description: 'Common items, digital content, and basic rewards.',
  },
]

const features = [
  {
    icon: '🎯',
    title: 'SSR Guarantee',
    description: 'Every 10x draw guarantees at least one SSR or higher rarity item. No bad luck streaks!',
  },
  {
    icon: '📊',
    title: 'Pity System',
    description: 'Guaranteed SSR within 90 pulls. Your pity counter carries over between draws.',
  },
  {
    icon: '🎫',
    title: 'Free Tickets',
    description: 'Earn free draw tickets through missions, events, and premium pack purchases.',
  },
  {
    icon: '💎',
    title: 'Diamond Draws',
    description: 'Use diamonds earned from missions for single (100💎) or 10x draws (900💎).',
  },
]

export default function GachaFeaturePage() {
  return (
    <div className="bg-white">
      <Hero
        badge="🎰 Gacha System"
        title="Win Exclusive Prizes from Your Favorite Artists"
        subtitle="Fair odds, guaranteed rewards, and exciting collectibles"
        description="Our gacha system combines the thrill of prize draws with guaranteed rewards. Every pull brings you closer to rare items and exclusive merchandise."
        primaryCTA={{ text: 'Try Gacha Now', href: '/register' }}
        secondaryCTA={{ text: 'View All Features', href: '/features' }}
      />

      {/* How It Works */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="🎯 How It Works"
            title="Simple, Fair, and Exciting"
            subtitle="Our gacha system is designed to be transparent and rewarding for all players."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-3xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Rarity Tiers */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="⭐ Rarity Tiers"
            title="Five Levels of Excitement"
            subtitle="Each rarity tier offers unique rewards and collectibles. The rarer the item, the more exclusive it is."
          />

          <div className="mt-16 space-y-6">
            {rarityTiers.map((tier, index) => (
              <AnimatedSection key={tier.name} delay={index * 0.1}>
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${tier.color}`} />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                          <p className="text-sm text-gray-600">{tier.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#FF5656]">{tier.probability}</div>
                      <div className="text-sm text-gray-500">Drop Rate</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="💎 Pricing"
            title="Affordable and Rewarding"
            subtitle="Choose between single draws or save with 10x draws that guarantee SSR items."
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
            <AnimatedSection delay={0}>
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 text-center">
                <div className="text-4xl mb-4">🎰</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Single Draw</h3>
                <div className="text-4xl font-bold text-[#FF5656] mb-4">100 💎</div>
                <p className="text-gray-600 mb-6">Try your luck with a single draw. Perfect for testing the waters.</p>
                <Link
                  href="/register"
                  className="block w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Drawing
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl border-4 border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 p-8 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  BEST VALUE
                </div>
                <div className="text-4xl mb-4">🎰✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">10x Draw</h3>
                <div className="text-4xl font-bold text-[#FF5656] mb-4">900 💎</div>
                <p className="text-gray-600 mb-2">Save 100 diamonds and get guaranteed SSR!</p>
                <p className="text-sm text-[#FF5656] font-semibold mb-6">⭐ At least 1 SSR or higher guaranteed</p>
                <Link
                  href="/register"
                  className="block w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Drawing
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTA
        title="Ready to Win Amazing Prizes?"
        description="Sign up now and get 100 free diamonds to start your gacha journey!"
        primaryButton={{ text: 'Get Free Diamonds', href: '/register' }}
        secondaryButton={{ text: 'Learn More', href: '/how-it-works' }}
      />
    </div>
  )
}

