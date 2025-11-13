import dynamic from 'next/dynamic'
import Image from 'next/image'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

// Dynamic imports for animated components
const ButtonEnhanced = dynamic(() => import('@/components/marketing/ButtonEnhanced'))

export const metadata = generateSEOMetadata({
  title: 'How It Works - Get Started with Maffix',
  description:
    'Learn how Maffix works in 4 simple steps. Sign up, link TikTok, complete missions, and win prizes. Start supporting independent musicians today.',
  keywords: ['how it works', 'getting started', 'user guide', 'tutorial', 'onboarding'],
  url: '/how-it-works',
})

const steps = [
  {
    number: '1',
    title: 'Create Your Account',
    description: 'Sign up for free in seconds. No credit card required. Get 100 free diamonds just for joining!',
    icon: '✍️',
    details: [
      'Quick email registration',
      'Secure account creation',
      '100 welcome diamonds',
      'Instant access to platform',
    ],
  },
  {
    number: '2',
    title: 'Link Your TikTok',
    description: 'Connect your TikTok account securely. We only need read access to verify your mission completions.',
    icon: '🔗',
    details: [
      'Secure OAuth connection',
      'Read-only access',
      'Privacy protected',
      'Disconnect anytime',
    ],
  },
  {
    number: '3',
    title: 'Complete Missions',
    description: 'Choose missions from your favorite artists. Follow, like, share, or use audio on TikTok to earn diamonds.',
    icon: '🎯',
    details: [
      'Daily new missions',
      'Multiple mission types',
      'Instant verification',
      'Earn 30-150 diamonds per mission',
    ],
  },
  {
    number: '4',
    title: 'Win Prizes & Shop',
    description: 'Use your diamonds for gacha draws to win prizes, or shop for official merchandise and premium packs.',
    icon: '🎁',
    details: [
      'Gacha prize draws',
      'Official merchandise',
      'Premium packs',
      'Exclusive collectibles',
    ],
  },
]

const faqs = [
  {
    question: 'Is Maffix really free?',
    answer: 'Yes! Creating an account and completing missions is completely free. You can earn diamonds and win prizes without spending money.',
  },
  {
    question: 'How do I earn diamonds?',
    answer: 'Complete TikTok missions like following artists, liking videos, sharing content, or using audio tracks. Each mission rewards you with diamonds.',
  },
  {
    question: 'What can I do with diamonds?',
    answer: 'Use diamonds for gacha draws (100💎 for single, 900💎 for 10x). Win exclusive prizes, merchandise, and collectibles.',
  },
  {
    question: 'Is my TikTok account safe?',
    answer: 'Absolutely! We only request read-only access to verify missions. We never post on your behalf or access private information.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-images/gabriel-gurrola-2UuhMZEChdc-unsplash.jpg"
            alt="Music stage"
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
            📖 How It Works
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Get Started in 4 Simple Steps
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Maffix makes it easy to support independent musicians while earning rewards. Here&apos;s how it works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonEnhanced href="/register" variant="primary" size="lg" icon={<span>→</span>} glow>
              Start Now
            </ButtonEnhanced>
            <ButtonEnhanced href="/features" variant="ghost" size="lg" icon={<span>→</span>}>
              View Features
            </ButtonEnhanced>
          </div>
        </div>
      </section>

      {/* Steps - Large Visual Layout */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              🚀 Getting Started
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Journey Begins Here
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Follow these four steps to start earning rewards and supporting artists.
            </p>
          </div>

          <div className="mt-16 space-y-32">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Step Visual */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    {/* Large Number Background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="text-[20rem] font-bold text-white leading-none">
                        {step.number}
                      </span>
                    </div>

                    {/* Icon Circle */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="flex h-48 w-48 items-center justify-center rounded-full bg-[#FF5656] shadow-2xl">
                        <span className="text-8xl">{step.icon}</span>
                      </div>
                      <div className="mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 border-4 border-purple-500 text-white text-3xl font-bold">
                        {step.number}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">{step.title}</h3>
                  <p className="text-xl text-gray-400 mb-8 leading-relaxed">{step.description}</p>
                  <ul className="space-y-4">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center text-gray-300 text-lg">
                        <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick FAQs */}
      <section className="py-24 sm:py-32 bg-gray-900/50">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#FF5656]/20 text-[#FF5656] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              ❓ Quick Questions
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-gray-400">
              Get quick answers to the most frequently asked questions.
            </p>
          </div>

          <div className="mt-16 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl bg-gray-800 border border-gray-700 p-6 hover:border-purple-500 transition-colors"
              >
                <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">Still have questions?</p>
            <ButtonEnhanced href="/faq" variant="outline" size="lg" icon={<span>→</span>}>
              View All FAQs
            </ButtonEnhanced>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gray-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of fans supporting independent musicians. Sign up now and get{' '}
            <span className="text-[#FF5656] font-bold">100 free diamonds!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonEnhanced href="/register" variant="primary" size="lg" icon={<span>→</span>} ripple glow>
              Create Free Account
            </ButtonEnhanced>
            <ButtonEnhanced href="/faq" variant="ghost" size="lg" icon={<span>→</span>}>
              View FAQ
            </ButtonEnhanced>
          </div>
        </div>
      </section>
    </div>
  )
}

