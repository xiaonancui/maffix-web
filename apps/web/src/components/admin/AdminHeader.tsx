'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface AdminHeaderProps {
  userName: string
  onMobileMenuToggle: () => void
}

export default function AdminHeader({ userName, onMobileMenuToggle }: AdminHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b-2 border-border dark:shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden rounded-md p-2 text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/admin"
            className="flex items-center text-xl font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
          >
            <span>Maffix Admin</span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users, missions, prizes..."
              className="w-full rounded-lg bg-secondary px-4 py-2 pl-10 text-sm text-foreground placeholder-muted-foreground backdrop-blur-sm border border-border focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              onFocus={() => setIsSearchExpanded(true)}
              onBlur={() => setIsSearchExpanded(false)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Search Icon */}
          <button
            className="md:hidden rounded-md p-2 text-foreground hover:bg-secondary transition-colors"
            aria-label="Search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Notifications */}
          <button
            className="relative rounded-md p-2 text-foreground hover:bg-secondary transition-colors"
            aria-label="Notifications"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-400 ring-2 ring-yellow-600" />
          </button>

          {/* Admin Badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-foreground backdrop-blur-sm border border-border">
            ADMIN MODE
          </span>

          {/* User Profile / Back to User View */}
          <Link
            href="/dashboard"
            className="group relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-500/20 px-4 py-2 text-sm font-bold text-foreground hover:from-blue-600/30 hover:to-blue-500/30 transition-all backdrop-blur-sm border-2 border-blue-500/40 hover:border-blue-500/60 dark:shadow-lg animate-pulse hover:animate-none"
            title="Switch to user dashboard view"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to User View</span>
            <span className="sm:hidden">👤</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

