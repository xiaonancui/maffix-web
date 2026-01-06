import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Gem, Target, Gift, Calendar, Users, TrendingUp, TrendingDown, Info } from 'lucide-react'

export default async function TransactionsPage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user's transaction history
  let transactions: any[] = []
  let user: any = null

  const isTestAccount =
    process.env.NODE_ENV === 'development' &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock data for test accounts
    user = {
      id: session.user.id,
      diamonds: 500,
    }

    transactions = [
      {
        id: 'tx-1',
        type: 'MISSION_REWARD',
        currency: 'DIAMONDS',
        amount: 50,
        description: 'Completed: Follow Artist on TikTok',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: 'tx-2',
        type: 'GACHA_PULL',
        currency: 'DIAMONDS',
        amount: -100,
        description: 'Single Gacha Draw',
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
      {
        id: 'tx-3',
        type: 'MISSION_REWARD',
        currency: 'DIAMONDS',
        amount: 100,
        description: 'Completed: Repost Video',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: 'tx-4',
        type: 'PREMIUM_PACK',
        currency: 'DIAMONDS',
        amount: 500,
        description: 'Purchased: Starter Pack',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: 'tx-5',
        type: 'GACHA_PULL',
        currency: 'DIAMONDS',
        amount: -1000,
        description: '10x Gacha Draw',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      },
      {
        id: 'tx-6',
        type: 'MISSION_REWARD',
        currency: 'DIAMONDS',
        amount: 75,
        description: 'Completed: Like Video',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
    ]
  } else {
    try {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          diamonds: true,
        },
      })

      // Fetch transactions
      transactions = await db.transaction.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50, // Limit to last 50 transactions
      })
    } catch (error) {
      console.error('Database fetch failed:', error)
      user = { id: session.user.id, diamonds: 0 }
      transactions = []
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'MISSION_REWARD':
        return <Target className="h-6 w-6 text-primary" />
      case 'GACHA_PULL':
        return <Gem className="h-6 w-6 text-primary" />
      case 'PREMIUM_PACK':
        return <Gift className="h-6 w-6 text-primary" />
      case 'DAILY_REWARD':
        return <Calendar className="h-6 w-6 text-primary" />
      case 'REFERRAL_BONUS':
        return <Users className="h-6 w-6 text-primary" />
      default:
        return <Gem className="h-6 w-6 text-primary" />
    }
  }

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600'
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`
    } else {
      return new Date(date).toLocaleDateString()
    }
  }

  // Calculate summary stats
  const totalEarned = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalSpent = Math.abs(
    transactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + tx.amount, 0)
  )

  const missionRewards = transactions.filter(
    (tx) => tx.type === 'MISSION_REWARD'
  ).length

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Transaction History</h1>
        <p className="mt-2 text-muted-foreground">
          Track all your diamond earnings and spending
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-card p-6 shadow border border-border hover:border-primary transition-colors">
          <div className="mb-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Gem className="h-4 w-4" />
            Current Balance
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Gem className="h-8 w-8" />
            {user?.diamonds || 0}
          </div>
        </div>

        <div className="rounded-lg bg-card p-6 shadow border border-border hover:border-green-600 transition-colors">
          <div className="mb-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Total Earned
          </div>
          <div className="text-3xl font-bold text-green-600 flex items-center gap-2">
            <Gem className="h-8 w-8" />
            {totalEarned}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {missionRewards} missions completed
          </div>
        </div>

        <div className="rounded-lg bg-card p-6 shadow border border-border hover:border-purple-600 transition-colors">
          <div className="mb-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Total Spent
          </div>
          <div className="text-3xl font-bold text-purple-600 flex items-center gap-2">
            <Gem className="h-8 w-8" />
            {totalSpent}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-lg bg-card shadow border border-border">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-xl font-bold text-foreground">Recent Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mb-4 text-6xl">📊</div>
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete missions to start earning diamonds!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xl font-bold flex items-center justify-end gap-2 ${getTransactionColor(
                      transaction.amount
                    )}`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount}
                    <Gem className="h-5 w-5" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.currency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {transactions.length > 0 && (
          <div className="border-t border-border px-6 py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing last {transactions.length} transactions
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 rounded-lg border-2 border-blue-600 bg-transparent p-6 dark:bg-blue-900/20">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-600">
              About Transactions
            </h3>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                All diamond transactions are recorded here. You can earn diamonds by
                completing missions, and spend them on gacha draws. Premium pack
                purchases will also appear in your transaction history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

