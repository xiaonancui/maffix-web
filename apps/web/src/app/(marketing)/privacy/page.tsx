import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export const metadata = generateSEOMetadata({
  title: 'Privacy Policy',
  description: 'Learn how Maffix collects, uses, and protects your personal data. Read our comprehensive privacy policy.',
  keywords: ['privacy', 'policy', 'data', 'security', 'gdpr'],
  url: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-purple-100">Last updated: January 15, 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Maffix (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li>Account information (name, email, password)</li>
                  <li>Profile information (username, avatar, bio)</li>
                  <li>Payment information (processed securely by Klarna)</li>
                  <li>Shipping address for physical prizes</li>
                  <li>Communications with us (support tickets, feedback)</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">2.2 Information Collected Automatically</h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Mission completion data</li>
                  <li>Gacha draw history</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">2.3 Information from Third Parties</h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li>TikTok public profile data (when you link your account)</li>
                  <li>TikTok engagement data (likes, comments, shares)</li>
                  <li>Payment processor information (Klarna)</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use your information to:</p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>Provide and maintain the Platform</li>
                  <li>Process transactions and send notifications</li>
                  <li>Verify mission completion</li>
                  <li>Personalize your experience</li>
                  <li>Communicate with you about updates and promotions</li>
                  <li>Improve our services and develop new features</li>
                  <li>Detect and prevent fraud and abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">4. How We Share Your Information</h2>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">4.1 With Your Consent</h3>
                <p className="text-gray-700 mb-4">
                  We may share your information when you explicitly consent, such as when you choose to share your profile publicly.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">4.2 Service Providers</h3>
                <p className="text-gray-700 mb-4">
                  We share information with third-party service providers who help us operate the Platform:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li>Payment processors (Klarna)</li>
                  <li>Cloud hosting providers</li>
                  <li>Email service providers</li>
                  <li>Analytics providers</li>
                  <li>Customer support tools</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">4.3 Artists</h3>
                <p className="text-gray-700 mb-4">
                  We may share aggregated, anonymized data with artists to help them understand their audience. We do not share personally identifiable information without your consent.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">4.4 Legal Requirements</h3>
                <p className="text-gray-700 mb-4">
                  We may disclose your information if required by law or in response to valid legal requests.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your information:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Secure payment processing (PCI DSS compliant)</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">6.1 Access and Update</h3>
                <p className="text-gray-700 mb-4">
                  You can access and update your account information at any time through your profile settings.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">6.2 Data Portability</h3>
                <p className="text-gray-700 mb-4">
                  You can request a copy of your data in a machine-readable format.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">6.3 Deletion</h3>
                <p className="text-gray-700 mb-4">
                  You can request deletion of your account and associated data. Some information may be retained as required by law.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">6.4 Marketing Communications</h3>
                <p className="text-gray-700 mb-4">
                  You can opt out of marketing emails by clicking the unsubscribe link or updating your preferences.
                </p>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">6.5 Cookies</h3>
                <p className="text-gray-700 mb-4">
                  You can control cookies through your browser settings. Note that disabling cookies may affect Platform functionality.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your information within 90 days, except where retention is required by law.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
                <p className="text-gray-700 mb-4">
                  The Platform is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notification. Your continued use of the Platform after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  For questions about this Privacy Policy or to exercise your rights, please contact us at:
                </p>
                <p className="text-gray-700">
                  Email: privacy@maffix.com<br />
                  Address: [Company Address]<br />
                  Data Protection Officer: [DPO Contact]
                </p>
              </section>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

