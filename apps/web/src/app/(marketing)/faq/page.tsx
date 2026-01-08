'use client'

import { useState } from 'react'
import Hero from '@/components/marketing/Hero'
import AnimatedSection from '@/components/marketing/AnimatedSection'
import CTA from '@/components/marketing/CTA'
import { ChevronDown, Gem, Ticket, Trophy, Sparkles, ShoppingBag, Shield, Music } from 'lucide-react'

// =============================================================================
// FAQ DATA - Edit this array to update FAQ content
// =============================================================================
// Categories with icons and questions. Easy to add/edit/remove items.
// Icons use lucide-react components for consistency.
// =============================================================================

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  category: string
  icon: typeof Gem
  color: string
  questions: FAQItem[]
}

const FAQ_DATA: FAQCategory[] = [
  {
    category: 'Getting Started',
    icon: Sparkles,
    color: '#00F5FF',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button, enter your email and password, and verify your email. You\'ll get 100 free diamonds instantly to start your journey!',
      },
      {
        question: 'Is Maffix free to use?',
        answer: 'Yes! Creating an account and completing missions is completely free. You can earn diamonds, gain XP, level up, and win prizes without spending any money.',
      },
      {
        question: 'Do I need a TikTok account?',
        answer: 'Yes, you need a TikTok account to complete missions and earn rewards. Linking your TikTok is required to verify mission completions automatically.',
      },
      {
        question: 'What are diamonds?',
        answer: 'Diamonds are our premium currency. Earn them by completing missions and leveling up. Use them in the Aura Zone gacha to win exclusive prizes and collectibles.',
      },
    ],
  },
  {
    category: 'Missions & Earning',
    icon: Gem,
    color: '#FF1F7D',
    questions: [
      {
        question: 'How do I earn diamonds?',
        answer: 'Complete TikTok missions like following artists, liking videos, sharing content, or using audio tracks. Each mission rewards 50-500 diamonds depending on difficulty. You also earn bonus diamonds when you level up!',
      },
      {
        question: 'How long does mission verification take?',
        answer: 'Most missions are verified automatically within 5-10 minutes. Spotify follow missions are verified instantly. Some complex missions may take up to 24 hours.',
      },
      {
        question: 'What are daily missions?',
        answer: 'Daily missions reset every day at midnight UTC. Complete them consistently to build streaks and earn bonus rewards. Your streak counter shows how many consecutive days you\'ve completed missions.',
      },
      {
        question: 'What if my mission isn\'t verified?',
        answer: 'Make sure you completed the mission correctly and your TikTok account is properly linked. Double-check you followed the right account or liked the correct video. Contact support if issues persist.',
      },
    ],
  },
  {
    category: 'Tickets & XP',
    icon: Ticket,
    color: '#8B5CF6',
    questions: [
      {
        question: 'How do I earn tickets?',
        answer: 'Tickets are earned by purchasing merchandise from our store. For every £10 spent, you receive 1 ticket. Tickets can be used in the Aura Zone for gacha draws!',
      },
      {
        question: 'What is the difference between diamonds and tickets?',
        answer: 'Diamonds are earned through missions and leveling up - they\'re our free-to-earn currency. Tickets are bonus rewards from store purchases. Both can be used for Aura Zone gacha draws.',
      },
      {
        question: 'How does the XP and leveling system work?',
        answer: 'Earn XP by completing missions. As you accumulate XP, you\'ll level up (max level 50). Each level up rewards you with bonus diamonds - regular levels give 30 diamonds, milestone levels (5, 10, 15, etc.) give 80 diamonds!',
      },
      {
        question: 'What are milestone levels?',
        answer: 'Every 5th level (5, 10, 15, 20, etc.) is a milestone level. These special levels reward you with 80 bonus diamonds instead of the standard 30. Level 50 (max level) gives 100 diamonds!',
      },
    ],
  },
  {
    category: 'Aura Zone & Prizes',
    icon: Trophy,
    color: '#FFC700',
    questions: [
      {
        question: 'What is the Aura Zone?',
        answer: 'The Aura Zone is our gacha system where you can spend diamonds or tickets to draw for exclusive prizes. Each banner features unique items from independent artists.',
      },
      {
        question: 'How much does a draw cost?',
        answer: 'Single draw: 300 diamonds or 1 ticket. 10x draw: 3,000 diamonds or 10 tickets. The 10x draw offers better value and guaranteed rewards!',
      },
      {
        question: 'What is the SSR guarantee?',
        answer: 'Every 10x draw guarantees at least one SSR (Super Super Rare) or higher rarity item. You\'re also guaranteed an SSR within 90 total pulls (pity system).',
      },
      {
        question: 'What can I win?',
        answer: 'Win exclusive merchandise, digital content, signed items, limited edition collectibles, and more from independent artists. Prizes vary by banner and rarity.',
      },
      {
        question: 'Can I trade or sell prizes?',
        answer: 'Physical prizes are shipped to you and yours to keep. Digital items may be tradeable with other users (feature coming soon).',
      },
    ],
  },
  {
    category: 'Store & Payments',
    icon: ShoppingBag,
    color: '#10B981',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards (Visa, Mastercard, Amex) and Klarna for buy-now-pay-later options. All payments are processed securely through Stripe.',
      },
      {
        question: 'Do I earn tickets on all purchases?',
        answer: 'Yes! Every merchandise purchase earns you tickets at a rate of 1 ticket per £10 spent. Tickets are automatically credited to your account after your order is confirmed.',
      },
      {
        question: 'How long does shipping take?',
        answer: 'Orders ship within 2-3 business days. UK delivery typically takes 3-5 business days. International shipping varies by location (usually 7-14 business days).',
      },
      {
        question: 'What is your return policy?',
        answer: '30-day return policy on all merchandise. Items must be unused and in original packaging. Contact support to initiate a return. Note: Tickets earned from returned orders will be deducted.',
      },
      {
        question: 'Are prices in GBP?',
        answer: 'Yes, all prices on Maffix are displayed in British Pounds (GBP). International customers may see converted prices at checkout.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    icon: Shield,
    color: '#00F5FF',
    questions: [
      {
        question: 'Is my TikTok account safe?',
        answer: 'Yes! We only request read-only access to verify missions. We never post on your behalf, access private messages, or share your information.',
      },
      {
        question: 'How is my payment information protected?',
        answer: 'All payments are processed through Stripe, a PCI-DSS compliant payment processor. We never store your card details on our servers.',
      },
      {
        question: 'Can I disconnect my TikTok account?',
        answer: 'Yes, you can disconnect your TikTok account anytime from your profile settings. You won\'t be able to complete TikTok missions until you reconnect.',
      },
      {
        question: 'Do you sell my data?',
        answer: 'Never. We respect your privacy and never sell your personal information to third parties. See our Privacy Policy for full details on how we handle your data.',
      },
    ],
  },
  {
    category: 'For Artists',
    icon: Music,
    color: '#FF1F7D',
    questions: [
      {
        question: 'How can I join as an artist?',
        answer: 'Visit our Artists page and fill out the application form. We\'ll review your profile and get back to you within 5-7 business days.',
      },
      {
        question: 'What are the benefits for artists?',
        answer: 'Increase TikTok engagement, build a loyal fan base, monetize your content through merch and gacha items, and connect directly with your supporters.',
      },
      {
        question: 'How do artists get paid?',
        answer: 'Artists receive a share of revenue from merchandise sales and Aura Zone items. Payments are processed monthly via bank transfer.',
      },
      {
        question: 'Can I create my own missions?',
        answer: 'Yes! Once approved, you can create custom missions for your fans through the artist dashboard. Set your own rewards and engagement goals.',
      },
    ],
  },
]

// =============================================================================
// FAQ PAGE COMPONENT
// =============================================================================

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === key ? null : key)
  }

  return (
    <div className="bg-surface-base">
      <Hero
        badge="❓ FAQ"
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions"
        description="Everything you need to know about Maffix. Can't find what you're looking for? Contact our support team."
        primaryCTA={{ text: 'Contact Support', href: '/contact' }}
        secondaryCTA={{ text: 'How It Works', href: '/how-it-works' }}
        backgroundImage="/hero-images/picture-of-party-people-at-music-festival-2025-03-15-19-38-41-utc.jpg"
      />

      {/* FAQ Categories */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {FAQ_DATA.map((category, categoryIndex) => {
            const Icon = category.icon
            return (
              <AnimatedSection key={category.category} delay={categoryIndex * 0.1}>
                <div className="mb-16">
                  {/* Category Header */}
                  <div className="mb-8 flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="h-7 w-7" style={{ color: category.color }} />
                    </div>
                    <h2 className="font-display text-3xl font-black text-white">{category.category}</h2>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {category.questions.map((faq, questionIndex) => {
                      const key = `${categoryIndex}-${questionIndex}`
                      const isOpen = openIndex === key

                      return (
                        <div
                          key={questionIndex}
                          className="overflow-hidden rounded-2xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 backdrop-blur-xl transition-all duration-300 hover:border-white/20"
                        >
                          <button
                            onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                            className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white/5"
                          >
                            <span className="pr-8 font-display font-bold text-white">{faq.question}</span>
                            <div
                              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: isOpen ? `${category.color}20` : 'transparent',
                              }}
                            >
                              <ChevronDown
                                className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                style={{ color: category.color }}
                              />
                            </div>
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="border-t border-white/10 px-6 py-5">
                              <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </section>

      <CTA
        title="Still Have Questions?"
        description="Our support team is here to help. Reach out and we'll get back to you within 24 hours."
        primaryButton={{ text: 'Contact Support', href: '/contact' }}
        secondaryButton={{ text: 'View Guides', href: '/how-it-works' }}
      />
    </div>
  )
}
