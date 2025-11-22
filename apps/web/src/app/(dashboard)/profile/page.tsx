import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function ProfilePage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user data with statistics
  let user
  let stats

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    user = {
      id: session.user.id,
      name: session.user.name || 'Test User',
      email: session.user.email || 'test@maffix.com',
      avatar: null,
      role: session.user.role || 'USER',
      diamondBalance: session.user.role === 'ADMIN' ? 10000 : 500,
      points: session.user.role === 'ADMIN' ? 5000 : 100,
      level: session.user.role === 'ADMIN' ? 10 : 1,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      completedTasks: [],
      prizes: [],
      transactions: [],
    }

    stats = {
      totalTasks: 0,
      totalPrizes: 0,
      redeemedPrizes: 0,
      totalEarned: 0,
    }
  } else {
    try {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
          completedTasks: {
            include: {
              task: true,
            },
          },
          prizes: {
            include: {
              prize: true,
            },
          },
          transactions: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
        },
      })

      if (!user) {
        redirect('/login')
      }

      stats = {
        totalTasks: user.completedTasks.length,
        totalPrizes: user.prizes.length,
        redeemedPrizes: user.prizes.filter((p) => p.redeemed).length,
        totalEarned: user.transactions
          .filter((t) => t.type === 'EARN')
          .reduce((sum, t) => sum + t.amount, 0),
      }
    } catch (error) {
      console.error('Database fetch failed:', error)
      redirect('/login')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage your account and view your statistics
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-gray-900 border border-gray-800 p-6 shadow">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5656] to-[#ff3333] text-4xl text-white">
                {user.avatar || '👤'}
              </div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="mt-2">
                <span className="rounded-full bg-[#FF5656] px-3 py-1 text-xs font-medium text-white">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Level</span>
                <span className="font-semibold text-white">
                  {user.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Diamonds</span>
                <span className="font-semibold text-white">
                  💎 {user.diamondBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Points</span>
                <span className="font-semibold text-white">
                  ⭐ {user.points.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="font-semibold text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-2">
          <div className="mb-6 rounded-lg bg-gray-900 border border-gray-800 p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Statistics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-800 border border-gray-700 p-4">
                <div className="text-2xl font-bold text-[#FF5656]">
                  {stats.totalTasks}
                </div>
                <div className="text-sm text-gray-400">Tasks Completed</div>
              </div>
              <div className="rounded-lg bg-gray-800 border border-gray-700 p-4">
                <div className="text-2xl font-bold text-[#FF5656]">
                  {stats.totalPrizes}
                </div>
                <div className="text-sm text-gray-400">Prizes Won</div>
              </div>
              <div className="rounded-lg bg-gray-800 border border-gray-700 p-4">
                <div className="text-2xl font-bold text-[#FF5656]">
                  {stats.redeemedPrizes}
                </div>
                <div className="text-sm text-gray-400">Prizes Redeemed</div>
              </div>
              <div className="rounded-lg bg-gray-800 border border-gray-700 p-4">
                <div className="text-2xl font-bold text-[#FF5656]">
                  💎 {stats.totalEarned.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Earned</div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-lg bg-gray-900 border border-gray-800 p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Recent Transactions
            </h3>
            {user.transactions.length === 0 ? (
              <p className="text-center text-gray-400">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {user.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-3 hover:border-[#FF5656] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          transaction.type === 'EARN' ||
                          transaction.type === 'PURCHASE' ||
                          transaction.type === 'GIFT'
                            ? 'text-[#FF5656]'
                            : 'text-red-400'
                        }`}
                      >
                        {transaction.type === 'EARN' ||
                        transaction.type === 'PURCHASE' ||
                        transaction.type === 'GIFT'
                          ? '+'
                          : '-'}
                        {transaction.amount}{' '}
                        {transaction.currency === 'DIAMONDS' ? '💎' : '⭐'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

