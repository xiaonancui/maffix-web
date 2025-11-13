import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export const metadata = generateSEOMetadata({
  title: 'Terms of Service',
  description: 'Read Maffix Terms of Service, user agreements, and platform usage rules.',
  keywords: ['terms', 'service', 'agreement', 'legal'],
  url: '/terms',
})

export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-purple-100">Last updated: January 15, 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using Maffix (&ldquo;the Platform&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Platform.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 mb-4">
                  Maffix is a fan engagement platform that connects independent musicians with their fans through gamification, missions, and rewards. The Platform allows users to:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>Complete TikTok-based missions to earn virtual currency (Diamonds)</li>
                  <li>Participate in gacha draws to win prizes and merchandise</li>
                  <li>Purchase Premium Packs and merchandise</li>
                  <li>Engage with artists and fan communities</li>
                  <li>Access exclusive content and experiences</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">3.1 Registration</h3>
                <p className="text-gray-700 mb-4">
                  To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">3.2 Account Security</h3>
                <p className="text-gray-700 mb-4">
                  You are responsible for safeguarding your account credentials and for any activities or actions under your account. You must notify us immediately of any unauthorized use of your account.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">3.3 Age Requirements</h3>
                <p className="text-gray-700 mb-4">
                  You must be at least 13 years old to use the Platform. Users under 18 require parental consent for purchases.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Virtual Currency and Purchases</h2>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">4.1 Diamonds</h3>
                <p className="text-gray-700 mb-4">
                  Diamonds are virtual currency used on the Platform. Diamonds can be earned through missions or purchased. Diamonds have no real-world value and cannot be exchanged for cash.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">4.2 Purchases</h3>
                <p className="text-gray-700 mb-4">
                  All purchases are final and non-refundable except as required by law. Prices are subject to change without notice.
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">4.3 Gacha System</h3>
                <p className="text-gray-700 mb-4">
                  The gacha system is a game of chance. While we provide probability information, specific outcomes are not guaranteed. The SSR guarantee applies only to 10x draws.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">5. User Conduct</h2>
                <p className="text-gray-700 mb-4">You agree not to:</p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Use automated systems or bots</li>
                  <li>Attempt to manipulate the gacha system or mission verification</li>
                  <li>Create multiple accounts to abuse rewards</li>
                  <li>Sell or transfer your account</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">6. TikTok Integration</h2>
                <p className="text-gray-700 mb-4">
                  By linking your TikTok account, you authorize us to access your public TikTok data to verify mission completion. We do not post on your behalf without explicit permission.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content on the Platform, including text, graphics, logos, and software, is the property of Maffix or its licensors and is protected by copyright and trademark laws.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Disclaimers</h2>
                <p className="text-gray-700 mb-4">
                  THE PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE UNINTERRUPTED OR ERROR-FREE SERVICE.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, MAFFIX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE PLATFORM.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the Platform after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions about these Terms, please contact us at:
                </p>
                <p className="text-gray-700">
                  Email: legal@maffix.com<br />
                  Address: [Company Address]
                </p>
              </section>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

