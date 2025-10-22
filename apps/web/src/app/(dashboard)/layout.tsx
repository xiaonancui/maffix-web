import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MobileMenu from '@/components/dashboard/MobileMenu'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user's diamond balance for display
  const { db } = await import('@/lib/db')
  let diamondBalance = 0

  const isTestAccount =
    process.env.NODE_ENV === 'development' &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    diamondBalance = 500
  } else {
    try {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { diamondBalance: true },
      })
      diamondBalance = user?.diamondBalance || 0
    } catch (error) {
      console.error('Failed to fetch user balance:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/dashboard" className="text-xl font-bold text-primary">
                  Maffix
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-900 hover:border-gray-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/missions"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Missions
                </Link>
                <Link
                  href="/gacha"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Gacha
                </Link>
                <Link
                  href="/store"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Store
                </Link>
                <Link
                  href="/prizes"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Prizes
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Diamond Balance */}
              <Link
                href="/transactions"
                className="hidden items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 sm:flex"
              >
                <span>💎</span>
                <span>{diamondBalance}</span>
              </Link>

              {/* Profile Icon */}
              <Link
                href="/profile"
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
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
              <MobileMenu diamondBalance={diamondBalance} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}

