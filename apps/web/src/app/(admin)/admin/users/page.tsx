'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import SearchBar from '@/components/admin/SearchBar'
import FilterDropdown from '@/components/admin/FilterDropdown'
import ActionMenu from '@/components/admin/ActionMenu'
import { Users, Shield, Music, User, Gem, Star, CheckCircle, Gift, Ticket, CreditCard, Package } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar: string | null
  diamondBalance: number
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
  _count: {
    completedTasks: number
    prizes: number
    gachaPulls: number
    purchases: number
    orders: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, searchQuery, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(roleFilter && { role: roleFilter }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.users || [])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'error',
      ARTIST: 'purple',
      USER: 'blue',
    }
    return colors[role] || 'gray'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border border-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-border flex items-center justify-center text-foreground font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium text-foreground">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            {user.tiktokUsername && (
              <div className="text-xs text-purple-400">@{user.tiktokUsername}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (user: User) => (
        <StatusBadge variant={getRoleColor(user.role)}>{user.role}</StatusBadge>
      ),
    },
    {
      key: 'stats',
      label: 'Stats',
      render: (user: User) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gem className="h-4 w-4 text-yellow-400" />
            {user.diamondBalance.toLocaleString()}
            <Star className="h-4 w-4 text-blue-400 ml-2" />
            {user.points.toLocaleString()}
          </div>
          <div className="text-muted-foreground">Level {user.level}</div>
        </div>
      ),
    },
    {
      key: 'activity',
      label: 'Activity',
      render: (user: User) => (
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            {user._count.completedTasks} tasks
          </div>
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-purple-400" />
            {user._count.prizes} prizes
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-pink-400" />
            {user._count.gachaPulls} pulls
          </div>
        </div>
      ),
    },
    {
      key: 'purchases',
      label: 'Purchases',
      render: (user: User) => (
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-400" />
            {user._count.purchases} packs
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-400" />
            {user._count.orders} orders
          </div>
        </div>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      render: (user: User) => (
        <div className="text-sm">
          <div className="text-muted-foreground">{formatDateTime(user.lastLoginAt)}</div>
          <div className="text-muted-foreground text-xs">
            Joined {formatDate(user.createdAt)}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user: User) => (
        <ActionMenu
          items={[
            {
              label: 'View Details',
              onClick: () => router.push(`/admin/users/${user.id}`),
            },
            {
              label: 'Edit User',
              onClick: () => router.push(`/admin/users/${user.id}/edit`),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-primary" />
            <div className="text-muted-foreground text-sm">Total Users</div>
          </div>
          <div className="text-3xl font-bold text-foreground">{pagination.total}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <div className="text-muted-foreground text-sm">Admins</div>
          </div>
          <div className="text-3xl font-bold text-primary">
            {users.filter((u) => u.role === 'ADMIN').length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Music className="h-5 w-5 text-purple-400" />
            <div className="text-muted-foreground text-sm">Artists</div>
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {users.filter((u) => u.role === 'ARTIST').length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-blue-400" />
            <div className="text-muted-foreground text-sm">Regular Users</div>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {users.filter((u) => u.role === 'USER').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search by name, email, or TikTok username..."
          />
          <FilterDropdown
            label="Role"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { label: 'All Roles', value: '' },
              { label: 'Admin', value: 'ADMIN' },
              { label: 'Artist', value: 'ARTIST' },
              { label: 'User', value: 'USER' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg dark:shadow-lg dark:shadow-red-500/10">
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={(user) => user.id}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

