import Link from 'next/link'
import { LayoutDashboard, Users, ListTodo, Target, Trophy, Rocket, Gem, ShoppingBag, BarChart3, Package, ArrowRight } from 'lucide-react'

const adminLinks = {
  management: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Tasks', href: '/admin/tasks', icon: ListTodo },
    { name: 'Missions', href: '/admin/missions', icon: Target },
  ],
  content: [
    { name: 'Prizes', href: '/admin/prizes', icon: Trophy },
    { name: 'Releases', href: '/admin/releases', icon: Rocket },
    { name: 'Gacha Items', href: '/admin/gacha', icon: Gem },
    { name: 'Merchandise', href: '/admin/merchandise', icon: ShoppingBag },
  ],
  system: [
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Premium Packs', href: '/admin/packs', icon: Package },
  ],
}

const sectionColors = {
  management: '#FF1F7D', // Hot Pink
  content: '#8B5CF6',    // Purple
  system: '#00F5FF',     // Cyan
}

export default function AdminFooter() {
  return (
    <footer className="relative mt-auto border-t-2 border-white/10 bg-gradient-to-b from-surface-card/95 to-surface-raised/95 backdrop-blur-xl">
      {/* Top ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-40 bg-gradient-to-t from-[#8B5CF6]/10 via-[#FF1F7D]/10 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {/* Management Links - Hot Pink */}
          <div className="group">
            <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-[#FF1F7D]">
              <div className="h-px flex-1 bg-gradient-to-r from-[#FF1F7D]/50 to-transparent" />
              Management
              <div className="h-px flex-1 bg-gradient-to-l from-[#FF1F7D]/50 to-transparent" />
            </h3>
            <ul className="space-y-2">
              {adminLinks.management.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group/link flex items-center gap-2 text-sm font-medium text-white/60 transition-all duration-300 hover:text-white hover:translate-x-1"
                    >
                      <Icon className="h-3.5 w-3.5 transition-all group-hover/link:text-[#FF1F7D] group-hover/link:scale-110" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Content Links - Purple */}
          <div className="group">
            <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-[#8B5CF6]">
              <div className="h-px flex-1 bg-gradient-to-r from-[#8B5CF6]/50 to-transparent" />
              Content
              <div className="h-px flex-1 bg-gradient-to-l from-[#8B5CF6]/50 to-transparent" />
            </h3>
            <ul className="space-y-2">
              {adminLinks.content.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group/link flex items-center gap-2 text-sm font-medium text-white/60 transition-all duration-300 hover:text-white hover:translate-x-1"
                    >
                      <Icon className="h-3.5 w-3.5 transition-all group-hover/link:text-[#8B5CF6] group-hover/link:scale-110" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* System Links - Cyan */}
          <div className="group">
            <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-[#00F5FF]">
              <div className="h-px flex-1 bg-gradient-to-r from-[#00F5FF]/50 to-transparent" />
              System
              <div className="h-px flex-1 bg-gradient-to-l from-[#00F5FF]/50 to-transparent" />
            </h3>
            <ul className="space-y-2">
              {adminLinks.system.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group/link flex items-center gap-2 text-sm font-medium text-white/60 transition-all duration-300 hover:text-white hover:translate-x-1"
                    >
                      <Icon className="h-3.5 w-3.5 transition-all group-hover/link:text-[#00F5FF] group-hover/link:scale-110" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t-2 border-white/10 pt-6">
          {/* Neon divider glow */}
          <div className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF1F7D]/50 to-transparent blur-sm" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-black text-white">
                MAFFIX ADMIN
              </span>
              <span className="text-xs font-medium text-white/40">
                © 2026
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="group flex items-center gap-1.5 text-sm font-bold text-white/60 transition-all duration-300 hover:text-[#00F5FF] hover:scale-105"
              >
                Back to User View
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-white/20">•</span>
              <span className="text-sm font-bold text-white/40">Admin Panel v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

