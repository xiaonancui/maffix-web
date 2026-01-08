import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'
import { User, Trophy, Sparkles, Ticket, Star } from 'lucide-react'
import { getLevelProgress, getLevelInfo } from '@/lib/level-system'

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
      tickets: session.user.role === 'ADMIN' ? 50 : 5,
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

  // Calculate level progress using the level system
  const levelProgress = getLevelProgress(user.xp || 0, user.level || 1)
  const nextLevelInfo = getLevelInfo(Math.min((user.level || 1) + 1, 50))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black uppercase tracking-wider text-white">Profile</h1>
        <p className="mt-2 text-sm text-white/60">
          Manage your account and view your statistics
        </p>
      </div>

      {/* Level & Progress Stats Card */}
      <div className="mb-8 rounded-3xl border-2 border-[#FFC700]/30 bg-gradient-to-br from-[#FFC700]/10 via-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm shadow-xl shadow-[#FFC700]/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Level Display */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-[#FFC700] bg-gradient-to-br from-[#FFC700]/30 to-[#FFC700]/10 shadow-lg shadow-[#FFC700]/40">
                <Trophy className="h-10 w-10 text-[#FFC700]" />
              </div>
              {levelProgress.nextLevel?.isMilestone && levelProgress.currentLevel < 50 && (
                <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#FF1F7D] to-[#8B5CF6] shadow-lg">
                  <Star className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium uppercase tracking-wider text-[#FFC700]">Level</div>
              <div className="font-display text-5xl font-black text-white">{levelProgress.currentLevel}</div>
              <div className="text-sm text-white/60">
                {levelProgress.currentLevel >= 50 ? 'Max Level!' : `Next: Level ${levelProgress.currentLevel + 1}`}
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="flex-1 lg:max-w-md">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00F5FF]" />
                <span className="text-sm font-medium text-white">Experience</span>
              </div>
              <span className="font-display text-sm font-bold text-[#00F5FF]">
                {(user.xp || 0).toLocaleString()} XP
              </span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] transition-all duration-500"
                style={{ width: `${levelProgress.progressPercent}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="mt-1 flex justify-between text-xs text-white/50">
              <span>{levelProgress.xpInCurrentLevel.toLocaleString()} XP in level</span>
              <span>{levelProgress.xpToNextLevel > 0 ? `${levelProgress.xpToNextLevel.toLocaleString()} XP to next` : 'Max Level'}</span>
            </div>
          </div>

          {/* Ticket Balance */}
          <div className="flex items-center gap-4 rounded-2xl border-2 border-[#8B5CF6]/30 bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5 px-6 py-4 shadow-lg shadow-[#8B5CF6]/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#8B5CF6]/50 bg-[#8B5CF6]/20">
              <Ticket className="h-7 w-7 text-[#8B5CF6]" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-[#8B5CF6]">Tickets</div>
              <div className="font-display text-3xl font-black text-white">
                {(user.tickets || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Next Level Reward Preview */}
        {levelProgress.currentLevel < 50 && nextLevelInfo && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="text-sm text-white/60">Level {levelProgress.currentLevel + 1} reward:</span>
            <span className="font-display text-sm font-bold text-[#FFC700]">
              +{nextLevelInfo.diamondReward} Diamonds
            </span>
            {nextLevelInfo.isMilestone && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-[#FF1F7D]/40 bg-[#FF1F7D]/20 px-2 py-0.5 text-xs font-bold text-[#FF1F7D]">
                <Star className="h-3 w-3" />
                Milestone
              </span>
            )}
          </div>
        )}
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

