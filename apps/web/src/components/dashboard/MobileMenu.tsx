'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUserRole } from '@/lib/rbac'
import { signOut } from 'next-auth/react'
import { NavIcon } from '@/components/icons/Icon'
import { Gem, Ticket } from 'lucide-react'
import { ENABLE_PREMIUM_PACKS } from '@/lib/constants'

export default function MobileMenu({
  diamonds,
  points = 0
}: {
  diamonds: number
  points?: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const role = useUserRole()
  const isAdmin = role === 'ADMIN'

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  return (
    <div className="sm:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md p-2 text-foreground/80 hover:bg-white/20 hover:text-foreground transition-colors"
      >
        <span className="sr-only">Open menu</span>
        <NavIcon name={isOpen ? 'times' : 'bars'} />
      </button>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-border bg-secondary shadow-lg">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {/* Balance Display */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-background px-3 py-1.5">
                <Gem className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{diamonds.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-background px-3 py-1.5">
                <Ticket className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{points.toLocaleString()}</span>
              </div>
            </div>

            {/* Admin Panel Link (only for admins) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-md bg-background border-2 border-[#FF5656] px-3 py-2 text-base font-medium text-[#FF5656] hover:bg-[#FF5656]/10 transition-colors dark:bg-[#FF5656] dark:text-foreground dark:border-transparent dark:hover:bg-[#ff3333]"
                onClick={() => setIsOpen(false)}
              >
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Navigation Links */}
            <Link
              href="/dashboard"
              className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-[#FF5656]/20 text-[#FF5656] font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/missions"
              className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                isActive('/missions')
                  ? 'bg-[#FF5656]/20 text-[#FF5656] font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Missions
            </Link>
            <Link
              href="/aura-zone"
              className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                isActive('/aura-zone')
                  ? 'bg-[#FF5656]/20 text-[#FF5656] font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Aura Zone
            </Link>
            {/* Store: Always accessible (removed 10x draw gate) */}
            <Link
              href="/store"
              className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                isActive('/store')
                  ? 'bg-[#FF5656]/20 text-[#FF5656] font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Store
            </Link>
            {ENABLE_PREMIUM_PACKS && (
              <Link
                href="/store/packs"
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                  isActive('/store/packs')
                    ? 'bg-[#FF5656]/20 text-[#FF5656] font-semibold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Packs
              </Link>
            )}
            <Link
              href="/profile"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>

            {/* Sign Out Button */}
            <div className="mt-4 border-t border-border pt-4">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-red-500/20 hover:border-red-500/40"
              >
                <NavIcon name="sign-out-alt" label="Sign Out" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
