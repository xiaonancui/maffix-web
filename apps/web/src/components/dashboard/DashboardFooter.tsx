import Link from 'next/link'

const footerLinks = {
  product: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Releases', href: '/releases' },
    { name: 'Missions', href: '/missions' },
    { name: 'Gacha', href: '/gacha' },
    { name: 'Store', href: '/store' },
    { name: 'Prizes', href: '/prizes' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  social: [
    { name: 'TikTok', href: 'https://tiktok.com/@maffix', icon: '🎵' },
    { name: 'Instagram', href: 'https://instagram.com/maffix', icon: '📷' },
    { name: 'Twitter', href: 'https://twitter.com/maffix', icon: '🐦' },
  ],
}

export default function DashboardFooter() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Follow Us</h3>
            <ul className="space-y-2">
              {footerLinks.social.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Maffix
            </span>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Connecting musicians with fans through gamified engagement.
          </p>
        </div>
      </div>
    </footer>
  )
}

