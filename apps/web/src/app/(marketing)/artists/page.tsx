import Hero from '@/components/marketing/Hero'
import SectionHeading from '@/components/marketing/SectionHeading'
import AnimatedSection from '@/components/marketing/AnimatedSection'
import CTA from '@/components/marketing/CTA'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'Featured Artists - Independent Musicians on Maffix',
  description:
    'Discover talented independent musicians on Maffix. See how artists are growing their fanbase and earning through our platform.',
  keywords: ['independent artists', 'musicians', 'featured artists', 'music creators'],
  url: '/artists',
})

const featuredArtists = [
  {
    name: 'Luna Rivers',
    genre: 'Indie Pop',
    followers: '25K',
    missions: '150+',
    description: 'Dreamy vocals meet electronic beats. Creating music that makes you feel.',
    emoji: '🎤',
    stats: { fans: '2.5K', earnings: '$5K+', engagement: '95%' },
  },
  {
    name: 'The Midnight Collective',
    genre: 'Alternative Rock',
    followers: '40K',
    missions: '200+',
    description: 'Raw energy and honest lyrics. Rock music for the modern age.',
    emoji: '🎸',
    stats: { fans: '4K', earnings: '$8K+', engagement: '92%' },
  },
  {
    name: 'DJ Neon',
    genre: 'Electronic/EDM',
    followers: '60K',
    missions: '300+',
    description: 'High-energy beats that light up the dance floor.',
    emoji: '🎧',
    stats: { fans: '6K', earnings: '$12K+', engagement: '98%' },
  },
  {
    name: 'Acoustic Soul',
    genre: 'Folk/Acoustic',
    followers: '18K',
    missions: '120+',
    description: 'Heartfelt songs with just a guitar and a story to tell.',
    emoji: '🎻',
    stats: { fans: '1.8K', earnings: '$3K+', engagement: '90%' },
  },
  {
    name: 'Urban Poets',
    genre: 'Hip Hop/Rap',
    followers: '35K',
    missions: '180+',
    description: 'Conscious rap with powerful messages and sick beats.',
    emoji: '🎙️',
    stats: { fans: '3.5K', earnings: '$7K+', engagement: '94%' },
  },
  {
    name: 'Synthwave Dreams',
    genre: 'Synthwave/Retro',
    followers: '28K',
    missions: '160+',
    description: '80s nostalgia meets modern production. Retro-futuristic vibes.',
    emoji: '🌆',
    stats: { fans: '2.8K', earnings: '$6K+', engagement: '93%' },
  },
]

const benefits = [
  {
    icon: '💰',
    title: 'Direct Revenue',
    description: 'Earn from merchandise sales, premium packs, and fan engagement. Keep 85% of all earnings.',
  },
  {
    icon: '📈',
    title: 'Grow Your Fanbase',
    description: 'Our mission system encourages fans to follow, like, and share your content on TikTok.',
  },
  {
    icon: '🎁',
    title: 'Exclusive Merchandise',
    description: 'Create and sell custom merchandise and premium packs directly to your fans.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Track your performance, fan engagement, and earnings in real-time.',
  },
  {
    icon: '🤝',
    title: 'Community Support',
    description: 'Join a network of independent artists sharing tips, collaborating, and growing together.',
  },
  {
    icon: '🎯',
    title: 'Targeted Missions',
    description: 'Create custom missions for your fans to complete, driving specific engagement goals.',
  },
]

const successStories = [
  {
    artist: 'Luna Rivers',
    quote: 'Maffix helped me turn my TikTok following into a sustainable income. In 3 months, I earned more than a year of streaming royalties.',
    result: '$5,000+ earned in 3 months',
  },
  {
    artist: 'The Midnight Collective',
    quote: 'The mission system is genius. Our fans love completing challenges, and we love the engagement boost. Win-win!',
    result: '300% increase in TikTok engagement',
  },
  {
    artist: 'DJ Neon',
    quote: 'Premium packs changed everything. Fans get exclusive content and merch, and I get predictable monthly revenue.',
    result: '$12,000+ in premium pack sales',
  },
]

export default function ArtistsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero
        badge="🎵 Featured Artists"
        title="Meet the Independent Musicians Thriving on Maffix"
        subtitle="Discover Talent"
        description="From indie pop to hip hop, our platform hosts diverse independent artists who are building sustainable careers through fan engagement."
        primaryCTA={{ text: 'Join as Artist', href: '/register?type=artist' }}
        secondaryCTA={{ text: 'Browse All Artists', href: '/dashboard' }}
      />

      {/* Featured Artists Grid */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="⭐ Featured"
            title="Top Artists on Maffix"
            subtitle="Discover talented musicians and support their journey"
            centered
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArtists.map((artist, index) => (
              <AnimatedSection key={artist.name} delay={index * 0.1}>
                <div className="relative rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 hover:shadow-lg transition-all">
                  <div className="text-6xl mb-4">{artist.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{artist.name}</h3>
                  <p className="text-[#FF5656] font-semibold mb-3">{artist.genre}</p>
                  <p className="text-gray-600 mb-6">{artist.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                    <div>
                      <div className="text-2xl font-bold text-[#FF5656]">{artist.stats.fans}</div>
                      <div className="text-xs text-gray-500">Fans</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#FF5656]">{artist.stats.earnings}</div>
                      <div className="text-xs text-gray-500">Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{artist.stats.engagement}</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <span>📱 {artist.followers} TikTok</span>
                    <span>•</span>
                    <span>🎯 {artist.missions} Missions</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Artists */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="💎 Benefits"
            title="Why Artists Choose Maffix"
            subtitle="Everything you need to grow and monetize your fanbase"
            centered
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA
        title="Ready to Grow Your Music Career?"
        description="Join hundreds of independent artists who are building sustainable careers on Maffix."
        primaryButton={{ text: 'Apply as Artist', href: '/register?type=artist' }}
        secondaryButton={{ text: 'Learn More', href: '/how-it-works' }}
      />
    </div>
  )
}

