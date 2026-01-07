'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/admin/StatusBadge'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar: string | null
  diamonds: number
  points: number
  level: number
  gachaPityCounter: number
  hasCompletedTenDraw: boolean
  provider: string | null
  tiktokUsername: string | null
  tiktokLinkedAt: string | null
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
  completedTasks: any[]
  prizes: any[]
  gachaPulls: any[]
  purchases: any[]
  transactions: any[]
  orders: any[]
  _count: {
    completedTasks: number
    prizes: number
    gachaPulls: number
    purchases: number
    transactions: number
    orders: number
  }
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${params.id}`)
      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
      } else {
        console.error('Failed to fetch user:', data.error)
        router.push('/admin/users')
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'error',
      ARTIST: 'purple',
      USER: 'blue',
    }
    return colors[role] || 'gray'
  }

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      COMMON: 'gray',
      RARE: 'blue',
      EPIC: 'purple',
      LEGENDARY: 'yellow',
      SSR: 'error',
    }
    return colors[rarity] || 'gray'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading user...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/users')}
            className="text-muted-foreground hover:text-foreground mb-2 flex items-center gap-2"
          >
            ← Back to Users
          </button>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">User Details</h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
        </div>
        <Link
          href={`/admin/users/${user.id}/edit`}
          className="px-4 py-2 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
        >
          Edit User
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
        <div className="flex items-start gap-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border-2 border-border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-border flex items-center justify-center text-foreground font-bold text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-2xl font-bold text-foreground">{user.name}</h2>
              <StatusBadge variant={getRoleColor(user.role)}>{user.role}</StatusBadge>
            </div>
            <div className="space-y-1 text-muted-foreground">
              <div>📧 {user.email}</div>
              {user.tiktokUsername && (
                <div>
                  🎵 TikTok: @{user.tiktokUsername}
                  <span className="text-muted-foreground ml-2 text-sm">
                    (Linked {formatDate(user.tiktokLinkedAt)})
                  </span>
                </div>
              )}
              {user.provider && (
                <div className="text-muted-foreground">
                  🔐 OAuth Provider: {user.provider}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Diamond Balance</div>
          <div className="font-display text-3xl font-bold text-yellow-400">
            💎 {user.diamonds.toLocaleString()}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Points</div>
          <div className="font-display text-3xl font-bold text-blue-400">
            ⭐ {user.points.toLocaleString()}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Level</div>
          <div className="font-display text-3xl font-bold text-green-400">🎯 {user.level}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Gacha Pity</div>
          <div className="font-display text-3xl font-bold text-purple-400">
            {user.gachaPityCounter}/10
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {user.hasCompletedTenDraw ? '✅ Has 10x draw' : '❌ No 10x draw'}
          </div>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h3 className="text-lg font-bold text-foreground mb-4">Missions</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Completed Tasks:</span>
              <span className="font-bold">{user._count.completedTasks}</span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h3 className="text-lg font-bold text-foreground mb-4">Gacha</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Total Pulls:</span>
              <span className="font-bold">{user._count.gachaPulls}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Prizes Won:</span>
              <span className="font-bold">{user._count.prizes}</span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h3 className="text-lg font-bold text-foreground mb-4">Purchases</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Premium Packs:</span>
              <span className="font-bold">{user._count.purchases}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Orders:</span>
              <span className="font-bold">{user._count.orders}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
        <h3 className="text-lg font-bold text-foreground mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
          <div>
            <span className="text-muted-foreground">Created:</span>{' '}
            <span className="font-medium">{formatDate(user.createdAt)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Last Updated:</span>{' '}
            <span className="font-medium">{formatDate(user.updatedAt)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Last Login:</span>{' '}
            <span className="font-medium">{formatDate(user.lastLoginAt)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">User ID:</span>{' '}
            <span className="font-mono text-sm">{user.id}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Tabs */}
      <div className="bg-card border border-border rounded-lg dark:shadow-lg dark:shadow-red-500/10">
        <div className="border-b border-border p-6">
          <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
        </div>

        {/* Completed Tasks */}
        {user.completedTasks.length > 0 && (
          <div className="p-6 border-b border-border">
            <h4 className="text-md font-bold text-foreground mb-4">Recent Completed Tasks</h4>
            <div className="space-y-3">
              {user.completedTasks.slice(0, 5).map((userTask: any) => (
                <div
                  key={userTask.id}
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg"
                >
                  <div>
                    <div className="font-medium text-foreground">{userTask.task.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {userTask.task.type} • {userTask.task.difficulty}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      +{userTask.pointsEarned} pts, +{userTask.diamondsEarned} 💎
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(userTask.submittedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Prizes */}
        {user.prizes.length > 0 && (
          <div className="p-6 border-b border-border">
            <h4 className="text-md font-bold text-foreground mb-4">Recent Prizes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {user.prizes.slice(0, 6).map((userPrize: any) => (
                <div
                  key={userPrize.id}
                  className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-lg"
                >
                  {userPrize.prize.image && (
                    <img
                      src={userPrize.prize.image}
                      alt={userPrize.prize.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{userPrize.prize.name}</div>
                    <div className="flex items-center gap-2">
                      <StatusBadge variant={getRarityColor(userPrize.prize.rarity)}>
                        {userPrize.prize.rarity}
                      </StatusBadge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(userPrize.acquiredAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Purchases */}
        {user.purchases.length > 0 && (
          <div className="p-6">
            <h4 className="text-md font-bold text-foreground mb-4">Recent Purchases</h4>
            <div className="space-y-3">
              {user.purchases.slice(0, 5).map((purchase: any) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg"
                >
                  <div>
                    <div className="font-medium text-foreground">{purchase.pack.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {purchase.status} • {purchase.paymentMethod}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      £{purchase.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(purchase.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

