'use client'

import { useState, useEffect } from 'react'
import FilterDropdown from '@/components/admin/FilterDropdown'
import { Gem } from 'lucide-react'

interface AnalyticsOverview {
  period: {
    days: number
    startDate: string
    endDate: string
  }
  users: {
    total: number
    new: number
    active: number
    byRole: Array<{ role: string; count: number }>
    tiktokLinked: number
  }
  engagement: {
    totalTasks: number
    completedTasks: number
    recentCompletedTasks: number
    totalPrizes: number
    prizesAwarded: number
    completionRate: number
  }
  gacha: {
    totalPulls: number
    recentPulls: number
    totalRevenue: number
    recentRevenue: number
  }
  revenue: {
    packs: {
      total: number
      recent: number
      totalRevenue: number
      recentRevenue: number
    }
    merchandise: {
      total: number
      recent: number
      totalRevenue: number
      recentRevenue: number
    }
    combined: {
      totalRevenue: number
      recentRevenue: number
    }
  }
}

interface TrendData {
  date: string
  value: number
}

interface AnalyticsTrends {
  period: {
    days: number
    startDate: string
    endDate: string
  }
  trends: {
    userRegistrations: TrendData[]
    taskCompletions: TrendData[]
    gachaPulls: {
      count: TrendData[]
      revenue: TrendData[]
    }
    purchases: {
      count: TrendData[]
      revenue: TrendData[]
    }
    orders: {
      count: TrendData[]
      revenue: TrendData[]
    }
  }
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [trends, setTrends] = useState<AnalyticsTrends | null>(null)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      const [overviewRes, trendsRes] = await Promise.all([
        fetch(`/api/admin/analytics/overview?days=${period}`),
        fetch(`/api/admin/analytics/trends?days=${period}`),
      ])

      const [overviewData, trendsData] = await Promise.all([
        overviewRes.json(),
        trendsRes.json(),
      ])

      if (overviewData.success) {
        setOverview(overviewData)
      }

      if (trendsData.success) {
        setTrends(trendsData)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatPercent = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Failed to load analytics</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform metrics and insights</p>
        </div>
        <FilterDropdown
          label="Period"
          value={period}
          onChange={setPeriod}
          options={[
            { label: 'Last 7 Days', value: '7' },
            { label: 'Last 30 Days', value: '30' },
            { label: 'Last 90 Days', value: '90' },
          ]}
        />
      </div>

      {/* User Metrics */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">User Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Total Users</div>
            <div className="font-display text-3xl font-bold text-foreground">{formatNumber(overview.users.total)}</div>
            <div className="text-sm text-green-400 mt-2">
              +{formatNumber(overview.users.new)} new
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Active Users</div>
            <div className="font-display text-3xl font-bold text-green-400">
              {formatNumber(overview.users.active)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {formatPercent((overview.users.active / overview.users.total) * 100)} of total
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">TikTok Linked</div>
            <div className="font-display text-3xl font-bold text-purple-400">
              {formatNumber(overview.users.tiktokLinked)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {formatPercent((overview.users.tiktokLinked / overview.users.total) * 100)} of total
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">User Roles</div>
            <div className="space-y-1 mt-2">
              {overview.users.byRole.map((role) => (
                <div key={role.role} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{role.role}:</span>
                  <span className="text-foreground font-medium">{formatNumber(role.count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Engagement Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Total Tasks</div>
            <div className="font-display text-3xl font-bold text-foreground">
              {formatNumber(overview.engagement.totalTasks)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {formatNumber(overview.engagement.completedTasks)} completed
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Recent Completions</div>
            <div className="font-display text-3xl font-bold text-blue-400">
              {formatNumber(overview.engagement.recentCompletedTasks)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Last {period} days</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Prizes Awarded</div>
            <div className="font-display text-3xl font-bold text-yellow-400">
              {formatNumber(overview.engagement.prizesAwarded)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              of {formatNumber(overview.engagement.totalPrizes)} total
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Completion Rate</div>
            <div className="font-display text-3xl font-bold text-green-400">
              {formatPercent(overview.engagement.completionRate)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Overall</div>
          </div>
        </div>
      </div>

      {/* Gacha Metrics */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Gacha Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Total Pulls</div>
            <div className="font-display text-3xl font-bold text-foreground">
              {formatNumber(overview.gacha.totalPulls)}
            </div>
            <div className="text-sm text-green-400 mt-2">
              +{formatNumber(overview.gacha.recentPulls)} recent
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
              Total Revenue <Gem className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="font-display text-3xl font-bold text-yellow-400">
              {formatNumber(overview.gacha.totalRevenue)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Diamonds spent</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
              Recent Revenue <Gem className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="font-display text-3xl font-bold text-yellow-400">
              {formatNumber(overview.gacha.recentRevenue)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Last {period} days</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Avg per Pull</div>
            <div className="font-display text-3xl font-bold text-purple-400">
              {overview.gacha.totalPulls > 0
                ? formatNumber(Math.round(overview.gacha.totalRevenue / overview.gacha.totalPulls))
                : '0'}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Diamonds</div>
          </div>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Revenue Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Premium Packs</div>
            <div className="font-display text-3xl font-bold text-green-400">
              {formatCurrency(overview.revenue.packs.totalRevenue)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {formatNumber(overview.revenue.packs.total)} purchases
            </div>
            <div className="text-sm text-green-400 mt-1">
              +{formatCurrency(overview.revenue.packs.recentRevenue)} recent
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Merchandise</div>
            <div className="font-display text-3xl font-bold text-blue-400">
              {formatCurrency(overview.revenue.merchandise.totalRevenue)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {formatNumber(overview.revenue.merchandise.total)} orders
            </div>
            <div className="text-sm text-blue-400 mt-1">
              +{formatCurrency(overview.revenue.merchandise.recentRevenue)} recent
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm mb-1">Total Revenue</div>
            <div className="font-display text-3xl font-bold text-yellow-400">
              {formatCurrency(overview.revenue.combined.totalRevenue)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">All time</div>
            <div className="text-sm text-yellow-400 mt-1">
              +{formatCurrency(overview.revenue.combined.recentRevenue)} recent
            </div>
          </div>
        </div>
      </div>

      {/* Trends */}
      {trends && (
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Trends (Last 7 Days)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Registrations Trend */}
            <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
              <h3 className="text-lg font-bold text-foreground mb-4">User Registrations</h3>
              <div className="space-y-2">
                {trends.trends.userRegistrations.slice(-7).map((item) => (
                  <div key={item.date} className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground w-24">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex-1 bg-[#0a0a0a] rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(
                            (item.value /
                              Math.max(...trends.trends.userRegistrations.map((d) => d.value), 1)) *
                              100,
                            100
                          )}%`,
                        }}
                      >
                        <span className="text-xs text-foreground font-medium">{item.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Completions Trend */}
            <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
              <h3 className="text-lg font-bold text-foreground mb-4">Task Completions</h3>
              <div className="space-y-2">
                {trends.trends.taskCompletions.slice(-7).map((item) => (
                  <div key={item.date} className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground w-24">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex-1 bg-[#0a0a0a] rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-600 to-green-400 h-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(
                            (item.value /
                              Math.max(...trends.trends.taskCompletions.map((d) => d.value), 1)) *
                              100,
                            100
                          )}%`,
                        }}
                      >
                        <span className="text-xs text-foreground font-medium">{item.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gacha Pulls Trend */}
            <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
              <h3 className="text-lg font-bold text-foreground mb-4">Gacha Pulls</h3>
              <div className="space-y-2">
                {trends.trends.gachaPulls.count.slice(-7).map((item) => (
                  <div key={item.date} className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground w-24">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex-1 bg-[#0a0a0a] rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-purple-400 h-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.min(
                            (item.value /
                              Math.max(...trends.trends.gachaPulls.count.map((d) => d.value), 1)) *
                              100,
                            100
                          )}%`,
                        }}
                      >
                        <span className="text-xs text-foreground font-medium">{item.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Trend */}
            <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
              <h3 className="text-lg font-bold text-foreground mb-4">Daily Revenue</h3>
              <div className="space-y-2">
                {trends.trends.purchases.revenue.slice(-7).map((item) => {
                  const orderRevenue =
                    trends.trends.orders.revenue.find((o) => o.date === item.date)?.value || 0
                  const totalRevenue = item.value + orderRevenue
                  const maxRevenue = Math.max(
                    ...trends.trends.purchases.revenue.map((d) => {
                      const oRev =
                        trends.trends.orders.revenue.find((o) => o.date === d.date)?.value || 0
                      return d.value + oRev
                    }),
                    1
                  )
                  return (
                    <div key={item.date} className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground w-24">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex-1 bg-[#0a0a0a] rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full flex items-center justify-end pr-2"
                          style={{
                            width: `${Math.min((totalRevenue / maxRevenue) * 100, 100)}%`,
                          }}
                        >
                          <span className="text-xs text-foreground font-medium">
                            {formatCurrency(totalRevenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
