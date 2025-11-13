import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

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

const mainFeatures = [
  {
    icon: '🎰',
    title: 'Gacha Prize System',
    description:
      'Experience the thrill of our gacha system with guaranteed SSR items on 10x draws. Collect rare prizes, exclusive merchandise, and limited edition items from your favorite artists.',
    href: '/features/gacha',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🎯',
    title: 'TikTok Missions',
    description:
      'Complete engaging missions on TikTok to earn diamonds. Follow artists, like videos, share content, and use audio tracks. Every action supports musicians and rewards you.',
    href: '/features/missions',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🛍️',
    title: 'Exclusive Store',
    description:
      'Shop official artist merchandise and premium packs. Get guaranteed items, bonus draw tickets, and exclusive access to limited edition products.',
    href: '/features/store',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: '👥',
    title: 'Fan Community',
    description:
      'Join thousands of music lovers in our vibrant community. Share your collection, connect with other fans, and engage directly with independent artists.',
    href: '/features/community',
    gradient: 'from-green-500 to-teal-500',
  },
]

const additionalFeatures = [
  {
    icon: '💎',
    title: 'Virtual Currency',
    description: 'Earn diamonds through missions and use them for gacha draws and exclusive purchases.',
  },
  {
    icon: '🎫',
    title: 'Draw Tickets',
    description: 'Get free draw tickets with premium packs and special promotions.',
  },
  {
    icon: '🏆',
    title: 'Rarity System',
    description: 'Collect items across multiple rarity tiers: Common, Rare, Epic, Legendary, and SSR.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Track your missions, collection, and achievements in your personal dashboard.',
  },
  {
    icon: '🎵',
    title: 'Music Releases',
    description: 'Stay updated with the latest releases from independent artists you support.',
  },
  {
    icon: '💳',
    title: 'Secure Payments',
    description: 'Safe and easy payments powered by Klarna for all your purchases.',
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
      {/* Hero Section - Simplified */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
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
          <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            ✨ Platform Features
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Everything You Need to Support Musicians
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
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

      {/* Main Features - Large Cards */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              🎯 Core Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Four Pillars of Fan Engagement
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform is built on four core features designed to create meaningful connections between fans and artists.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {mainFeatures.map((feature, index) => (
              <FeatureCardEnhanced
                key={feature.title}
                variant="default"
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                href={feature.href}
                gradient={feature.gradient}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features - Compact Grid */}
      <section className="py-24 sm:py-32 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              ⚡ More Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Packed with Powerful Tools
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need for an amazing fan experience, all in one platform.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature, index) => (
              <FeatureCardEnhanced
                key={feature.title}
                variant="default"
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              💫 Benefits
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Win-Win for Everyone
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Maffix creates value for both fans and artists in the independent music ecosystem.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl bg-gray-800 border border-gray-700 p-8 hover:border-purple-500 transition-colors">
                <h3 className="text-3xl font-bold text-white mb-6">{benefit.title}</h3>
                <ul className="space-y-4">
                  {benefit.points.map((point) => (
                    <li key={point} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 mr-3 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gray-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Experience All Features?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
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

