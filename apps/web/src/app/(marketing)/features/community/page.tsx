import Hero from '@/components/marketing/Hero'
import SectionHeading from '@/components/marketing/SectionHeading'
import AnimatedSection from '@/components/marketing/AnimatedSection'
import CTA from '@/components/marketing/CTA'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'Fan Community - Connect with Music Lovers',
  description:
    'Join thousands of music lovers in our vibrant community. Share your collection, connect with other fans, and engage directly with independent artists.',
  keywords: ['fan community', 'music lovers', 'artist engagement', 'social features', 'collector community'],
  url: '/features/community',
})

const communityFeatures = [
  {
    icon: '👥',
    title: 'Connect with Fans',
    description: 'Meet other fans who share your music taste. Make friends, share experiences, and grow together.',
  },
  {
    icon: '🎨',
    title: 'Showcase Collection',
    description: 'Display your rare prizes and merchandise. Show off your SSR items and collection achievements.',
  },
  {
    icon: '💬',
    title: 'Direct Artist Chat',
    description: 'Engage directly with independent musicians. Get updates, ask questions, and build relationships.',
  },
  {
    icon: '🏆',
    title: 'Leaderboards',
    description: 'Compete with other fans on collection size, mission completion, and community engagement.',
  },
  {
    icon: '🎉',
    title: 'Community Events',
    description: 'Participate in exclusive events, contests, and giveaways. Win prizes and meet artists.',
  },
  {
    icon: '📢',
    title: 'Fan Clubs',
    description: 'Join or create fan clubs for your favorite artists. Organize meetups and group activities.',
  },
]

const benefits = [
  'Share your gacha pulls and celebrate rare wins',
  'Trade duplicate items with other collectors',
  'Get early access to new artist releases',
  'Participate in community challenges',
  'Vote on future platform features',
  'Exclusive community-only rewards',
]

export default function CommunityFeaturePage() {
  return (
    <div className="bg-white">
      <Hero
        badge="👥 Fan Community"
        title="Join a Vibrant Community of Music Lovers"
        subtitle="Connect, share, and grow together"
        description="Be part of a thriving community where fans and artists come together. Share your passion for independent music and make lasting connections."
        primaryCTA={{ text: 'Join Community', href: '/register' }}
        secondaryCTA={{ text: 'View All Features', href: '/features' }}
      />

      {/* Community Features */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="✨ Features"
            title="Everything You Need to Connect"
            subtitle="Our community features are designed to bring fans and artists closer together."
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {communityFeatures.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 p-6 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="🎁 Benefits"
            title="Why Join Our Community?"
            subtitle="Being part of the Maffix community comes with exclusive perks and opportunities."
          />

          <div className="mt-16 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-[#FF5656] mr-3 flex-shrink-0 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="📊 Community Stats"
            title="A Growing Community"
            subtitle="Join thousands of fans already supporting independent musicians."
          />

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '10K+', label: 'Active Members' },
              { value: '500+', label: 'Artists' },
              { value: '50+', label: 'Fan Clubs' },
              { value: '100+', label: 'Daily Events' },
            ].map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Ready to Join the Community?"
        description="Connect with music lovers and artists today. Sign up and become part of something special!"
        primaryButton={{ text: 'Create Account', href: '/register' }}
        secondaryButton={{ text: 'Learn More', href: '/how-it-works' }}
      />
    </div>
  )
}

