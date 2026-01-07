import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Check } from 'lucide-react'

// Dynamic imports for animated components
const FeatureCardEnhanced = dynamic(() => import('@/components/marketing/FeatureCardEnhanced'))
const ButtonEnhanced = dynamic(() => import('@/components/marketing/ButtonEnhanced'))

export const metadata = generateSEOMetadata({
  title: 'Features - Discover What Makes Maffix Special',
  description:
    'Explore Maffix features: Gacha prize system, TikTok missions, exclusive merchandise, and vibrant fan community. Everything you need to support independent musicians.',
  keywords: ['gacha system', 'TikTok missions', 'fan rewards', 'music merchandise', 'fan community'],
  url: '/features',
})

type MainFeature = {
  iconName: 'Dices' | 'Target' | 'ShoppingBag' | 'Users' | 'Gem' | 'Ticket' | 'Trophy' | 'BarChart' | 'Music' | 'CreditCard'
  title: string
  subtitle: string
  description: string
  keyBenefit: string
  href: string
  color: 'red' | 'blue' | 'yellow' | 'green' | 'purple'
  buttonText: string
}

type AdditionalFeature = {
  iconName: 'Dices' | 'Target' | 'ShoppingBag' | 'Users' | 'Gem' | 'Ticket' | 'Trophy' | 'BarChart' | 'Music' | 'CreditCard'
  title: string
  description: string
  color: 'red' | 'blue' | 'yellow' | 'green' | 'purple'
}

const mainFeatures: MainFeature[] = [
  {
    iconName: 'Dices',
    title: 'Gacha System',
    subtitle: 'Win Exclusive Prizes',
    description:
      'Experience the thrill of our gacha system with guaranteed SSR items on 10x draws. Collect rare prizes, exclusive merchandise, and limited edition items from your favorite artists.',
    keyBenefit: '✓ Guaranteed SSR on 10x draws',
    href: '/features/gacha',
    color: 'red',
    buttonText: 'Try Your Luck',
  },
  {
    iconName: 'Target',
    title: 'TikTok Missions',
    subtitle: 'Earn While Supporting',
    description:
      'Complete engaging missions on TikTok to earn diamonds. Follow artists, like videos, share content, and use audio tracks. Every action supports musicians and rewards you.',
    keyBenefit: '✓ Earn diamonds for engagement',
    href: '/features/missions',
    color: 'blue',
    buttonText: 'Start Earning',
  },
  {
    iconName: 'ShoppingBag',
    title: 'Artist Store',
    subtitle: 'Get Premium Items',
    description:
      'Shop official artist merchandise and premium packs. Get guaranteed items, bonus draw tickets, and exclusive access to limited edition products.',
    keyBenefit: '✓ Guaranteed items in packs',
    href: '/features/store',
    color: 'purple',
    buttonText: 'Shop Now',
  },
  {
    iconName: 'Users',
    title: 'Community Hub',
    subtitle: 'Connect with Fans',
    description:
      'Join thousands of music lovers in our vibrant community. Share your collection, connect with other fans, and engage directly with independent artists.',
    keyBenefit: '✓ Direct artist interaction',
    href: '/features/community',
    color: 'yellow',
    buttonText: 'Join Community',
  },
]

const additionalFeatures: AdditionalFeature[] = [
  {
    iconName: 'Gem',
    title: 'Virtual Currency',
    description: 'Earn diamonds through missions and use them for gacha draws and exclusive purchases.',
    color: 'yellow',
  },
  {
    iconName: 'Ticket',
    title: 'Draw Tickets',
    description: 'Get free draw tickets with premium packs and special promotions.',
    color: 'red',
  },
  {
    iconName: 'Trophy',
    title: 'Rarity System',
    description: 'Collect items across multiple rarity tiers: Common, Rare, Epic, Legendary, and SSR.',
    color: 'purple',
  },
  {
    iconName: 'BarChart',
    title: 'Progress Tracking',
    description: 'Track your missions, collection, and achievements in your personal dashboard.',
    color: 'blue',
  },
  {
    iconName: 'Music',
    title: 'Music Releases',
    description: 'Stay updated with the latest releases from independent artists you support.',
    color: 'red',
  },
  {
    iconName: 'CreditCard',
    title: 'Secure Payments',
    description: 'Safe and easy payments powered by Klarna for all your purchases.',
    color: 'blue',
  },
]

const benefits = [
  {
    title: 'For Fans',
    points: [
      'Earn rewards for supporting your favorite artists',
      'Win exclusive prizes and merchandise',
      'Connect with a community of music lovers',
      'Get early access to new releases',
    ],
  },
  {
    title: 'For Artists',
    points: [
      'Increase your TikTok engagement organically',
      'Build a loyal fan base',
      'Monetize your content effectively',
      'Direct connection with your supporters',
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="bg-black">
      {/* Hero Section - Improved Padding */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-images/cheering-crowd-at-concert-enjoying-music-performan-2025-03-15-06-48-54-utc.jpg"
            alt="Concert crowd"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-[#007AFF]/20 text-[#007AFF] rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Platform Features
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Everything You Need to Support Musicians
          </h1>
          <p className="text-xl text-[#B3B3B3] mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover how Maffix brings fans and artists together through innovative features and rewarding experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonEnhanced href="/register" variant="primary" size="lg" icon={<span>→</span>} glow>
              Get Started
            </ButtonEnhanced>
            <ButtonEnhanced href="/how-it-works" variant="ghost" size="lg" icon={<span>→</span>}>
              How It Works
            </ButtonEnhanced>
          </div>
        </div>
      </section>

      {/* Main Features - Large Cards - Improved Spacing */}
      <section className="py-32 md:py-40">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#007AFF]/20 text-[#007AFF] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              Core Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Four Pillars of Fan Engagement
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-2xl mx-auto leading-relaxed">
              Our platform is built on four core features designed to create meaningful connections between fans and artists.
            </p>
          </div>

          <div className="mt-20 grid gap-10 md:gap-12 sm:grid-cols-2">
            {mainFeatures.map((feature, index) => (
              <FeatureCardEnhanced
                key={feature.title}
                variant="default"
                iconName={feature.iconName}
                title={feature.title}
                subtitle={feature.subtitle}
                description={feature.description}
                keyBenefit={feature.keyBenefit}
                href={feature.href}
                color={feature.color}
                buttonText={feature.buttonText}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features - Compact Grid - Improved Spacing */}
      <section className="py-32 md:py-40 bg-black">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#007AFF]/20 text-[#007AFF] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              More Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Packed with Powerful Tools
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-2xl mx-auto leading-relaxed">
              Everything you need for an amazing fan experience, all in one platform.
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature, index) => (
              <FeatureCardEnhanced
                key={feature.title}
                variant="default"
                iconName={feature.iconName}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Improved Spacing */}
      <section className="py-32 md:py-40">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#007AFF]/20 text-[#007AFF] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              Benefits
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Win-Win for Everyone
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-2xl mx-auto leading-relaxed">
              Maffix creates value for both fans and artists in the independent music ecosystem.
            </p>
          </div>

          <div className="mt-20 grid gap-10 md:gap-12 lg:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl bg-[#111111] border border-[#333333] p-10 hover:border-[#FF2D55] transition-colors">
                <h3 className="text-3xl font-bold text-white mb-6">{benefit.title}</h3>
                <ul className="space-y-4">
                  {benefit.points.map((point) => (
                    <li key={point} className="flex items-start">
                      <Check className="h-6 w-6 text-[#00D664] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-[#B3B3B3]">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Improved Padding */}
      <section className="relative py-32 md:py-40 overflow-hidden bg-black">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Experience All Features?
          </h2>
          <p className="text-xl text-[#B3B3B3] mb-10 leading-relaxed">
            Join Maffix today and start earning rewards while supporting independent musicians.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonEnhanced href="/register" variant="primary" size="lg" icon={<span>→</span>} ripple glow>
              Create Free Account
            </ButtonEnhanced>
            <ButtonEnhanced href="/membership" variant="ghost" size="lg" icon={<span>→</span>}>
              View Pricing
            </ButtonEnhanced>
          </div>
        </div>
      </section>
    </div>
  )
}

