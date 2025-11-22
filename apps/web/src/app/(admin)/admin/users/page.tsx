'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import SearchBar from '@/components/admin/SearchBar'
import FilterDropdown from '@/components/admin/FilterDropdown'
import ActionMenu from '@/components/admin/ActionMenu'

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
              className="w-10 h-10 rounded-full border border-red-500/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-red-500/20 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium text-white">{user.name}</div>
            <div className="text-sm text-gray-400">{user.email}</div>
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
          <div className="text-gray-300">
            💎 {user.diamondBalance.toLocaleString()} | ⭐ {user.points.toLocaleString()}
          </div>
          <div className="text-gray-400">Level {user.level}</div>
        </div>
      ),
    },
    {
      key: 'activity',
      label: 'Activity',
      render: (user: User) => (
        <div className="space-y-1 text-sm text-gray-300">
          <div>✅ {user._count.completedTasks} tasks</div>
          <div>🎁 {user._count.prizes} prizes</div>
          <div>🎰 {user._count.gachaPulls} pulls</div>
        </div>
      ),
    },
    {
      key: 'purchases',
      label: 'Purchases',
      render: (user: User) => (
        <div className="space-y-1 text-sm text-gray-300">
          <div>💳 {user._count.purchases} packs</div>
          <div>📦 {user._count.orders} orders</div>
        </div>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      render: (user: User) => (
        <div className="text-sm">
          <div className="text-gray-300">{formatDateTime(user.lastLoginAt)}</div>
          <div className="text-gray-500 text-xs">
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-gray-400 mt-1">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] border border-red-500/20 rounded-lg p-6 shadow-lg shadow-red-500/10">
          <div className="text-gray-400 text-sm mb-1">Total Users</div>
          <div className="text-3xl font-bold text-white">{pagination.total}</div>
        </div>
        <div className="bg-[#1a1a1a] border border-red-500/20 rounded-lg p-6 shadow-lg shadow-red-500/10">
          <div className="text-gray-400 text-sm mb-1">Admins</div>
          <div className="text-3xl font-bold text-red-400">
            {users.filter((u) => u.role === 'ADMIN').length}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-red-500/20 rounded-lg p-6 shadow-lg shadow-red-500/10">
          <div className="text-gray-400 text-sm mb-1">Artists</div>
          <div className="text-3xl font-bold text-purple-400">
            {users.filter((u) => u.role === 'ARTIST').length}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-red-500/20 rounded-lg p-6 shadow-lg shadow-red-500/10">
          <div className="text-gray-400 text-sm mb-1">Regular Users</div>
          <div className="text-3xl font-bold text-blue-400">
            {users.filter((u) => u.role === 'USER').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-red-500/20 rounded-lg p-6 shadow-lg shadow-red-500/10">
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
      <div className="bg-[#1a1a1a] border border-red-500/20 rounded-lg shadow-lg shadow-red-500/10">
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

