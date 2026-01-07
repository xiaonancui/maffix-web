'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function NavLink({ href, children, className = '' }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-bold tracking-tight transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-br from-[#FF1F7D]/20 to-[#8B5CF6]/10 text-white shadow-lg shadow-[#FF1F7D]/20'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      } ${className}`}
    >
      {children}
      {isActive && (
        <span className="absolute inset-0 rounded-xl border border-[#FF1F7D]/30" />
      )}
    </Link>
  )
}
