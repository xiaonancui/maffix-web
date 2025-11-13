import Hero from '@/components/marketing/Hero'
import SectionHeading from '@/components/marketing/SectionHeading'
import AnimatedSection from '@/components/marketing/AnimatedSection'
import CTA from '@/components/marketing/CTA'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'Membership Plans - Free & Premium Benefits',
  description:
    'Compare Maffix membership plans. Start free or upgrade to Premium for exclusive benefits, bonus diamonds, and priority support.',
  keywords: ['membership', 'premium', 'subscription', 'benefits', 'pricing'],
  url: '/membership',
})

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for casual fans who want to support their favorite artists',
    features: [
      { text: 'Complete TikTok missions', included: true },
      { text: 'Earn diamonds', included: true },
      { text: 'Single gacha draws', included: true },
      { text: '10x gacha draws with SSR guarantee', included: true },
      { text: 'Purchase merchandise', included: true },
      { text: 'Join fan communities', included: true },
      { text: 'Basic profile customization', included: true },
      { text: 'Monthly bonus diamonds', included: false },
      { text: 'Exclusive premium missions', included: false },
      { text: 'Priority customer support', included: false },
      { text: 'Early access to new features', included: false },
      { text: 'Premium badge', included: false },
    ],
    cta: 'Get Started',
    href: '/register',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'per month',
    description: 'For dedicated fans who want maximum rewards and exclusive perks',
    features: [
      { text: 'Everything in Free', included: true },
      { text: '500 bonus diamonds monthly', included: true },
      { text: 'Exclusive premium missions', included: true },
      { text: '2x diamond earnings on all missions', included: true },
      { text: 'Priority customer support', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'Premium badge on profile', included: true },
      { text: 'Exclusive premium-only prizes', included: true },
      { text: 'Advanced profile customization', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Monthly exclusive merchandise drops', included: true },
      { text: 'Direct messaging with artists', included: true },
    ],
    cta: 'Upgrade to Premium',
    href: '/register?plan=premium',
    popular: true,
  },
]

const premiumBenefits = [
  {
    icon: '💎',
    title: '500 Bonus Diamonds Monthly',
    description: 'Get 500 diamonds every month just for being a Premium member. That\'s $5 worth of free draws!',
  },
  {
    icon: '⚡',
    title: '2x Diamond Earnings',
    description: 'Earn double diamonds on every mission you complete. Level up faster and draw more prizes.',
  },
  {
    icon: '🎁',
    title: 'Exclusive Prizes',
    description: 'Access premium-only gacha pools with rare merchandise and limited edition items.',
  },
  {
    icon: '🌟',
    title: 'Premium Badge',
    description: 'Stand out in the community with your exclusive Premium badge on your profile.',
  },
  {
    icon: '💬',
    title: 'Direct Artist Messaging',
    description: 'Send messages directly to your favorite artists and get responses from them.',
  },
  {
    icon: '🚀',
    title: 'Early Access',
    description: 'Be the first to try new features, missions, and merchandise before anyone else.',
  },
]

const faqs = [
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes! You can cancel your Premium membership at any time. You\'ll continue to have access until the end of your billing period.',
  },
  {
    question: 'What happens to my diamonds if I cancel?',
    answer: 'All diamonds you\'ve earned (including bonus diamonds) remain in your account even after canceling Premium.',
  },
  {
    question: 'Do I get a refund if I cancel mid-month?',
    answer: 'We don\'t offer prorated refunds, but you\'ll keep Premium benefits until the end of your billing period.',
  },
  {
    question: 'Can I upgrade from Free to Premium anytime?',
    answer: 'Absolutely! You can upgrade to Premium at any time and start enjoying the benefits immediately.',
  },
]

export default function MembershipPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero
        badge="💎 Membership"
        title="Choose Your Maffix Experience"
        subtitle="Free or Premium"
        description="Start free and upgrade anytime to unlock exclusive benefits, bonus diamonds, and premium features."
        primaryCTA={{ text: 'Get Started Free', href: '/register' }}
        secondaryCTA={{ text: 'Compare Plans', href: '#plans' }}
      />

      {/* Plans Comparison */}
      <section id="plans" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="📊 Compare Plans"
            title="Find the Perfect Plan for You"
            subtitle="Start free or go Premium for maximum rewards"
            centered
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
            {plans.map((plan, index) => (
              <AnimatedSection key={plan.name} delay={index * 0.2}>
                <div
                  className={`relative rounded-3xl p-8 ${
                    plan.popular
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl scale-105'
                      : 'bg-gray-50 text-gray-900'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className={plan.popular ? 'text-purple-100' : 'text-gray-500'}>/{plan.period}</span>
                    </div>
                    <p className={plan.popular ? 'text-purple-100' : 'text-gray-600'}>{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-3">
                        <span className="text-xl">
                          {feature.included ? '✓' : '✗'}
                        </span>
                        <span className={feature.included ? '' : 'opacity-50'}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.href}
                    className={`block w-full text-center py-4 px-6 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? 'bg-white text-[#FF5656] hover:bg-gray-100'
                        : 'bg-[#FF5656] text-white hover:bg-[#FF5656]/90'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Benefits Detail */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="⭐ Premium Benefits"
            title="Why Upgrade to Premium?"
            subtitle="Get more value from every mission and unlock exclusive features"
            centered
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {premiumBenefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                  <div className="text-5xl mb-4">{benefit.icon}</div>
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
        title="Ready to Unlock Premium Benefits?"
        description="Join thousands of Premium members earning 2x diamonds and accessing exclusive content."
        primaryButton={{ text: 'Upgrade to Premium', href: '/register?plan=premium' }}
        secondaryButton={{ text: 'Start Free', href: '/register' }}
      />
    </div>
  )
}

