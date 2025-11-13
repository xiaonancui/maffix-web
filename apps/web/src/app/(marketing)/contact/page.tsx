'use client'

import { useState } from 'react'
import Hero from '@/components/marketing/Hero'
import SectionHeading from '@/components/marketing/SectionHeading'
import AnimatedSection from '@/components/marketing/AnimatedSection'

const contactMethods = [
  {
    icon: '📧',
    title: 'Email Us',
    description: 'Get in touch via email',
    contact: 'support@maffix.com',
    href: 'mailto:support@maffix.com',
  },
  {
    icon: '💬',
    title: 'Live Chat',
    description: 'Chat with our support team',
    contact: 'Available 9AM-6PM EST',
    href: '#',
  },
  {
    icon: '📱',
    title: 'Social Media',
    description: 'Follow us on social platforms',
    contact: '@maffix',
    href: 'https://tiktok.com/@maffix',
  },
]

const quickLinks = [
  { title: 'FAQ', href: '/faq', description: 'Find answers to common questions' },
  { title: 'How It Works', href: '/how-it-works', description: 'Learn about our platform' },
  { title: 'For Artists', href: '/artists', description: 'Information for musicians' },
  { title: 'Membership', href: '/membership', description: 'Compare plans and pricing' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual form submission
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <Hero
        badge="💬 Contact Us"
        title="We're Here to Help"
        subtitle="Get in Touch"
        description="Have questions? Need support? Want to partner with us? We'd love to hear from you."
        primaryCTA={{ text: 'Send Message', href: '#contact-form' }}
        secondaryCTA={{ text: 'View FAQ', href: '/faq' }}
        backgroundImage="/hero-images/cropped-view-of-hand-holding-microphone-in-nightcl-2024-11-17-10-20-55-utc.jpg"
      />

      {/* Contact Methods */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="📞 Reach Out"
            title="Multiple Ways to Connect"
            subtitle="Choose the method that works best for you"
            centered
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {contactMethods.map((method, index) => (
              <AnimatedSection key={method.title} delay={index * 0.1}>
                <a
                  href={method.href}
                  className="block rounded-2xl bg-gray-900 border border-gray-800 p-8 hover:shadow-lg hover:border-[#FF5656] transition-all"
                >
                  <div className="text-5xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-gray-300 mb-3">{method.description}</p>
                  <p className="text-[#FF5656] font-semibold">{method.contact}</p>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="bg-gray-950 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <SectionHeading
            badge="✉️ Send a Message"
            title="Contact Form"
            subtitle="Fill out the form below and we&apos;ll get back to you within 24 hours"
            centered
          />

          <AnimatedSection delay={0.2}>
            <form onSubmit={handleSubmit} className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8">
              <div className="grid gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-white mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="artist">Artist Application</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-white mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition"
                    placeholder="Brief subject line"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>

                {submitted && (
                  <div className="text-center text-green-600 font-semibold">
                    ✓ Message sent successfully! We&apos;ll get back to you soon.
                  </div>
                )}
              </div>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge="🔗 Quick Links"
            title="Looking for Something Specific?"
            subtitle="Check out these helpful resources"
            centered
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link, index) => (
              <AnimatedSection key={link.title} delay={index * 0.1}>
                <a
                  href={link.href}
                  className="block rounded-xl bg-gray-900 border border-gray-800 p-6 hover:bg-gray-800 hover:border-[#FF5656] transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{link.title}</h3>
                  <p className="text-sm text-gray-300">{link.description}</p>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

