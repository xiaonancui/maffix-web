'use client'

import Link from 'next/link'
import NavLink from '@/components/dashboard/NavLink'
import AdminNavLink from '@/components/dashboard/AdminNavLink'
import MobileMenu from '@/components/dashboard/MobileMenu'
import { ButtonIcon } from '@/components/icons/Icon'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Gem, Ticket } from 'lucide-react'

interface DashboardNavProps {
  diamonds: number
  hasCompletedTenDraw: boolean
  userRole: string
  points?: number
  level?: number
}

export default function DashboardNav({
  diamonds,
  hasCompletedTenDraw,
  userRole,
  points = 0,
  level = 1,
}: DashboardNavProps) {
  return (
    <nav className="bg-background border-b border-border shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="text-xl font-bold text-foreground">
                Maffix
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/missions">Missions</NavLink>
              <NavLink href="/aura-zone">Aura Zone</NavLink>
              {/* Store: Always accessible (removed 10x draw gate) */}
              <NavLink href="/store">Store</NavLink>
              {/* Hidden: Premium Packs - Route still accessible via direct URL */}
              {/* <NavLink href="/store/packs">Premium Packs</NavLink> */}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Level Badge */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs font-semibold text-foreground">
              <span>Lv.{level}</span>
            </div>

            {/* Diamond Balance */}
            <Link
              href="/transactions"
              className="hidden items-center gap-1.5 rounded-lg bg-secondary px-2 py-1.5 text-sm font-semibold text-foreground hover:bg-secondary/80 sm:flex transition-colors"
            >
              <Gem className="h-4 w-4 text-primary" />
              <span className="text-primary">{diamonds.toLocaleString()}</span>
            </Link>

            {/* Points Balance */}
            <Link
              href="/transactions"
              className="hidden items-center gap-1.5 rounded-lg bg-secondary px-2 py-1.5 text-sm font-semibold text-foreground hover:bg-secondary/80 sm:flex transition-colors"
            >
              <Ticket className="h-4 w-4 text-primary" />
              <span className="text-primary">{points.toLocaleString()}</span>
            </Link>

            {/* Admin Panel Link (only for admins) */}
            {userRole === 'ADMIN' && <AdminNavLink />}

            {/* Profile Icon */}
            <Link
              href="/profile"
              className="flex items-center justify-center rounded-full bg-secondary w-10 h-10 text-foreground hover:bg-secondary/80 transition-colors"
            >
              <span className="sr-only">View profile</span>
              <ButtonIcon name="user" label="Profile" />
            </Link>

            {/* Mobile Menu Button */}
            <MobileMenu diamonds={diamonds} hasCompletedTenDraw={hasCompletedTenDraw} points={points} />
          </div>
        </div>
      </div>
    </nav>
  )
}

