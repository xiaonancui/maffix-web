'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import FilterDropdown from '@/components/admin/FilterDropdown'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ActionMenu from '@/components/admin/ActionMenu'
import { Plus, Gem, Edit, Play, Pause, Trash2 } from 'lucide-react'

interface GachaStats {
  totalPulls: number
  pullsByType: { type: string; count: number }[]
  totalRevenue: number
  prizeDistribution: { rarity: string; count: number; percentage: number }[]
  ssrRate: number
  guaranteedSSRCount: number
  recentPulls24h: number
  activeItemsCount: number
  uniqueUsersCount: number
  topPrizes: any[]
}

interface GachaItem {
  id: string
  prizeId: string
  probability: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  prize: {
    id: string
    name: string
    description: string
    rarity: string
    type: string
    image: string | null
    value: number
  }
  _count: {
    pulls: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function GachaManagementPage() {
  const router = useRouter()
  const [stats, setStats] = useState<GachaStats | null>(null)
  const [gachaItems, setGachaItems] = useState<GachaItem[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [rarityFilter, setRarityFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // Fetch gacha statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await fetch('/api/admin/gacha/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        console.error('Failed to fetch gacha stats:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch gacha stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  // Fetch gacha items
  const fetchGachaItems = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (rarityFilter) params.append('rarity', rarityFilter)
      if (statusFilter) params.append('isActive', statusFilter)

      const response = await fetch(`/api/admin/gacha/items?${params}`)
      const data = await response.json()

      if (data.success) {
        setGachaItems(data.data.gachaItems || [])
        setPagination(data.data.pagination)
      } else {
        console.error('Failed to fetch gacha items:', data.error)
        setGachaItems([])
      }
    } catch (error) {
      console.error('Failed to fetch gacha items:', error)
      setGachaItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchGachaItems()
  }, [pagination.page, rarityFilter, statusFilter])

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/gacha/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchGachaItems()
        fetchStats()
      }
    } catch (error) {
      console.error('Failed to toggle gacha item status:', error)
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`/api/admin/gacha/items/${itemToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchGachaItems()
        fetchStats()
        setDeleteDialogOpen(false)
        setItemToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete gacha item:', error)
    }
  }

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      COMMON: 'gray',
      RARE: 'blue',
      EPIC: 'purple',
      SSR: 'yellow',
      LEGENDARY: 'red',
    }
    return colors[rarity] || 'gray'
  }

  const columns = [
    {
      key: 'prize.name',
      label: 'Prize',
      render: (item: GachaItem) => (
        <div className="flex items-center gap-3">
          {item.prize.image && (
            <img
              src={item.prize.image}
              alt={item.prize.name}
              className="w-12 h-12 rounded-lg object-cover border border-border"
            />
          )}
          <div>
            <div className="font-medium text-foreground">{item.prize.name}</div>
            <div className="text-sm text-muted-foreground">{item.prize.type}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'prize.rarity',
      label: 'Rarity',
      render: (item: GachaItem) => (
        <StatusBadge variant={getRarityColor(item.prize.rarity)}>
          {item.prize.rarity}
        </StatusBadge>
      ),
    },
    {
      key: 'probability',
      label: 'Probability',
      render: (item: GachaItem) => (
        <span className="text-foreground font-medium">{item.probability.toFixed(2)}%</span>
      ),
    },
    {
      key: '_count.pulls',
      label: 'Total Pulls',
      render: (item: GachaItem) => (
        <span className="text-muted-foreground">{item._count.pulls.toLocaleString()}</span>
      ),
    },
    {
      key: 'prize.value',
      label: 'Value',
      render: (item: GachaItem) => (
        <span className="flex items-center gap-1 text-yellow-400">
          <Gem className="h-4 w-4" />
          {item.prize.value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: GachaItem) => (
        <StatusBadge variant={item.isActive ? 'success' : 'error'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: GachaItem) => (
        <ActionMenu
          items={[
            {
              label: item.isActive ? 'Deactivate' : 'Activate',
              icon: item.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />,
              onClick: () => handleToggleActive(item.id, item.isActive),
            },
            {
              label: 'Edit Probability',
              icon: <Edit className="h-4 w-4" />,
              onClick: () => router.push(`/admin/gacha/items/${item.id}/edit`),
            },
            {
              label: 'Delete',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => {
                setItemToDelete(item.id)
                setDeleteDialogOpen(true)
              },
              variant: 'danger',
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Gacha System</h1>
            <p className="text-muted-foreground mt-1">Manage gacha items and view statistics</p>
          </div>
          <Link
            href="/admin/gacha/items/new"
            className="flex items-center gap-2 px-4 py-2 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
          >
            <Plus className="h-5 w-5" />
            Add Gacha Item
          </Link>
        </div>

      {/* Statistics Dashboard */}
      {statsLoading ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <div className="text-muted-foreground">Loading statistics...</div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Pulls */}
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm font-medium mb-2">Total Pulls</div>
            <div className="text-3xl font-bold text-foreground">{stats.totalPulls.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {stats.recentPulls24h} in last 24h
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm font-medium mb-2">Total Revenue</div>
            <div className="flex items-center gap-2 text-3xl font-bold text-yellow-400">
              <Gem className="h-8 w-8" />
              {stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Diamonds spent</div>
          </div>

          {/* SSR Rate */}
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm font-medium mb-2">SSR Rate</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.ssrRate}%</div>
            <div className="text-sm text-muted-foreground mt-1">
              {stats.guaranteedSSRCount} guaranteed
            </div>
          </div>

          {/* Active Items */}
          <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
            <div className="text-muted-foreground text-sm font-medium mb-2">Active Items</div>
            <div className="text-3xl font-bold text-foreground">{stats.activeItemsCount}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {stats.uniqueUsersCount} unique users
            </div>
          </div>
        </div>
      ) : null}

      {/* Prize Distribution */}
      {stats && stats.prizeDistribution.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Prize Distribution</h2>
          <div className="space-y-3">
            {stats.prizeDistribution.map((item) => (
              <div key={item.rarity} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusBadge variant={getRarityColor(item.rarity)}>
                    {item.rarity}
                  </StatusBadge>
                  <span className="text-muted-foreground">{item.count.toLocaleString()} pulls</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-foreground font-medium w-16 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gacha Items Table */}
      <div className="bg-card border border-border rounded-lg dark:shadow-lg dark:shadow-red-500/10">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Gacha Items</h2>
            <div className="flex items-center gap-3">
              <FilterDropdown
                label="Rarity"
                value={rarityFilter}
                onChange={setRarityFilter}
                options={[
                  { label: 'All Rarities', value: '' },
                  { label: 'Common', value: 'COMMON' },
                  { label: 'Rare', value: 'RARE' },
                  { label: 'Epic', value: 'EPIC' },
                  { label: 'SSR', value: 'SSR' },
                  { label: 'Legendary', value: 'LEGENDARY' },
                ]}
              />
              <FilterDropdown
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: 'All Status', value: '' },
                  { label: 'Active', value: 'true' },
                  { label: 'Inactive', value: 'false' },
                ]}
              />
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={gachaItems}
          keyExtractor={(item) => item.id}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setItemToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete Gacha Item"
        message="Are you sure you want to delete this gacha item? If it has existing pulls, it will be deactivated instead."
        confirmText="Delete"
        variant="danger"
      />
      </div>
    </div>
  )
}

