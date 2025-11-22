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
      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors ${
        isActive
          ? 'border-[#FF5656] text-white'
          : 'border-transparent text-white/80 hover:border-[#FF5656]/50 hover:text-white'
      } ${className}`}
    >
      {children}
    </Link>
  )
}

