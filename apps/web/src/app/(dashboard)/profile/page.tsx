import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'
import { User } from 'lucide-react'

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
      tiktokUsername: null, // Not linked yet
      diamonds: session.user.role === 'ADMIN' ? 10000 : 500,
      points: session.user.role === 'ADMIN' ? 5000 : 100,
      level: session.user.role === 'ADMIN' ? 10 : 1,
      xp: session.user.role === 'ADMIN' ? 3250 : 0,
      ticketBalance: session.user.role === 'ADMIN' ? 50 : 5,
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

  // Calculate level progress
  // Note: XP-based leveling removed, using simple level counter
  const levelProgress = {
    currentLevel: user.level || 1,
    currentXP: 0,
    xpNeeded: 100,
    progressPercentage: 0,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black uppercase tracking-wider text-white">Profile</h1>
        <p className="mt-2 text-sm text-white/60">
          Manage your account and view your statistics
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#FF1F7D] bg-gradient-to-br from-[#FF1F7D]/20 to-[#FF1F7D]/10 shadow-lg shadow-[#FF1F7D]/30">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h2 className="font-display text-2xl font-black text-white">{user.name}</h2>
                <p className="text-sm text-white/60">{user.email}</p>
                <div className="mt-3">
                  <span className="inline-flex rounded-full border-2 border-[#FF1F7D]/40 bg-[#FF1F7D]/20 px-4 py-1.5 font-display text-xs font-black uppercase tracking-wider text-[#FF1F7D] shadow-lg shadow-[#FF1F7D]/20">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <LogoutButton />
          </div>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-2">
          <div className="mb-6 rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
            <h3 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">
              Statistics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-[#00F5FF]/20 bg-gradient-to-br from-[#00F5FF]/10 to-[#00F5FF]/5 p-4 shadow-lg shadow-[#00F5FF]/10">
                <div className="font-display text-3xl font-black text-[#00F5FF]">
                  {stats.totalTasks}
                </div>
                <div className="text-sm text-white/60">Missions Completed</div>
              </div>
              <div className="rounded-2xl border-2 border-[#FFC700]/20 bg-gradient-to-br from-[#FFC700]/10 to-[#FFC700]/5 p-4 shadow-lg shadow-[#FFC700]/10">
                <div className="font-display text-3xl font-black text-[#FFC700]">
                  {user.diamonds?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-white/60">Diamonds</div>
              </div>
              <div className="rounded-2xl border-2 border-[#8B5CF6]/20 bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/5 p-4 shadow-lg shadow-[#8B5CF6]/10">
                <div className="font-display text-3xl font-black text-[#8B5CF6]">
                  {user.points?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-white/60">Points</div>
              </div>
              <div className="rounded-2xl border-2 border-[#10B981]/20 bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5 p-4 shadow-lg shadow-[#10B981]/10">
                <div className="font-display text-3xl font-black text-[#10B981]">
                  {stats.totalEarned.toLocaleString()}
                </div>
                <div className="text-sm text-white/60">Total Earned</div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
            <h3 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">
              Recent Transactions
            </h3>
            {user.transactions.length === 0 ? (
              <p className="text-center text-white/60">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {user.transactions.map((transaction) => {
                  const isPositive = transaction.type === 'EARN' || transaction.type === 'PURCHASE' || transaction.type === 'GIFT'
                  const color = isPositive ? '#10B981' : '#FF1F7D'
                  return (
                    <div
                      key={transaction.id}
                      className={`flex items-center justify-between rounded-xl border-2 border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-[${color}]/40`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-white/60">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-sm font-bold"
                          style={{ color }}
                        >
                          {isPositive ? '+' : '-'}
                          {transaction.amount}{' '}
                          {transaction.currency === 'DIAMONDS' ? '💎' : '⭐'}
                        </p>
                        <p className="text-xs text-white/60">
                          {transaction.type}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

