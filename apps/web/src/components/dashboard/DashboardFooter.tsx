'use client'

import Link from 'next/link'
import { Zap, Music, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Missions', href: '/missions' },
    { name: 'Aura Zone', href: '/aura-zone' },
    { name: 'Store', href: '/store' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  social: [
    { name: 'TikTok', href: 'https://tiktok.com/@maffix' },
    { name: 'Instagram', href: 'https://instagram.com/maffix' },
    { name: 'Twitter', href: 'https://twitter.com/maffix' },
  ],
}

const socialIcons = [
  { Icon: Music, href: 'https://tiktok.com/@maffix', label: 'TikTok', color: '#FF1F7D' },
  { Icon: Instagram, href: 'https://instagram.com/maffix', label: 'Instagram', color: '#B200FF' },
  { Icon: Twitter, href: 'https://twitter.com/maffix', label: 'Twitter', color: '#00F5FF' },
  { Icon: Linkedin, href: 'https://linkedin.com/company/maffix', label: 'LinkedIn', color: '#8B5CF6' },
  { Icon: Youtube, href: 'https://youtube.com/@maffix', label: 'YouTube', color: '#FFC700' },
]

export default function DashboardFooter() {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-surface-base/95 py-16 text-sm backdrop-blur-2xl">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6] via-[#FF1F7D] to-transparent opacity-80" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/dashboard" className="group inline-flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1F7D] to-[#8B5CF6] text-white shadow-lg shadow-[#FF1F7D]/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#FF1F7D]/40">
                <Zap className="h-6 w-6" strokeWidth={2.5} />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div>
                <p className="font-display text-xl font-black tracking-tight text-white">Maffix</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00F5FF]">Universe</p>
              </div>
            </Link>
            <p className="max-w-xs font-display text-base font-semibold leading-relaxed text-white/70">
              Support the music. Stack rewards. Unlock legendary.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialIcons.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white/10 hover:text-white hover:shadow-lg"
                  style={{
                    ['--hover-color' as string]: color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 24px ${color}30`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries({
            Product: footerLinks.product,
            Support: footerLinks.support,
            Legal: footerLinks.legal,
          }).map(([section, links]) => (
            <div key={section}>
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                {section}
              </p>
              <ul className="mt-5 space-y-3">
                {links.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/60 transition-all duration-200 hover:text-white"
                    >
                      <span className="h-px w-0 bg-gradient-to-r from-[#FF1F7D] to-[#8B5CF6] transition-all duration-300 group-hover:w-4" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-8 text-xs md:flex-row md:items-center md:justify-between">
          <p className="text-white/50">
            © {new Date().getFullYear()} Maffix. All rights reserved.{' '}
            <span className="inline-block animate-pulse">✦</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
