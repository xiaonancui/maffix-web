'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import SearchBar from '@/components/admin/SearchBar'
import FilterDropdown from '@/components/admin/FilterDropdown'
import ActionMenu from '@/components/admin/ActionMenu'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Users, Shield, Music, User, Gem, Star, CheckCircle, Gift, Ticket, CreditCard, Package } from 'lucide-react'

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

  const fetchUsers = useCallback(async () => {
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
  }, [pagination.page, pagination.limit, searchQuery, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
  }

  const getRoleBadgeStyle = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: 'border-2 border-[#FF1F7D]/40 bg-[#FF1F7D]/20 text-[#FF1F7D] shadow-lg shadow-[#FF1F7D]/20',
      ARTIST: 'border-2 border-[#8B5CF6]/40 bg-[#8B5CF6]/20 text-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20',
      USER: 'border-2 border-[#00F5FF]/40 bg-[#00F5FF]/20 text-[#00F5FF] shadow-lg shadow-[#00F5FF]/20',
    }
    return styles[role] || 'border-2 border-white/20 bg-white/10 text-white/60'
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full border-2 border-white/20"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-[#FF1F7D]/20 to-[#8B5CF6]/20 font-display font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium text-white">{user.name}</div>
            <div className="text-sm text-white/60">{user.email}</div>
            {user.tiktokUsername && (
              <div className="text-xs text-[#8B5CF6]">@{user.tiktokUsername}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (user: User) => (
        <span className={`inline-flex rounded-full px-3 py-1 font-display text-xs font-black uppercase tracking-wider ${getRoleBadgeStyle(user.role)}`}>
          {user.role}
        </span>
      ),
    },
    {
      key: 'stats',
      label: 'Stats',
      render: (user: User) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <Gem className="h-4 w-4 text-[#00F5FF]" />
            <span className="font-bold tabular-nums text-[#00F5FF]">{user.diamonds.toLocaleString()}</span>
            <Star className="ml-2 h-4 w-4 text-[#FFC700]" />
            <span className="font-bold tabular-nums text-[#FFC700]">{user.points.toLocaleString()}</span>
          </div>
          <div className="font-display text-xs font-bold uppercase tracking-wider text-white/70">Level {user.level}</div>
        </div>
      ),
    },
    {
      key: 'activity',
      label: 'Activity',
      render: (user: User) => (
        <div className="space-y-1 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[#10B981]" />
            <span className="font-medium">{user._count.completedTasks} tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-[#8B5CF6]" />
            <span className="font-medium">{user._count.prizes} prizes</span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-[#FF1F7D]" />
            <span className="font-medium">{user._count.gachaPulls} pulls</span>
          </div>
        </div>
      ),
    },
    {
      key: 'purchases',
      label: 'Purchases',
      render: (user: User) => (
        <div className="space-y-1 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#10B981]" />
            <span className="font-medium">{user._count.purchases} packs</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#00F5FF]" />
            <span className="font-medium">{user._count.orders} orders</span>
          </div>
        </div>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      render: (user: User) => (
        <div className="text-sm">
          <div className="text-white/60">{formatDateTime(user.lastLoginAt)}</div>
          <div className="text-xs text-white/40">
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
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Users"
        description="Manage user accounts and permissions"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users - Cyan */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#00F5FF]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#00F5FF]/60 hover:shadow-[0_0_40px_rgba(0,245,255,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#00F5FF]/20 p-3 ring-2 ring-[#00F5FF]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Users className="h-8 w-8 text-[#00F5FF]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Total Users</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {pagination.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Admins - Hot Pink */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FF1F7D]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_40px_rgba(255,31,125,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#FF1F7D]/20 p-3 ring-2 ring-[#FF1F7D]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Shield className="h-8 w-8 text-[#FF1F7D]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Admins</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {users.filter((u) => u.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>

        {/* Artists - Purple */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#8B5CF6]/20 p-3 ring-2 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Music className="h-8 w-8 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Artists</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {users.filter((u) => u.role === 'ARTIST').length}
              </p>
            </div>
          </div>
        </div>

        {/* Regular Users - Gold */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FFC700]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FFC700]/60 hover:shadow-[0_0_40px_rgba(255,199,0,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FFC700]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#FFC700]/20 p-3 ring-2 ring-[#FFC700]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <User className="h-8 w-8 text-[#FFC700]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Regular Users</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {users.filter((u) => u.role === 'USER').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl">
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

