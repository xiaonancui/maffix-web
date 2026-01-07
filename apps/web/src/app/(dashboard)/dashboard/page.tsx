import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Flame,
  Gem,
  Gift,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react'
import { ActivityTimeline, type ActivityTimelineItem } from '@/components/dashboard/ActivityTimeline'
import PromoCard from '@/components/dashboard/PromoCard'

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
    diamonds: number
    points: number
    level: number
    createdAt: Date
    lastLoginAt: Date | null
  }

  type DashboardTransaction = {
    id: string
    type: string
    currency: string
    amount: number
    description: string
    createdAt: Date
  }

  type DashboardGachaPull = {
    id: string
    createdAt: Date
    prize: { name: string; rarity: string }
  }

  const fallbackUser: DashboardUser = {
    id: session.user.id ?? 'unknown-user',
    name: session.user.name ?? 'Maffix User',
    email: session.user.email ?? 'unknown@maffix.com',
    avatar: null,
    role: (session.user.role as string) ?? 'USER',
    diamonds: session.user.role === 'ADMIN' ? 10000 : 500,
    points: session.user.role === 'ADMIN' ? 5000 : 250,
    level: session.user.role === 'ADMIN' ? 10 : 3,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  }

  // Use mock data
  let user: DashboardUser = fallbackUser
  let completedMissions = 0
  let pendingMissions = 0
  let gachaPulls: DashboardGachaPull[] = []
  let recentTransactions: DashboardTransaction[] = []
  let rarityStats = { SSR: 0, LEGENDARY: 0, EPIC: 0, RARE: 0, COMMON: 0 }

  console.log('📊 Using mock data for user:', session.user.email)
  user = {
    ...fallbackUser,
    diamonds: session.user.role === 'ADMIN' ? 10000 : 1250,
    points: session.user.role === 'ADMIN' ? 5000 : 850,
    level: session.user.role === 'ADMIN' ? 10 : 5,
  }

  completedMissions = 12
  pendingMissions = 3

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

  const totalMissions = completedMissions + pendingMissions
  const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0
  const totalGachaPulls = Object.values(rarityStats).reduce((a, b) => a + b, 0)
  const xpProgress = Math.min(((user.points % 100) / 100) * 100, 100)
  const xpIntoLevel = user.points % 100
  const xpToNextLevel = Math.max(0, 100 - xpIntoLevel)

  const recentIncome = recentTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const recentExpense = Math.abs(
    recentTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
  )
  const diamondTrend = recentIncome - recentExpense

  const formatTimestamp = (date: Date) =>
    new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })

  const activityItems: ActivityTimelineItem[] = [
    ...recentTransactions.map((tx) => {
      const isIncome = tx.amount > 0
      return {
        rawDate: tx.createdAt,
        item: {
          id: tx.id,
          title: tx.description,
          description: isIncome ? 'Mission reward' : 'Gacha entry',
          timestamp: formatTimestamp(tx.createdAt),
          pill: tx.type.replace('_', ' '),
          value: `${isIncome ? '+' : '-'}${Math.abs(tx.amount)} 💎`,
          tone: isIncome ? 'gold' : 'hot',
          meta: tx.currency,
        } satisfies ActivityTimelineItem,
      }
    }),
    ...gachaPulls.map((pull) => ({
      rawDate: pull.createdAt,
      item: {
        id: pull.id,
        title: `Won ${pull.prize.name}`,
        description: 'Aura Zone pull',
        timestamp: formatTimestamp(pull.createdAt),
        pill: pull.prize.rarity,
        value: pull.prize.rarity,
        tone: pull.prize.rarity === 'LEGENDARY' || pull.prize.rarity === 'SSR' ? 'gold' : 'cool',
        meta: 'Gacha',
      } satisfies ActivityTimelineItem,
    })),
  ]
    .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
    .slice(0, 6) // Limit to 6 items
    .map((entry) => entry.item)

  const gradientDegree = xpProgress * 3.6

  return (
    <div className="relative min-h-screen">
      {/* Animated background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-[#FF1F7D]/10 blur-3xl" />
        <div className="absolute -right-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-[#8B5CF6]/10 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-[#00F5FF]/10 blur-3xl" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section - Bento Layout */}
        <section className="mb-16 animate-fade-in-up">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Welcome Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-card/50 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-[#FF1F7D]/40 hover:shadow-[0_0_60px_rgba(255,31,125,0.3)]">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 via-[#B200FF]/10 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

              <div className="relative flex h-full flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-4 py-1.5 backdrop-blur-sm">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#00F5FF]" />
                    <span className="font-display text-sm font-bold text-[#00F5FF]">LIVE NOW</span>
                  </div>

                  <div>
                    <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                      Hi, <span className="text-white">{user.name}</span>
                    </h1>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
                      Keep the streak alive and stack those diamonds. Your next legendary drop is waiting.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/missions"
                    className="group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#B200FF] px-8 py-3 font-display text-sm font-bold text-white shadow-lg shadow-[#FF1F7D]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FF1F7D]/60"
                  >
                    <Target className="h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                    Continue Missions
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                  <Link
                    href="/aura-zone"
                    className="group/btn inline-flex items-center gap-2 rounded-full border-2 border-[#00F5FF]/50 bg-[#00F5FF]/10 px-8 py-3 font-display text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF] hover:bg-[#00F5FF]/20 hover:shadow-lg hover:shadow-[#00F5FF]/30"
                  >
                    <Sparkles className="h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                    Aura Zone
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Diamonds */}
              <div className="group relative col-span-2 overflow-hidden rounded-3xl border border-[#FF1F7D]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_40px_rgba(255,31,125,0.4)]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF1F7D]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-[#FF1F7D]/20 p-2 ring-1 ring-[#FF1F7D]/30">
                      <Gem className="h-5 w-5 text-[#FF1F7D]" />
                    </div>
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-white/50">
                      Diamonds
                    </span>
                  </div>
                  <div className="font-display text-5xl font-black tabular-nums text-white">
                    {user.diamonds.toLocaleString()}
                  </div>
                  {diamondTrend !== 0 && (
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${diamondTrend > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#FF1F7D]/20 text-[#FF1F7D]'}`}>
                      <TrendingUp className="h-4 w-4" />
                      {diamondTrend > 0 ? '+' : ''}{diamondTrend} today
                    </div>
                  )}
                </div>
              </div>

              {/* Points */}
              <div className="group relative overflow-hidden rounded-3xl border border-[#FFC700]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FFC700]/60 hover:shadow-[0_0_40px_rgba(255,199,0,0.4)]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFC700]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-[#FFC700]/20 p-2 ring-1 ring-[#FFC700]/30">
                      <Zap className="h-5 w-5 text-[#FFC700]" />
                    </div>
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-white/50">
                      Points
                    </span>
                  </div>
                  <div className="font-display text-4xl font-black tabular-nums text-white">
                    {user.points.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="group relative overflow-hidden rounded-3xl border border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-[#8B5CF6]/20 p-2 ring-1 ring-[#8B5CF6]/30">
                      <Trophy className="h-5 w-5 text-[#8B5CF6]" />
                    </div>
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-white/50">
                      Level
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className="relative h-16 w-16 shrink-0"
                      style={{
                        background: `conic-gradient(#8B5CF6 ${gradientDegree}deg, rgba(139,92,246,0.15) 0deg)`,
                        borderRadius: '50%',
                      }}
                    >
                      <div className="absolute inset-1 flex items-center justify-center rounded-full bg-surface-base">
                        <div className="font-display text-2xl font-black text-white">{user.level}</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-4xl font-black tabular-nums text-white">{Math.round(xpProgress)}%</div>
                      <div className="mt-1 text-xs font-semibold text-white/50">{xpToNextLevel} XP to next</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stat Cards - Simplified 3-Card Layout */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Mission Progress */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-8 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_60px_rgba(139,92,246,0.4)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

              <div className="relative space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-display text-xs font-bold uppercase tracking-wider text-white/50">
                      Mission Control
                    </div>
                    <div className="text-sm text-white/40">Completion rate</div>
                  </div>
                  <div className="rounded-xl bg-[#8B5CF6]/20 p-3 ring-1 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110">
                    <Target className="h-6 w-6 text-[#8B5CF6]" />
                  </div>
                </div>

                <div>
                  <div className="font-display text-5xl font-black tabular-nums text-white">
                    {completionRate}%
                  </div>
                  <div className="mt-2 font-mono text-sm text-white/60">
                    {completedMissions} of {totalMissions} complete
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#FF1F7D] transition-all duration-1000"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <p className="text-sm text-white/60">
                    {pendingMissions > 0 ? `${pendingMissions} missions pending verification` : 'All verified!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Gacha Stats */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#FFC700]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-8 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FFC700]/60 hover:shadow-[0_0_60px_rgba(255,199,0,0.4)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FFC700]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

              <div className="relative space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-display text-xs font-bold uppercase tracking-wider text-white/50">
                      Aura Zone
                    </div>
                    <div className="text-sm text-white/40">Lifetime pulls</div>
                  </div>
                  <div className="rounded-xl bg-[#FFC700]/20 p-3 ring-1 ring-[#FFC700]/30 transition-transform duration-300 group-hover:scale-110">
                    <Gift className="h-6 w-6 text-[#FFC700]" />
                  </div>
                </div>

                <div>
                  <div className="font-display text-5xl font-black tabular-nums text-white">
                    {totalGachaPulls}
                  </div>
                  <div className="mt-2 flex gap-3 text-sm">
                    <span className="rounded-full bg-[#FFC700]/20 px-3 py-1 font-semibold text-[#FFC700]">
                      ✦ SSR {rarityStats.SSR}
                    </span>
                    <span className="rounded-full bg-[#B200FF]/20 px-3 py-1 font-semibold text-[#B200FF]">
                      ★ Legendary {rarityStats.LEGENDARY}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-white/60">
                  {rarityStats.SSR + rarityStats.LEGENDARY > 0 ? '🔥 On a legendary streak!' : 'Keep pulling for SSR luck'}
                </p>
              </div>
            </div>

            {/* Streak Focus */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#FF1F7D]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-8 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_60px_rgba(255,31,125,0.4)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

              <div className="relative space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-display text-xs font-bold uppercase tracking-wider text-white/50">
                      Weekly Focus
                    </div>
                    <div className="text-sm text-white/40">Keep the streak</div>
                  </div>
                  <div className="rounded-xl bg-[#FF1F7D]/20 p-3 ring-1 ring-[#FF1F7D]/30 transition-transform duration-300 group-hover:scale-110">
                    <Flame className="h-6 w-6 text-[#FF1F7D]" />
                  </div>
                </div>

                <div>
                  <div className="font-display text-5xl font-black tabular-nums text-white">
                    {completedMissions}
                  </div>
                  <div className="mt-2 font-mono text-sm text-white/60">
                    missions this week
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Next reward</span>
                    <span className="font-display font-bold text-[#FFC700]">+200 💎</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#FFC700] transition-all duration-1000"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Section */}
        <section className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Recent Activity */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
                    Live Feed
                  </div>
                  <h2 className="font-display text-3xl font-black text-white">Recent Activity</h2>
                </div>
                <Link
                  href="/transactions"
                  className="group inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/10 px-5 py-2.5 font-display text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#00F5FF]/60 hover:bg-[#00F5FF]/20 hover:shadow-lg hover:shadow-[#00F5FF]/30"
                >
                  View all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <ActivityTimeline
                items={activityItems}
                emptyState={
                  <div className="rounded-3xl border border-white/10 bg-surface-card/50 p-12 text-center backdrop-blur-xl">
                    <Target className="mx-auto h-12 w-12 text-white/20" />
                    <p className="mt-4 text-white/60">No activity yet. Start your first mission!</p>
                    <Link
                      href="/missions"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#B200FF] px-6 py-3 font-display text-sm font-bold text-white transition-transform hover:scale-105"
                    >
                      <Target className="h-4 w-4" />
                      Browse Missions
                    </Link>
                  </div>
                }
              />
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div>
                <div className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
                  Quick Actions
                </div>
                <h3 className="font-display text-3xl font-black text-white">Jump right in</h3>
              </div>

              <div className="space-y-4">
                <Link
                  href="/missions"
                  className="group relative block overflow-hidden rounded-2xl border border-[#FF1F7D]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_40px_rgba(255,31,125,0.3)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF1F7D]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-start gap-4">
                    <div className="rounded-xl bg-[#FF1F7D]/20 p-3 ring-1 ring-[#FF1F7D]/30">
                      <Target className="h-6 w-6 text-[#FF1F7D]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-lg font-bold text-white">Browse Missions</h4>
                        <span className="rounded-full bg-[#FF1F7D]/20 px-2 py-0.5 text-xs font-bold text-[#FF1F7D]">
                          NEW
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/60">New drops every Friday</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                <Link
                  href="/aura-zone"
                  className="group relative block overflow-hidden rounded-2xl border border-[#B200FF]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#B200FF]/60 hover:shadow-[0_0_40px_rgba(178,0,255,0.3)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#B200FF]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-start gap-4">
                    <div className="rounded-xl bg-[#B200FF]/20 p-3 ring-1 ring-[#B200FF]/30">
                      <Sparkles className="h-6 w-6 text-[#B200FF]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-bold text-white">Aura Zone</h4>
                      <p className="mt-1 text-sm text-white/60">Pull SSR prizes & merch</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                <Link
                  href="/store"
                  className="group relative block overflow-hidden rounded-2xl border border-[#FFC700]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#FFC700]/60 hover:shadow-[0_0_40px_rgba(255,199,0,0.3)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFC700]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-start gap-4">
                    <div className="rounded-xl bg-[#FFC700]/20 p-3 ring-1 ring-[#FFC700]/30">
                      <ShoppingBag className="h-6 w-6 text-[#FFC700]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-bold text-white">Shop Merch</h4>
                      <p className="mt-1 text-sm text-white/60">Official drops & bundles</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>

              {/* Featured Promotion */}
              <div className="mt-8">
                <div className="mb-6">
                  <div className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
                    Featured
                  </div>
                </div>
                <PromoCard />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Padding */}
        <div className="h-16" />
      </div>
    </div>
  )
}
