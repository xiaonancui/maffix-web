import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Gem, Target, TrendingUp, TrendingDown, Trophy, Sparkles, Gift, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  type DashboardUser = {
    id: string
    name: string
    email: string
    avatar: string | null
    role: string
    diamondBalance: number
    points: number
    level: number
    createdAt: Date
    lastLoginAt: Date | null
  }

  const fallbackUser: DashboardUser = {
    id: session.user.id ?? 'unknown-user',
    name: session.user.name ?? 'Maffix User',
    email: session.user.email ?? 'unknown@maffix.com',
    avatar: null,
    role: (session.user.role as string) ?? 'USER',
    diamondBalance: session.user.role === 'ADMIN' ? 10000 : 500,
    points: session.user.role === 'ADMIN' ? 5000 : 250,
    level: session.user.role === 'ADMIN' ? 10 : 3,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  }

  // Use mock data for all users (database not connected)
  let user: DashboardUser = fallbackUser
  let missions: any[] = []
  let completedMissions = 0
  let pendingMissions = 0
  let gachaPulls: any[] = []
  let recentTransactions: any[] = []
  let rarityStats = { SSR: 0, LEGENDARY: 0, EPIC: 0, RARE: 0, COMMON: 0 }

  // Always use mock data
  if (true) {
    console.log('📊 Using mock data for user:', session.user.email)
    user = {
      ...fallbackUser,
      diamondBalance: session.user.role === 'ADMIN' ? 10000 : 1250,
      points: session.user.role === 'ADMIN' ? 5000 : 850,
      level: session.user.role === 'ADMIN' ? 10 : 5,
    }

    // Mock mission stats
    completedMissions = 12
    pendingMissions = 3

    // Mock gacha pulls with rarity distribution
    gachaPulls = [
      {
        id: 'pull-1',
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        prize: { name: 'VIP Concert Ticket', rarity: 'LEGENDARY' },
      },
      {
        id: 'pull-2',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        prize: { name: 'Signed Album', rarity: 'EPIC' },
      },
      {
        id: 'pull-3',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        prize: { name: 'Exclusive Poster', rarity: 'RARE' },
      },
    ]

    rarityStats = { SSR: 2, LEGENDARY: 3, EPIC: 8, RARE: 15, COMMON: 25 }

    // Mock recent transactions
    recentTransactions = [
      {
        id: 'tx-1',
        type: 'MISSION_REWARD',
        currency: 'DIAMONDS',
        amount: 400,
        description: 'Completed: Create Video with "Midnight Dreams"',
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
      },
      {
        id: 'tx-2',
        type: 'GACHA_PULL',
        currency: 'DIAMONDS',
        amount: -100,
        description: 'Single Gacha Draw',
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
      },
      {
        id: 'tx-3',
        type: 'MISSION_REWARD',
        currency: 'DIAMONDS',
        amount: 150,
        description: 'Completed: Repost New Music Video',
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
      },
      {
        id: 'tx-4',
        type: 'MISSION_REWARD',
        currency: 'DIAMONDS',
        amount: 60,
        description: 'Completed: Like New Single Release',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      },
      {
        id: 'tx-5',
        type: 'GACHA_PULL',
        currency: 'DIAMONDS',
        amount: -1000,
        description: '10x Gacha Draw',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
    ]
  }

  // Calculate stats
  const totalMissions = completedMissions + pendingMissions
  const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0
  const totalGachaPulls = Object.values(rarityStats).reduce((a, b) => a + b, 0)
  const currentLevelXP = user.level * 100
  const nextLevelXP = (user.level + 1) * 100
  const xpProgress = Math.min(((user.points % 100) / 100) * 100, 100)

  // Calculate diamond trend (mock calculation based on recent transactions)
  const recentIncome = recentTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const recentExpense = Math.abs(recentTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
  const diamondTrend = recentIncome - recentExpense

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Level {user.level} • {user.role} • Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Diamond Balance with Trend */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-border p-6 shadow-lg transition-all hover:border-primary hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-primary opacity-10"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Gem className="h-4 w-4" />
                  Diamond Balance
                </span>
                {diamondTrend !== 0 && (
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      diamondTrend > 0 ? 'text-primary' : 'text-red-400'
                    }`}
                  >
                    {diamondTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(diamondTrend)}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">{user.diamondBalance.toLocaleString()}</span>
                <Gem className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {diamondTrend > 0 ? 'Earning well!' : diamondTrend < 0 ? 'Spending active' : 'Stable balance'}
              </p>
            </div>
          </div>

          {/* Mission Completion */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-border p-6 shadow-lg transition-all hover:border-primary hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-primary opacity-10"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Mission Stats
                </span>
                <span className="text-xs font-semibold text-primary">{completionRate}%</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-foreground">{completedMissions}</span>
                <span className="ml-2 text-xl text-muted-foreground">/ {totalMissions}</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {pendingMissions > 0 ? `${pendingMissions} pending verification` : 'All caught up! 🎉'}
              </p>
            </div>
          </div>

          {/* Gacha Stats */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-border p-6 shadow-lg transition-all hover:border-primary hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-primary opacity-10"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Gacha Pulls
                </span>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-foreground">{totalGachaPulls}</span>
                <span className="ml-2 text-xl text-muted-foreground">total</span>
              </div>
              <div className="mt-3 flex gap-1 text-xs text-muted-foreground">
                <span title="SSR">⭐⭐⭐: {rarityStats.SSR}</span>
                <span className="mx-1">•</span>
                <span title="Legendary">🌟: {rarityStats.LEGENDARY}</span>
                <span className="mx-1">•</span>
                <span title="Epic">✨: {rarityStats.EPIC}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {rarityStats.SSR + rarityStats.LEGENDARY > 0 ? 'Lucky streak! 🍀' : 'Keep pulling!'}
              </p>
            </div>
          </div>

          {/* Level & XP */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-border p-6 shadow-lg transition-all hover:border-primary hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-primary opacity-10"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Level & XP
                </span>
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-foreground">Lv.{user.level}</span>
                <span className="ml-2 text-xl text-muted-foreground">{user.points.toLocaleString()} pts</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {Math.round(100 - xpProgress)}% to Level {user.level + 1}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-card border border-border p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Recent Activity
                </h2>
                <Link
                  href="/transactions"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {recentTransactions.length === 0 && gachaPulls.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No recent activity yet. Start completing missions!</p>
                  <Link
                    href="/missions"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-transparent px-6 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-all dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                  >
                    <Target className="h-4 w-4" />
                    Browse Missions
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Combine and sort activities */}
                  {[
                    ...recentTransactions.slice(0, 3).map((tx) => ({
                      type: 'transaction',
                      data: tx,
                      time: tx.createdAt,
                    })),
                    ...gachaPulls.slice(0, 2).map((pull) => ({
                      type: 'gacha',
                      data: pull,
                      time: pull.createdAt,
                    })),
                  ]
                    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                    .slice(0, 5)
                    .map((activity, index) => {
                      if (activity.type === 'transaction') {
                        const tx = activity.data
                        const isIncome = tx.amount > 0
                        return (
                          <div
                            key={`tx-${tx.id}`}
                            className="flex items-start gap-4 rounded-lg border border-border bg-secondary p-4 transition-all hover:border-primary hover:shadow-md"
                          >
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                isIncome ? 'bg-primary/20' : 'bg-red-900/20'
                              }`}
                            >
                              {tx.type === 'MISSION_REWARD' ? (
                                <Target className="h-5 w-5 text-primary" />
                              ) : tx.type === 'GACHA_PULL' ? (
                                <Gift className="h-5 w-5 text-primary" />
                              ) : tx.type === 'PREMIUM_PACK' ? (
                                <Sparkles className="h-5 w-5 text-primary" />
                              ) : (
                                <Gem className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-foreground">{tx.description}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {new Date(tx.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <span
                                  className={`ml-4 text-lg font-bold flex items-center gap-1 ${
                                    isIncome ? 'text-primary' : 'text-red-400'
                                  }`}
                                >
                                  {isIncome ? '+' : ''}
                                  {tx.amount}
                                  <Gem className="h-4 w-4" />
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      } else {
                        const pull = activity.data
                        const rarityColors = {
                          SSR: 'from-primary to-primary/80',
                          LEGENDARY: 'from-primary to-primary/80',
                          EPIC: 'from-purple-600 to-purple-700',
                          RARE: 'from-blue-600 to-blue-700',
                          COMMON: 'from-secondary to-secondary',
                        }
                        const rarityColor =
                          rarityColors[pull.prize.rarity as keyof typeof rarityColors] ||
                          'from-secondary to-secondary'

                        return (
                          <div
                            key={`pull-${pull.id}`}
                            className="flex items-start gap-4 rounded-lg border border-border bg-secondary p-4 transition-all hover:border-primary hover:shadow-md"
                          >
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${rarityColor}`}
                            >
                              <Gift className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-foreground">
                                    Won: {pull.prize.name}
                                  </p>
                                  <div className="mt-1 flex items-center gap-2">
                                    <span
                                      className={`rounded-full bg-gradient-to-r ${rarityColor} px-2 py-0.5 text-xs font-bold text-primary-foreground`}
                                    >
                                      {pull.prize.rarity}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(pull.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                {pull.prize.rarity === 'SSR' || pull.prize.rarity === 'LEGENDARY' ? (
                                  <Sparkles className="ml-4 h-6 w-6 text-primary" />
                                ) : (
                                  <Gift className="ml-4 h-6 w-6 text-primary" />
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      }
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-xl bg-card border border-border p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/missions"
                  className="group flex items-center gap-3 rounded-lg border-2 border-border bg-secondary p-4 transition-all hover:border-primary hover:shadow-md"
                >
                  <Target className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Browse Missions</p>
                    <p className="text-xs text-muted-foreground">Earn diamonds & rewards</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/gacha"
                  className="group flex items-center gap-3 rounded-lg border-2 border-border bg-secondary p-4 transition-all hover:border-primary hover:shadow-md"
                >
                  <Gift className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Try Your Luck</p>
                    <p className="text-xs text-muted-foreground">Win exclusive prizes</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/store"
                  className="group flex items-center gap-3 rounded-lg border-2 border-border bg-secondary p-4 transition-all hover:border-primary hover:shadow-md"
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Shop Merch</p>
                    <p className="text-xs text-muted-foreground">Official merchandise</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/prizes"
                  className="group flex items-center gap-3 rounded-lg border-2 border-border bg-secondary p-4 transition-all hover:border-primary hover:shadow-md"
                >
                  <Trophy className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">My Prizes</p>
                    <p className="text-xs text-muted-foreground">View your collection</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}
