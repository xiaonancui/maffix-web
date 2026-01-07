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

  // Fetch user's diamond balance, points, and level for display
  let diamonds = 0
  let points = 0
  let level = 1
  let hasCompletedTenDraw = false

  if (isTestAccount) {
    diamonds = session.user.role === 'ADMIN' ? 10000 : 500
    points = session.user.role === 'ADMIN' ? 50 : 5
    level = session.user.role === 'ADMIN' ? 10 : 1
    hasCompletedTenDraw = true // Test accounts have access to Store by default
  } else {
    try {
      const { db } = await import('@/lib/db')

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          diamonds: true,
          points: true,
          level: true,
          hasCompletedTenDraw: true,
        },
      })
      diamonds = user?.diamonds || 0
      points = user?.points || 0
      level = user?.level || 1
      hasCompletedTenDraw = user?.hasCompletedTenDraw || false
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface-base text-foreground">
      {/* Ambient gradient layers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-0 top-[-30%] h-[420px] bg-[radial-gradient(circle_at_top,_rgba(124,77,255,0.35),_transparent_65%)] blur-3xl" />
        <div className="absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 bg-[radial-gradient(circle,_rgba(255,106,58,0.35),_transparent_65%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      </div>

      {/* Navigation */}
      <div className="relative z-40">
        <DashboardNav
          diamonds={diamonds}
          points={points}
          level={level}
          hasCompletedTenDraw={hasCompletedTenDraw}
          userRole={session.user.role || 'USER'}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1">{children}</main>

      {/* Footer */}
      <div className="relative z-10">
        <DashboardFooter />
      </div>
    </div>
  )
}
