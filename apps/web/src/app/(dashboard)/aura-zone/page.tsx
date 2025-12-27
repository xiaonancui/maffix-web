import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Gem, Ticket } from 'lucide-react'
import AuraZoneClient from './aura-zone-client'

export const metadata = {
  title: 'Aura Zone - Maffix',
  description: 'Draw exclusive prizes in the Aura Zone',
}

export default async function AuraZonePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user data for balances
  let diamondBalance = 0
  let points = 0

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock data for test accounts
    diamondBalance = session.user.role === 'ADMIN' ? 10000 : 3000
    points = session.user.role === 'ADMIN' ? 50 : 10
  } else {
    try {
      const { db } = await import('@/lib/db')

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          diamondBalance: true,
          points: true,
        },
      })

      diamondBalance = user?.diamondBalance || 0
      points = user?.points || 0
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Aura Zone</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Draw exclusive prizes and collect rare items
        </p>
      </div>

      {/* Balance Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {/* Diamond Balance */}
        <div className="rounded-lg bg-card border border-border p-6 text-foreground shadow-lg hover:border-primary transition-colors">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Gem className="h-4 w-4" />
            Diamond Balance
          </p>
          <p className="text-4xl font-bold flex items-center gap-2 mt-2">
            <Gem className="h-8 w-8 text-primary" />
            {diamondBalance.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {Math.floor(diamondBalance / 3000)} 10x draws available
          </p>
        </div>

        {/* Points Balance */}
        <div className="rounded-lg bg-card border border-border p-6 text-foreground shadow-lg hover:border-primary transition-colors">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Points Balance
          </p>
          <p className="text-4xl font-bold flex items-center gap-2 mt-2">
            <Ticket className="h-8 w-8 text-primary" />
            {points.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {Math.floor(points / 10)} 10x draws available
          </p>
        </div>
      </div>

      {/* Client Component for Interactive Elements */}
      <AuraZoneClient
        diamondBalance={diamondBalance}
        points={points}
        userId={session.user.id}
        userRole={session.user.role || 'USER'}
      />
    </div>
  )
}
