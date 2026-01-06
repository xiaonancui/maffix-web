import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/auth/LogoutButton'
import { Progress } from '@/components/ui/progress'
import { getLevelProgress } from '@/lib/level-system'
import { Gem, Ticket, Star, AlertTriangle } from 'lucide-react'

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
      diamondBalance: session.user.role === 'ADMIN' ? 10000 : 500,
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
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your account and view your statistics
        </p>
      </div>

      {/* TikTok Connection Status */}
      {!user.tiktokUsername && (
        <div className="mb-8 rounded-lg border-2 border-yellow-600 bg-transparent p-6 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-300">
                TikTok Account Not Linked
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                <p>
                  Link your TikTok account to complete missions and earn rewards.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href="/profile/link-tiktok"
                  className="inline-flex items-center rounded-md border-2 border-yellow-600 bg-transparent px-3 py-2 text-sm font-semibold text-yellow-600 hover:bg-yellow-600/10 transition-colors dark:bg-yellow-600 dark:text-primary-foreground dark:hover:bg-yellow-700"
                >
                  Link TikTok Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-card border border-border p-6 shadow">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary bg-transparent text-4xl text-primary dark:bg-gradient-to-r dark:from-primary dark:to-red-500 dark:text-primary-foreground dark:border-transparent">
                {user.avatar || '👤'}
              </div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <span className="rounded-full border-2 border-primary bg-transparent px-3 py-1 text-xs font-medium text-primary dark:bg-primary dark:text-primary-foreground dark:border-transparent">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mb-4 border-b border-border pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Level</span>
                <span className="font-semibold text-primary text-lg">
                  Lv.{user.level || 1}
                </span>
              </div>
              {/* Note: XP-based leveling removed, showing level only */}
              <div className="text-xs text-muted-foreground text-center">
                Current Level
              </div>
            </div>

            {/* Balances */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Gem className="h-4 w-4" />
                  Diamonds
                </span>
                <span className="font-semibold text-foreground">
                  {user.diamondBalance?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Ticket className="h-4 w-4" />
                  Points
                </span>
                <span className="font-semibold text-foreground">
                  {user.points?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="font-semibold text-foreground">
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
          <div className="mb-6 rounded-lg bg-card border border-border p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Statistics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-secondary border border-border p-4">
                <div className="text-2xl font-bold text-[#FF5656]">
                  {stats.totalTasks}
                </div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
              <div className="rounded-lg bg-secondary border border-border p-4">
                <div className="text-2xl font-bold text-[#FF5656]">
                  {stats.totalPrizes}
                </div>
                <div className="text-sm text-muted-foreground">Prizes Won</div>
              </div>
              <div className="rounded-lg bg-secondary border border-border p-4">
                <div className="text-2xl font-bold text-[#FF5656]">
                  {stats.redeemedPrizes}
                </div>
                <div className="text-sm text-muted-foreground">Prizes Redeemed</div>
              </div>
              <div className="rounded-lg bg-secondary border border-border p-4">
                <div className="text-2xl font-bold text-[#FF5656]">
                  💎 {stats.totalEarned.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-lg bg-card border border-border p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Recent Transactions
            </h3>
            {user.transactions.length === 0 ? (
              <p className="text-center text-muted-foreground">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {user.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary p-3 hover:border-[#FF5656] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
                      <p className="text-xs text-muted-foreground">
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

