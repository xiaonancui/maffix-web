import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

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
      diamondBalance: 500,
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
          diamondBalance: true,
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
      user = { id: session.user.id, diamondBalance: 0 }
      transactions = []
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'MISSION_REWARD':
        return '🎯'
      case 'GACHA_PULL':
        return '🎰'
      case 'PREMIUM_PACK':
        return '🎁'
      case 'DAILY_REWARD':
        return '📅'
      case 'REFERRAL_BONUS':
        return '👥'
      default:
        return '💎'
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
        <h1 className="text-4xl font-bold text-white">Transaction History</h1>
        <p className="mt-2 text-gray-400">
          Track all your diamond earnings and spending
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 shadow border border-blue-800/30">
          <div className="mb-2 text-sm font-medium text-[#FF5656]">
            Current Balance
          </div>
          <div className="text-3xl font-bold text-blue-300">
            💎 {user?.diamondBalance || 0}
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-900/30 to-green-800/30 p-6 shadow border border-green-800/30">
          <div className="mb-2 text-sm font-medium text-green-400">
            Total Earned
          </div>
          <div className="text-3xl font-bold text-green-300">
            💎 {totalEarned}
          </div>
          <div className="mt-1 text-xs text-green-400">
            {missionRewards} missions completed
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 shadow border border-purple-800/30">
          <div className="mb-2 text-sm font-medium text-[#FF5656]">
            Total Spent
          </div>
          <div className="text-3xl font-bold text-purple-300">
            💎 {totalSpent}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-lg bg-gray-900 shadow border border-gray-800">
        <div className="border-b border-gray-800 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mb-4 text-6xl">📊</div>
            <p className="text-gray-400">No transactions yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Complete missions to start earning diamonds!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-2xl">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xl font-bold ${getTransactionColor(
                      transaction.amount
                    )}`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount} 💎
                  </div>
                  <div className="text-xs text-gray-400">
                    {transaction.currency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {transactions.length > 0 && (
          <div className="border-t border-gray-800 px-6 py-4 text-center">
            <p className="text-sm text-gray-400">
              Showing last {transactions.length} transactions
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 rounded-lg bg-blue-900/20 p-6 border border-blue-800/30">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-[#FF5656]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-300">
              About Transactions
            </h3>
            <div className="mt-2 text-sm text-blue-400">
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

