import dynamic from 'next/dynamic'
import Image from 'next/image'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Check, Music, Gem, Users, Trophy, Rocket, Star } from 'lucide-react'

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

type Value = {
  iconName: 'Music' | 'Gem' | 'Users' | 'Rocket'
  title: string
  description: string
  color: 'red' | 'blue' | 'yellow' | 'green' | 'purple'
}

type Milestone = {
  year: string
  title: string
  description: string
  icon: string
}

type TeamMember = {
  name: string
  role: string
  bio: string
  icon: React.ReactNode
}

const values: Value[] = [
  {
    iconName: 'Music',
    title: 'Artist First',
    description: 'We prioritize to success and growth of independent musicians, providing them with tools to engage and monetize their fanbase.',
    color: 'red',
  },
  {
    iconName: 'Gem',
    title: 'Fair Rewards',
    description: 'Fans earn real value for their support through our transparent diamond system and guaranteed prize mechanics.',
    color: 'yellow',
  },
  {
    iconName: 'Users',
    title: 'Community Driven',
    description: 'We build features based on feedback from both artists and fans, creating a platform that serves everyone.',
    color: 'blue',
  },
  {
    iconName: 'Rocket',
    title: 'Innovation',
    description: 'We combine gamification, social media, and e-commerce to create a unique fan engagement experience.',
    color: 'purple',
  },
]

const milestones: Milestone[] = [
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
    icon: '🏆',
  },
  {
    year: '2024 Q4',
    title: 'Community Growth',
    description: 'Reached 10,000+ active fans and 500+ independent artists on platform.',
    icon: '🌟',
  },
]

const team: TeamMember[] = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    bio: 'Former music industry executive passionate about empowering independent artists.',
    icon: <Rocket className="h-8 w-8" />,
  },
  {
    name: 'Sarah Kim',
    role: 'Head of Product',
    bio: 'Product designer with 10+ years experience in gamification and user engagement.',
    icon: <Music className="h-8 w-8" />,
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Artist Relations',
    bio: 'Independent musician and advocate for fair compensation in the music industry.',
    icon: <Trophy className="h-8 w-8" />,
  },
  {
    name: 'Emily Zhang',
    role: 'Head of Engineering',
    bio: 'Full-stack engineer specializing in scalable platforms and real-time systems.',
    icon: <Gem className="h-8 w-8" />,
  },
]

export default function AboutPage() {
  return (
    <div className="bg-black">
      {/* Hero Section - Improved Padding */}
      <section className="relative py-32 md:py-40 overflow-hidden bg-black">
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
          <div className="absolute inset-0 bg-black" />
        </div>

        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF2D55] text-white mx-auto mb-6">
            <Star className="h-6 w-6" />
          </div>
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

      {/* Mission Section - Improved Padding */}
      <section className="py-32 md:py-40 bg-black">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#E63946]/20 text-[#E63946] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
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

      {/* Values Section - Improved Padding */}
      <section className="py-32 md:py-40 bg-black">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#E63946]/20 text-[#E63946] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              Our Values
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What We Stand For
            </h2>
            <p className="text-xl text-[#A0A0A0] max-w-2xl mx-auto leading-relaxed">
              The principles that guide everything we do
            </p>
          </div>

          <div className="mt-20 grid gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <FeatureCardEnhanced
                key={value.title}
                variant="default"
                iconName={value.iconName}
                title={value.title}
                description={value.description}
                color={value.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section - Improved Padding */}
      <section className="py-32 md:py-40 bg-black">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#007AFF] text-white rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Milestones & Achievements
            </h2>
            <p className="text-xl text-[#A0A0A0] max-w-2xl mx-auto leading-relaxed">
              From launch to today, here&apos;s how we&apos;ve grown
            </p>
          </div>

          <Timeline items={milestones} />
        </div>
      </section>

      {/* Team Section - Improved Padding & Lucide Icons */}
      <section className="py-32 md:py-40 bg-black">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#007AFF] text-white rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              Our Team
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet the People Behind Maffix
            </h2>
          </div>

          <div className="mt-20 grid gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="text-center group"
              >
                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-xl bg-[#111111] border border-[#333333] group-hover:border-[#FF2D55] transition-colors">
                  <div className="text-[#FF2D55]">
                    {member.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[#007AFF] font-semibold mb-2 text-sm">{member.role}</p>
                <p className="text-sm text-[#B3B3B3]">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Improved Padding */}
      <section className="relative py-32 md:py-40 overflow-hidden bg-black">
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
