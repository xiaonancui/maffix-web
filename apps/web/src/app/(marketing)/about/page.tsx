import dynamic from 'next/dynamic'
import Image from 'next/image'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

const Timeline = dynamic(() => import('@/components/marketing/Timeline'))
const FeatureCardEnhanced = dynamic(() => import('@/components/marketing/FeatureCardEnhanced'))
const ButtonEnhanced = dynamic(() => import('@/components/marketing/ButtonEnhanced'))

export const metadata = generateSEOMetadata({
  title: 'About Us - Our Mission to Connect Musicians and Fans',
  description:
    'Learn about Maffix, our mission to revolutionize fan engagement for independent musicians, and the team behind the platform.',
  keywords: ['about maffix', 'our mission', 'team', 'independent music platform'],
  url: '/about',
})

const values = [
  {
    icon: '🎵',
    title: 'Artist First',
    description: 'We prioritize the success and growth of independent musicians, providing them with tools to engage and monetize their fanbase.',
  },
  {
    icon: '💎',
    title: 'Fair Rewards',
    description: 'Fans earn real value for their support through our transparent diamond system and guaranteed prize mechanics.',
  },
  {
    icon: '🤝',
    title: 'Community Driven',
    description: 'We build features based on feedback from both artists and fans, creating a platform that serves everyone.',
  },
  {
    icon: '🚀',
    title: 'Innovation',
    description: 'We combine gamification, social media, and e-commerce to create a unique fan engagement experience.',
  },
]

const milestones = [
  {
    year: '2024 Q1',
    title: 'Platform Launch',
    description: 'Maffix officially launches with 50+ independent artists and 1,000+ early adopters.',
    icon: '🚀',
  },
  {
    year: '2024 Q2',
    title: 'TikTok Integration',
    description: 'Integrated TikTok missions, allowing fans to earn diamonds through social media engagement.',
    icon: '🎵',
  },
  {
    year: '2024 Q3',
    title: 'Gacha System',
    description: 'Launched our innovative gacha prize system with SSR guarantees and exclusive merchandise.',
    icon: '🎰',
  },
  {
    year: '2024 Q4',
    title: 'Community Growth',
    description: 'Reached 10,000+ active fans and 500+ independent artists on the platform.',
    icon: '🌟',
  },
]

const team = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    bio: 'Former music industry executive passionate about empowering independent artists.',
    emoji: '👨‍💼',
  },
  {
    name: 'Sarah Kim',
    role: 'Head of Product',
    bio: 'Product designer with 10+ years experience in gamification and user engagement.',
    emoji: '👩‍💻',
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Artist Relations',
    bio: 'Independent musician and advocate for fair compensation in the music industry.',
    emoji: '🎸',
  },
  {
    name: 'Emily Zhang',
    role: 'Head of Engineering',
    bio: 'Full-stack engineer specializing in scalable platforms and real-time systems.',
    emoji: '👩‍🔬',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-images/austin-neill-hgO1wFPXl3I-unsplash.jpg"
            alt="Music performance"
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
            🌟 About Maffix
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Revolutionizing Fan Engagement
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            We believe independent musicians deserve better tools to connect with and monetize their fanbase. Maffix combines gamification, social media, and e-commerce to create meaningful engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonEnhanced href="/register" variant="primary" size="lg" icon={<span>→</span>} glow>
              Join Us
            </ButtonEnhanced>
            <ButtonEnhanced href="/artists" variant="ghost" size="lg" icon={<span>→</span>}>
              For Artists
            </ButtonEnhanced>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built by Musicians, for Musicians
            </h2>
          </div>
          <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
            <p>
              Maffix was born from a simple observation: independent musicians work incredibly hard to build their fanbase on social media,
              but struggle to convert that engagement into sustainable income. Traditional platforms take large cuts, and fans have limited
              ways to support their favorite artists beyond streaming and occasional merch purchases.
            </p>
            <p>
              We created Maffix to change that. By gamifying fan engagement and rewarding both artists and fans, we&apos;ve built a platform
              where everyone wins. Artists get more engaged fans and direct revenue, while fans earn rewards for their support and get
              access to exclusive content and prizes.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 sm:py-32 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              💡 Our Values
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <FeatureCardEnhanced
                key={value.title}
                variant="default"
                icon={value.icon}
                title={value.title}
                description={value.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              📅 Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Milestones & Achievements
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From launch to today, here&apos;s how we&apos;ve grown
            </p>
          </div>

          <Timeline items={milestones} />
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 sm:py-32 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              👥 Our Team
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet the People Behind Maffix
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="text-center group"
              >
                <div className="mb-4 text-8xl animate-float-up" style={{ animationDelay: `${index * 100}ms` }}>
                  {member.emoji}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[#FF5656] font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gray-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Whether you&apos;re an artist or a fan, there&apos;s a place for you on Maffix.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonEnhanced href="/register" variant="primary" size="lg" icon={<span>→</span>} ripple glow>
              Get Started
            </ButtonEnhanced>
            <ButtonEnhanced href="/how-it-works" variant="ghost" size="lg" icon={<span>→</span>}>
              Learn More
            </ButtonEnhanced>
          </div>
        </div>
      </section>
    </div>
  )
}

