import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MobileMenu from '@/components/dashboard/MobileMenu'
import NavLink from '@/components/dashboard/NavLink'
import AdminNavLink from '@/components/dashboard/AdminNavLink'
import SignOutButton from '@/components/dashboard/SignOutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  // Fetch user's diamond balance and 10x draw status for display
  let diamondBalance = 0
  let hasCompletedTenDraw = false

  if (isTestAccount) {
    diamondBalance = 500
    hasCompletedTenDraw = true // Test accounts have access to Store by default
  } else {
    try {
      const { db } = await import('@/lib/db')

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          diamondBalance: true,
          hasCompletedTenDraw: true,
        },
      })
      diamondBalance = user?.diamondBalance || 0
      hasCompletedTenDraw = user?.hasCompletedTenDraw || false
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/dashboard" className="text-xl font-bold text-white">
                  Maffix
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/releases">Releases</NavLink>
                <NavLink href="/missions">Missions</NavLink>
                <NavLink href="/gacha">Gacha</NavLink>
                {/* Store: Only show after completing first 10x draw */}
                {hasCompletedTenDraw && <NavLink href="/store">Store</NavLink>}
                {/* Hidden: Premium Packs - Route still accessible via direct URL */}
                {/* <NavLink href="/store/packs">Premium Packs</NavLink> */}
                <NavLink href="/music-detection">Music Detection</NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Diamond Balance */}
              <Link
                href="/transactions"
                className="hidden items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 sm:flex transition-colors"
              >
                <span>💎</span>
                <span className="text-[#FF5656]">{diamondBalance}</span>
              </Link>

              {/* Admin Panel Link (only for admins) */}
              {session.user.role === 'ADMIN' && <AdminNavLink />}

              {/* Sign Out Button (Desktop) */}
              <SignOutButton />

              {/* Profile Icon */}
              <Link
                href="/profile"
                className="rounded-full bg-white/20 p-1 text-white hover:bg-white/30 transition-colors"
              >
                <span className="sr-only">View profile</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </Link>

              {/* Mobile Menu Button */}
              <MobileMenu diamondBalance={diamondBalance} hasCompletedTenDraw={hasCompletedTenDraw} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
