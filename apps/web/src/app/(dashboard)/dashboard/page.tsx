import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function DashboardPage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

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

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  const fallbackUser: DashboardUser = {
    id: session.user.id ?? 'unknown-user',
    name: session.user.name ?? 'Maffix User',
    email: session.user.email ?? 'unknown@maffix.com',
    avatar: null,
    role: (session.user.role as string) ?? 'USER',
    diamondBalance: session.user.role === 'ADMIN' ? 10000 : 0,
    points: session.user.role === 'ADMIN' ? 5000 : 0,
    level: session.user.role === 'ADMIN' ? 10 : 1,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  }

  // Fetch user data with gamification stats
  let user: DashboardUser = fallbackUser
  let missions: any[] = []
  let completedMissions = 0
  let pendingMissions = 0
  let gachaPulls: any[] = []
  let recentTransactions: any[] = []
  let rarityStats = { SSR: 0, LEGENDARY: 0, EPIC: 0, RARE: 0, COMMON: 0 }

  if (isTestAccount) {
    console.log('📊 Using mock data for test account:', session.user.email)
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
  } else {
    // Fetch from database for real users
    try {
      const dbUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          diamondBalance: true,
          points: true,
          level: true,
          createdAt: true,
          lastLoginAt: true,
        },
      })

      if (dbUser) {
        user = dbUser
      } else {
        console.warn('No user record found, using fallback data for session user:', session.user.id)
      }

      // Fetch mission stats
      const userMissions = await db.userTask.findMany({
        where: { userId: session.user.id },
        select: { verified: true, verificationStatus: true },
      })
      completedMissions = userMissions.filter((m) => m.verified).length
      pendingMissions = userMissions.filter((m) => !m.verified && m.verificationStatus === 'PENDING').length

      // Fetch recent gacha pulls
      gachaPulls = await db.gachaPull.findMany({
        where: { userId: session.user.id },
        include: { prize: { select: { name: true, rarity: true } } },
        orderBy: { pulledAt: 'desc' },
        take: 5,
      })

      // Calculate rarity stats
      const allPulls = await db.gachaPull.findMany({
        where: { userId: session.user.id },
        include: { prize: { select: { rarity: true } } },
      })
      allPulls.forEach((pull) => {
        if (pull.prize) {
          const rarity = pull.prize.rarity as keyof typeof rarityStats
          if (rarity in rarityStats) rarityStats[rarity]++
        }
      })

      // Fetch recent transactions
      recentTransactions = await db.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })
    } catch (error) {
      console.error('Database fetch failed, using fallback data instead:', error)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Level {user.level} • {user.role} • Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Enhanced Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Diamond Balance with Trend */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg transition-all hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-100">Diamond Balance</span>
                {diamondTrend !== 0 && (
                  <span
                    className={`flex items-center text-xs font-semibold ${
                      diamondTrend > 0 ? 'text-green-300' : 'text-red-300'
                    }`}
                  >
                    {diamondTrend > 0 ? '↑' : '↓'} {Math.abs(diamondTrend)}
                  </span>
                )}
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">{user.diamondBalance.toLocaleString()}</span>
                <span className="ml-2 text-2xl text-blue-100">💎</span>
              </div>
              <p className="mt-2 text-xs text-blue-100">
                {diamondTrend > 0 ? 'Earning well!' : diamondTrend < 0 ? 'Spending active' : 'Stable balance'}
              </p>
            </div>
          </div>

          {/* Mission Completion */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 shadow-lg transition-all hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-green-100">Mission Stats</span>
                <span className="text-xs font-semibold text-green-200">{completionRate}%</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">{completedMissions}</span>
                <span className="ml-2 text-xl text-green-100">/ {totalMissions}</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-green-400 bg-opacity-30">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-green-100">
                {pendingMissions > 0 ? `${pendingMissions} pending verification` : 'All caught up! 🎉'}
              </p>
            </div>
          </div>

          {/* Gacha Stats */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg transition-all hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-purple-100">Gacha Pulls</span>
                <span className="text-2xl">🎰</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">{totalGachaPulls}</span>
                <span className="ml-2 text-xl text-purple-100">total</span>
              </div>
              <div className="mt-3 flex gap-1 text-xs text-purple-100">
                <span title="SSR">⭐⭐⭐: {rarityStats.SSR}</span>
                <span className="mx-1">•</span>
                <span title="Legendary">🌟: {rarityStats.LEGENDARY}</span>
                <span className="mx-1">•</span>
                <span title="Epic">✨: {rarityStats.EPIC}</span>
              </div>
              <p className="mt-2 text-xs text-purple-100">
                {rarityStats.SSR + rarityStats.LEGENDARY > 0 ? 'Lucky streak! 🍀' : 'Keep pulling!'}
              </p>
            </div>
          </div>

          {/* Level & XP */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 shadow-lg transition-all hover:shadow-2xl">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-orange-100">Level & XP</span>
                <span className="text-2xl">🏆</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">Lv.{user.level}</span>
                <span className="ml-2 text-xl text-orange-100">{user.points.toLocaleString()} pts</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-orange-400 bg-opacity-30">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-orange-100">
                {Math.round(100 - xpProgress)}% to Level {user.level + 1}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity 📊</h2>
                <Link
                  href="/transactions"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View All →
                </Link>
              </div>

              {recentTransactions.length === 0 && gachaPulls.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No recent activity yet. Start completing missions!</p>
                  <Link
                    href="/missions"
                    className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
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
                            className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-md"
                          >
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                isIncome ? 'bg-green-100' : 'bg-red-100'
                              }`}
                            >
                              <span className="text-lg">
                                {tx.type === 'MISSION_REWARD'
                                  ? '🎯'
                                  : tx.type === 'GACHA_PULL'
                                    ? '🎰'
                                    : tx.type === 'PREMIUM_PACK'
                                      ? '💳'
                                      : '💎'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{tx.description}</p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    {new Date(tx.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <span
                                  className={`ml-4 text-lg font-bold ${
                                    isIncome ? 'text-green-600' : 'text-red-600'
                                  }`}
                                >
                                  {isIncome ? '+' : ''}
                                  {tx.amount} 💎
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      } else {
                        const pull = activity.data
                        const rarityColors = {
                          SSR: 'from-yellow-400 to-orange-500',
                          LEGENDARY: 'from-purple-400 to-pink-500',
                          EPIC: 'from-blue-400 to-purple-500',
                          RARE: 'from-blue-300 to-blue-400',
                          COMMON: 'from-gray-300 to-gray-400',
                        }
                        const rarityColor =
                          rarityColors[pull.prize.rarity as keyof typeof rarityColors] ||
                          'from-gray-300 to-gray-400'

                        return (
                          <div
                            key={`pull-${pull.id}`}
                            className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-md"
                          >
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${rarityColor}`}
                            >
                              <span className="text-lg">🎁</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Won: {pull.prize.name}
                                  </p>
                                  <div className="mt-1 flex items-center gap-2">
                                    <span
                                      className={`rounded-full bg-gradient-to-r ${rarityColor} px-2 py-0.5 text-xs font-bold text-white`}
                                    >
                                      {pull.prize.rarity}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(pull.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <span className="ml-4 text-2xl">
                                  {pull.prize.rarity === 'SSR' || pull.prize.rarity === 'LEGENDARY'
                                    ? '✨'
                                    : '🎉'}
                                </span>
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
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Actions ⚡</h2>
              <div className="space-y-3">
                <Link
                  href="/missions"
                  className="group flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 transition-all hover:border-blue-400 hover:shadow-md"
                >
                  <span className="text-2xl">🎯</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Browse Missions</p>
                    <p className="text-xs text-gray-600">Earn diamonds & rewards</p>
                  </div>
                  <span className="text-gray-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/gacha"
                  className="group flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100 p-4 transition-all hover:border-purple-400 hover:shadow-md"
                >
                  <span className="text-2xl">🎰</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Try Your Luck</p>
                    <p className="text-xs text-gray-600">Win exclusive prizes</p>
                  </div>
                  <span className="text-gray-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/store"
                  className="group flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-gradient-to-r from-green-50 to-green-100 p-4 transition-all hover:border-green-400 hover:shadow-md"
                >
                  <span className="text-2xl">🛍️</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Shop Merch</p>
                    <p className="text-xs text-gray-600">Official merchandise</p>
                  </div>
                  <span className="text-gray-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/prizes"
                  className="group flex items-center gap-3 rounded-lg border-2 border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100 p-4 transition-all hover:border-orange-400 hover:shadow-md"
                >
                  <span className="text-2xl">🏆</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">My Prizes</p>
                    <p className="text-xs text-gray-600">View your collection</p>
                  </div>
                  <span className="text-gray-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Account Summary */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Account Info 👤</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm font-medium text-gray-600">Email</span>
                  <span className="text-sm text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm font-medium text-gray-600">Role</span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm font-medium text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm font-medium text-gray-600">Last Login</span>
                  <span className="text-sm text-gray-900">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : 'First time!'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
