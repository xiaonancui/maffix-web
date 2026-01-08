'use client'

import Link from 'next/link'
import NavLink from '@/components/dashboard/NavLink'
import AdminNavLink from '@/components/dashboard/AdminNavLink'
import MobileMenu from '@/components/dashboard/MobileMenu'
import { ButtonIcon } from '@/components/icons/Icon'
import { Gem, Ticket, Trophy, Zap } from 'lucide-react'
import { ENABLE_PREMIUM_PACKS } from '@/lib/constants'

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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-surface-base/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-surface-base/90">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF1F7D] via-[#8B5CF6] to-transparent opacity-90" />

      {/* Bottom glow effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00F5FF]/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1F7D] to-[#8B5CF6] text-white shadow-lg shadow-[#FF1F7D]/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#FF1F7D]/40">
              <Zap className="h-6 w-6" strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-black tracking-tight text-white">Maffix</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00F5FF]">DASH</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-2">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/missions">Missions</NavLink>
              <NavLink href="/aura-zone">Aura Zone</NavLink>
              <NavLink href="/store">Store</NavLink>
              {ENABLE_PREMIUM_PACKS && <NavLink href="/store/packs">Packs</NavLink>}
            </div>
          </div>

          {/* Stats & Profile */}
          <div className="flex items-center gap-3">
            {/* Stats Display */}
            <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] px-4 py-2.5 backdrop-blur-sm md:flex">
              {/* Level */}
              <div className="group/stat flex items-center gap-1.5 transition-all">
                <div className="rounded-lg bg-[#FFC700]/20 p-1.5 ring-1 ring-[#FFC700]/30 transition-all group-hover/stat:scale-110 group-hover/stat:bg-[#FFC700]/30">
                  <Trophy className="h-3.5 w-3.5 text-[#FFC700]" />
                </div>
                <span className="font-display text-sm font-bold tabular-nums text-white">
                  {level}
                </span>
              </div>

              <span className="h-5 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              {/* Diamonds */}
              <Link
                href="/transactions"
                className="group/stat flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <div className="rounded-lg bg-[#FF1F7D]/20 p-1.5 ring-1 ring-[#FF1F7D]/30 transition-all group-hover/stat:scale-110 group-hover/stat:bg-[#FF1F7D]/30 group-hover/stat:shadow-lg group-hover/stat:shadow-[#FF1F7D]/30">
                  <Gem className="h-3.5 w-3.5 text-[#FF1F7D]" />
                </div>
                <span className="font-display text-sm font-bold tabular-nums text-white transition-colors group-hover/stat:text-[#FF1F7D]">
                  {diamonds.toLocaleString()}
                </span>
              </Link>

              <span className="h-5 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              {/* Points */}
              <Link
                href="/transactions"
                className="group/stat flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <div className="rounded-lg bg-[#8B5CF6]/20 p-1.5 ring-1 ring-[#8B5CF6]/30 transition-all group-hover/stat:scale-110 group-hover/stat:bg-[#8B5CF6]/30 group-hover/stat:shadow-lg group-hover/stat:shadow-[#8B5CF6]/30">
                  <Ticket className="h-3.5 w-3.5 text-[#8B5CF6]" />
                </div>
                <span className="font-display text-sm font-bold tabular-nums text-white transition-colors group-hover/stat:text-[#8B5CF6]">
                  {points.toLocaleString()}
                </span>
              </Link>
            </div>

            {/* Admin Link */}
            {userRole === 'ADMIN' && <AdminNavLink />}

            {/* Profile Button */}
            <Link
              href="/profile"
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF]/50 hover:bg-[#00F5FF]/10 hover:text-white hover:shadow-lg hover:shadow-[#00F5FF]/20"
            >
              <span className="sr-only">View profile</span>
              <ButtonIcon name="user" label="Profile" />
            </Link>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <MobileMenu diamonds={diamonds} hasCompletedTenDraw={hasCompletedTenDraw} points={points} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
