'use client'

import { useState } from 'react'
import Hero from '@/components/marketing/Hero'
import SectionHeading from '@/components/marketing/SectionHeading'
import AnimatedSection from '@/components/marketing/AnimatedSection'
import CTA from '@/components/marketing/CTA'

const faqCategories = [
  {
    category: 'Getting Started',
    icon: '🚀',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button, enter your email and password, and verify your email. You\'ll get 100 free diamonds instantly!',
      },
      {
        question: 'Is Maffix free to use?',
        answer: 'Yes! Creating an account and completing missions is completely free. You can earn diamonds and win prizes without spending any money.',
      },
      {
        question: 'Do I need a TikTok account?',
        answer: 'Yes, you need a TikTok account to complete missions and earn diamonds. Linking your TikTok is required to verify mission completions.',
      },
      {
        question: 'What are diamonds?',
        answer: 'Diamonds are our virtual currency. Earn them by completing missions and use them for gacha draws to win prizes.',
      },
    ],
  },
  {
    category: 'Missions & Earning',
    icon: '🎯',
    questions: [
      {
        question: 'How do I earn diamonds?',
        answer: 'Complete TikTok missions like following artists, liking videos, sharing content, or using audio tracks. Each mission rewards 30-150 diamonds.',
      },
      {
        question: 'How long does mission verification take?',
        answer: 'Most missions are verified automatically within 5-10 minutes. Some complex missions may take up to 24 hours.',
      },
      {
        question: 'Can I complete the same mission multiple times?',
        answer: 'No, each mission can only be completed once per user. New missions are added daily.',
      },
      {
        question: 'What if my mission isn\'t verified?',
        answer: 'Make sure you completed the mission correctly and your TikTok account is linked. Contact support if issues persist.',
      },
    ],
  },
  {
    category: 'Gacha & Prizes',
    icon: '🎰',
    questions: [
      {
        question: 'How does the gacha system work?',
        answer: 'Spend diamonds to draw prizes. Single draw costs 100💎, 10x draw costs 900💎 and guarantees at least one SSR item.',
      },
      {
        question: 'What is the SSR guarantee?',
        answer: 'Every 10x draw guarantees at least one SSR or higher rarity item. You\'re also guaranteed an SSR within 90 total pulls.',
      },
      {
        question: 'What can I win?',
        answer: 'Win exclusive merchandise, digital content, signed items, limited edition collectibles, and more from independent artists.',
      },
      {
        question: 'Can I trade or sell prizes?',
        answer: 'Physical prizes are yours to keep. Digital items may be tradeable with other users (feature coming soon).',
      },
    ],
  },
  {
    category: 'Store & Payments',
    icon: '🛍️',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards and Klarna for buy-now-pay-later options. All payments are processed securely.',
      },
      {
        question: 'What are Premium Packs?',
        answer: 'Curated bundles with guaranteed merchandise plus bonus draw tickets and diamonds. Best value for fans.',
      },
      {
        question: 'How long does shipping take?',
        answer: 'Orders ship within 2-3 business days. Delivery time depends on your location (typically 5-10 business days).',
      },
      {
        question: 'What is your return policy?',
        answer: '30-day return policy on all merchandise. Items must be unused and in original packaging. Contact support to initiate a return.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    icon: '🔒',
    questions: [
      {
        question: 'Is my TikTok account safe?',
        answer: 'Yes! We only request read-only access to verify missions. We never post on your behalf or access private information.',
      },
      {
        question: 'How is my payment information protected?',
        answer: 'All payments are processed through secure, PCI-compliant payment processors. We never store your card details.',
      },
      {
        question: 'Can I disconnect my TikTok account?',
        answer: 'Yes, you can disconnect your TikTok account anytime from your profile settings. You won\'t be able to complete missions until you reconnect.',
      },
      {
        question: 'Do you sell my data?',
        answer: 'Never. We respect your privacy and never sell your personal information to third parties. See our Privacy Policy for details.',
      },
    ],
  },
  {
    category: 'For Artists',
    icon: '🎵',
    questions: [
      {
        question: 'How can I join as an artist?',
        answer: 'Visit our Artists page and fill out the application form. We\'ll review your profile and get back to you within 5-7 business days.',
      },
      {
        question: 'What are the benefits for artists?',
        answer: 'Increase TikTok engagement, build a loyal fan base, monetize your content, and connect directly with supporters.',
      },
      {
        question: 'How do artists get paid?',
        answer: 'Artists receive a share of revenue from premium packs and merchandise sales. Payments are processed monthly.',
      },
      {
        question: 'Can I create my own missions?',
        answer: 'Yes! Once approved, you can create custom missions for your fans through the artist dashboard.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === key ? null : key)
  }

  return (
    <div className="bg-black">
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
          {faqCategories.map((category, categoryIndex) => (
            <AnimatedSection key={category.category} delay={categoryIndex * 0.1}>
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-4xl">{category.icon}</span>
                  <h2 className="text-3xl font-bold text-white">{category.category}</h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`
                    const isOpen = openIndex === key

                    return (
                      <div
                        key={questionIndex}
                        className="rounded-lg border-2 border-gray-800 bg-gray-900 overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                        >
                          <span className="font-semibold text-white pr-8">{faq.question}</span>
                          <svg
                            className={`h-5 w-5 text-[#FF5656] flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4 text-gray-300">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </AnimatedSection>
          ))}
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

