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
  let diamonds = 0
  let tickets = 0 // Changed from points to tickets

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock data for test accounts
    diamonds = session.user.role === 'ADMIN' ? 10000 : 3000
    tickets = session.user.role === 'ADMIN' ? 50 : 10 // Changed from points to tickets
  } else {
    try {
      const { db } = await import('@/lib/db')

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          diamonds: true,
          tickets: true, // Changed from points to tickets
        },
      })

      diamonds = user?.diamonds || 0
      tickets = user?.tickets || 0 // Changed from points to tickets
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header - removed since client component has video background */}

      {/* Client Component for Interactive Elements */}
      <AuraZoneClient
        diamonds={diamonds}
        tickets={tickets} // Changed from points to tickets
        userId={session.user.id}
        userRole={session.user.role || 'USER'}
      />
    </div>
  )
}
