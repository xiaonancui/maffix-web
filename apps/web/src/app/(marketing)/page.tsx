import dynamic from 'next/dynamic'
import SectionHeading from '@/components/marketing/SectionHeading'
import FloatingElements from '@/components/marketing/FloatingElements'
// import HomepageGate from '@/components/marketing/HomepageGate' // Disabled: Removed gate to show marketing content
import { generateMetadata as generateSEOMetadata, generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo'

// Dynamic imports for components with animations
const HeroFullScreen = dynamic(() => import('@/components/marketing/HeroFullScreen'), {
  loading: () => <div className="h-screen bg-black" />,
})
const FeatureCardEnhanced = dynamic(() => import('@/components/marketing/FeatureCardEnhanced'))
const ButtonEnhanced = dynamic(() => import('@/components/marketing/ButtonEnhanced'))
const AnimatedSection = dynamic(() => import('@/components/marketing/AnimatedSection'))

export const metadata = generateSEOMetadata({
  title: 'Maffix - Independent Musician Fan Engagement Platform',
  description:
    'Connect with your favorite independent musicians through gamified missions, exclusive prizes, and community engagement. Earn diamonds, draw prizes, and support artists on TikTok.',
  keywords: [
    'independent musicians',
    'fan engagement',
    'TikTok missions',
    'gacha system',
    'music community',
    'artist support',
  ],
  url: '/',
})

const features = [
  {
    icon: '🎰',
    title: 'Gacha Prize System',
    description:
      'Draw exclusive prizes with our exciting gacha system. SSR guarantee on 10x draws, collect rare items, and win amazing rewards from your favorite artists.',
    href: '/features/gacha',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🎯',
    title: 'TikTok Missions',
    description:
      'Complete fun missions on TikTok to earn diamonds. Follow, like, share, and use audio tracks to support artists while earning rewards.',
    href: '/features/missions',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🛍️',
    title: 'Exclusive Merchandise',
    description:
      'Shop official artist merchandise and premium packs. Get guaranteed items plus bonus draw tickets with every purchase.',
    href: '/features/store',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: '👥',
    title: 'Fan Community',
    description:
      'Join a vibrant community of music lovers. Connect with other fans, share your collection, and engage directly with artists.',
    href: '/features/community',
    gradient: 'from-green-500 to-teal-500',
  },
]

const testimonials = [
  {
    quote:
      "Maffix has completely changed how I support my favorite artists. The missions are fun, and I've won some amazing prizes!",
    author: {
      name: 'Sarah Chen',
      role: 'Music Enthusiast',
      avatar: '/avatars/placeholder.svg',
    },
    rating: 5,
  },
  {
    quote:
      'As an independent artist, Maffix helps me connect with my fans in a whole new way. The engagement is incredible!',
    author: {
      name: 'Marcus Rodriguez',
      role: 'Independent Artist',
      avatar: '/avatars/placeholder.svg',
    },
    rating: 5,
  },
  {
    quote:
      'The gacha system is addictive in the best way! I love collecting rare items and supporting artists at the same time.',
    author: {
      name: 'Emily Park',
      role: 'Collector & Fan',
      avatar: '/avatars/placeholder.svg',
    },
    rating: 5,
  },
]

const stats = [
  { value: '10K+', label: 'Active Fans' },
  { value: '500+', label: 'Artists' },
  { value: '1M+', label: 'Missions Completed' },
  { value: '50K+', label: 'Prizes Won' },
]

export default function HomePage() {
  return (
    <div className="bg-black">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }}
      />

      {/* Hero Section - Full Screen with Floating Elements */}
        <div className="relative">
          <FloatingElements />
          <HeroFullScreen
            subtitle="🎉 Join the Music Revolution"
            title={
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="block text-white">Connect with</span>
                <span className="block text-white">
                  Independent Musicians
                </span>
              </h1>
            }
            description="Complete TikTok missions, draw exclusive prizes, and be part of a thriving community of music lovers."
            primaryCTA={{
              text: 'Get Started Free',
              href: '/register',
              icon: '→',
            }}
            secondaryCTA={{
              text: 'Watch Demo',
              href: '/how-it-works',
              icon: '▶',
            }}
            stats={stats}
            backgroundVideo="/maf-bg-video.mp4"
            backgroundGradient="from-black via-gray-900 to-black"
          />
        </div>

        {/* Features Section - Alternating Layout */}
        <section className="py-24 sm:py-32 bg-gray-950">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              badge="✨ Features"
              title="Everything You Need to Support Your Favorite Artists"
              subtitle="Discover our gamified platform designed to bring fans and musicians closer together."
            />

            <div className="mt-20 space-y-24">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Feature Image/Icon */}
                  <div className="flex-1">
                    <div className="relative w-full aspect-square max-w-md mx-auto bg-gray-800 rounded-3xl p-1">
                      <div className="w-full h-full bg-gray-900 rounded-3xl flex items-center justify-center">
                        <span className="text-9xl animate-float-up">{feature.icon}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-4xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                      {feature.description}
                    </p>
                    <ButtonEnhanced
                      href={feature.href}
                      variant="primary"
                      size="lg"
                      icon={<span>→</span>}
                      glow
                    >
                      Learn More
                    </ButtonEnhanced>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Enhanced Cards */}
        <section className="py-24 sm:py-32 bg-gray-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                💬 Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Loved by Fans and Artists
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                See what our community has to say about their Maffix experience.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <FeatureCardEnhanced
                  key={testimonial.author.name}
                  variant="testimonial"
                  title={testimonial.author.name}
                  description={testimonial.quote}
                  author={testimonial.author}
                  rating={testimonial.rating}
                  icon="⭐"
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 sm:py-32 bg-black overflow-hidden">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of fans supporting independent musicians. Sign up now and get{' '}
              <span className="text-[#FF5656] font-bold">100 free diamonds!</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ButtonEnhanced
                href="/register"
                variant="primary"
                size="lg"
                icon={<span>→</span>}
                ripple
                glow
              >
                Create Free Account
              </ButtonEnhanced>
              <ButtonEnhanced
                href="/about"
                variant="ghost"
                size="lg"
                icon={<span>→</span>}
              >
                Learn More
              </ButtonEnhanced>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}

