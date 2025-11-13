import Hero from '@/components/marketing/Hero'
import SectionHeading from '@/components/marketing/SectionHeading'
import AnimatedSection from '@/components/marketing/AnimatedSection'
import CTA from '@/components/marketing/CTA'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'TikTok Missions - Earn Diamonds by Supporting Artists',
  description:
    'Complete fun TikTok missions to earn diamonds. Follow artists, like videos, share content, and use audio tracks. Every action supports musicians and rewards you.',
  keywords: ['TikTok missions', 'earn diamonds', 'support artists', 'fan engagement', 'rewards'],
  url: '/features/missions',
})

const missionTypes = [
  {
    icon: '👤',
    title: 'Follow Mission',
    reward: '50 💎',
    description: 'Follow an artist on TikTok and earn diamonds. Help artists grow their audience.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '❤️',
    title: 'Like Mission',
    reward: '30 💎',
    description: 'Like specific videos from artists. Show your support and earn rewards.',
    color: 'from-pink-500 to-red-500',
  },
  {
    icon: '🔄',
    title: 'Share Mission',
    reward: '100 💎',
    description: 'Share artist content with your followers. Spread the music and earn big.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🎵',
    title: 'Audio Use Mission',
    reward: '150 💎',
    description: 'Create content using artist audio tracks. The most rewarding mission type.',
    color: 'from-orange-500 to-yellow-500',
  },
]

const howItWorks = [
  {
    step: '1',
    title: 'Link Your TikTok',
    description: 'Connect your TikTok account securely to Maffix. We only need read access to verify missions.',
  },
  {
    step: '2',
    title: 'Choose Missions',
    description: 'Browse available missions from your favorite artists. Pick the ones you want to complete.',
  },
  {
    step: '3',
    title: 'Complete on TikTok',
    description: 'Go to TikTok and complete the mission. Follow, like, share, or use audio as required.',
  },
  {
    step: '4',
    title: 'Earn Diamonds',
    description: 'Return to Maffix and claim your rewards. Diamonds are credited instantly after verification.',
  },
]

const benefits = [
  {
    icon: '💎',
    title: 'Earn While You Engage',
    description: 'Get rewarded for actions you already do on TikTok. Support artists and earn diamonds.',
  },
  {
    icon: '🎯',
    title: 'Daily Missions',
    description: 'New missions added daily. Never run out of ways to earn diamonds and support artists.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'We only request read-only access to verify missions. Your account stays safe.',
  },
  {
    icon: '⚡',
    title: 'Instant Verification',
    description: 'Most missions are verified automatically within minutes. Get your rewards fast.',
  },
  {
    icon: '🎁',
    title: 'Bonus Rewards',
    description: 'Complete mission streaks for bonus diamonds. The more you engage, the more you earn.',
  },
  {
    icon: '🌟',
    title: 'Support Real Artists',
    description: 'Every mission directly helps independent musicians grow their TikTok presence.',
  },
]

export default function MissionsFeaturePage() {
  return (
    <div className="bg-white">
      <Hero
        badge="🎯 TikTok Missions"
        title="Earn Diamonds by Supporting Independent Musicians"
        subtitle="Complete missions, earn rewards, help artists grow"
        description="Turn your TikTok engagement into rewards. Every follow, like, share, and audio use earns you diamonds while supporting independent artists."
        primaryCTA={{ text: 'Start Earning', href: '/register' }}
        secondaryCTA={{ text: 'View All Features', href: '/features' }}
      />

      {/* Mission Types */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="📋 Mission Types"
            title="Four Ways to Earn Diamonds"
            subtitle="Choose from different mission types based on your preference. Each type rewards you for supporting artists."
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {missionTypes.map((mission, index) => (
              <AnimatedSection key={mission.title} delay={index * 0.1}>
                <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-gray-100 hover:border-purple-300 transition-colors">
                  <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${mission.color} text-3xl`}>
                    {mission.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{mission.title}</h3>
                  <div className="text-2xl font-bold text-[#FF5656] mb-3">{mission.reward}</div>
                  <p className="text-gray-600">{mission.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="🔄 Process"
            title="How Missions Work"
            subtitle="Complete missions in four simple steps. It's easy, secure, and rewarding."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <AnimatedSection key={item.step} delay={index * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="✨ Benefits"
            title="Why Complete Missions?"
            subtitle="Missions are the heart of Maffix. They create a win-win situation for fans and artists."
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Missions by the Numbers</h2>
            <p className="text-purple-100">See the impact of our mission system</p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '1M+', label: 'Missions Completed' },
              { value: '50M+', label: 'Diamonds Earned' },
              { value: '500+', label: 'Active Artists' },
              { value: '10K+', label: 'Daily Missions' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Ready to Start Earning Diamonds?"
        description="Link your TikTok account and complete your first mission today. Get 100 free diamonds just for signing up!"
        primaryButton={{ text: 'Link TikTok & Start', href: '/register' }}
        secondaryButton={{ text: 'Learn More', href: '/how-it-works' }}
      />
    </div>
  )
}

