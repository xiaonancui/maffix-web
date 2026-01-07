'use client'

import Link from 'next/link'
import { Menu, Bell, ArrowLeft } from 'lucide-react'

interface AdminHeaderProps {
  userName: string
  onMobileMenuToggle: () => void
}

export default function AdminHeader({ userName, onMobileMenuToggle }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-white/10 bg-gradient-to-r from-surface-card/95 via-surface-raised/95 to-surface-card/95 backdrop-blur-xl shadow-xl shadow-black/20">
      {/* Ambient top glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-[#FF1F7D]/10 via-[#8B5CF6]/10 to-transparent blur-3xl" />

      <div className="relative flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuToggle}
            className="group lg:hidden rounded-xl p-2 text-white transition-all duration-300 hover:bg-white/10 hover:scale-110"
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5 transition-transform group-hover:rotate-90" />
          </button>

          {/* Logo */}
          <Link
            href="/admin"
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <span className="font-display text-xl font-black tracking-tight text-white">
              MAFFIX ADMIN
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="group relative rounded-xl p-2 text-white transition-all duration-300 hover:bg-white/10 hover:scale-110"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
            {/* Notification Badge - Hot Pink */}
            <span className="absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full bg-[#FF1F7D] ring-2 ring-[#FF1F7D]/50 shadow-[0_0_8px_rgba(255,31,125,0.8)]" />
          </button>

          {/* Back to User View - Cyan Theme */}
          <Link
            href="/dashboard"
            className="group relative flex items-center gap-2 rounded-2xl border-2 border-[#00F5FF]/40 bg-gradient-to-r from-[#00F5FF]/20 to-[#00F5FF]/10 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm shadow-lg shadow-[#00F5FF]/20 transition-all duration-300 hover:scale-105 hover:border-[#00F5FF]/60 hover:shadow-[#00F5FF]/40"
            title="Switch to user dashboard view"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">User View</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

