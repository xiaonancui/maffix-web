import Link from 'next/link'

const adminLinks = {
  management: [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Tasks', href: '/admin/tasks' },
    { name: 'Missions', href: '/admin/missions' },
  ],
  content: [
    { name: 'Prizes', href: '/admin/prizes' },
    { name: 'Releases', href: '/admin/releases' },
    { name: 'Gacha Items', href: '/admin/gacha' },
    { name: 'Merchandise', href: '/admin/merchandise' },
  ],
  system: [
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Premium Packs', href: '/admin/packs' },
  ],
}

export default function AdminFooter() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {/* Management Links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Management</h3>
            <ul className="space-y-1.5">
              {adminLinks.management.map((item) => (
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

          {/* Content Links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Content</h3>
            <ul className="space-y-1.5">
              {adminLinks.content.map((item) => (
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

          {/* System Links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">System</h3>
            <ul className="space-y-1.5">
              {adminLinks.system.map((item) => (
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
        </div>

        {/* Bottom Section */}
        <div className="mt-6 border-t border-border pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              🛡️ Maffix Admin
            </span>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Back to User View
            </Link>
            <span>•</span>
            <span>Admin Panel v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

