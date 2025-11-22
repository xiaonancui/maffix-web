import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'
import DashboardFooter from '@/components/dashboard/DashboardFooter'

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <DashboardNav
        diamondBalance={diamondBalance}
        hasCompletedTenDraw={hasCompletedTenDraw}
        userRole={session.user.role || 'USER'}
      />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  )
}
