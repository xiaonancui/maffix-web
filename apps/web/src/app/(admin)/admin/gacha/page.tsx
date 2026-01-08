'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import FilterDropdown from '@/components/admin/FilterDropdown'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ActionMenu from '@/components/admin/ActionMenu'
import { Plus, Gem, Edit, Play, Pause, Trash2, Sparkles, TrendingUp, Star, Users } from 'lucide-react'

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
  const fetchStats = useCallback(async () => {
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
  }, [])

  // Fetch gacha items
  const fetchGachaItems = useCallback(async () => {
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
  }, [pagination.page, pagination.limit, rarityFilter, statusFilter])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    fetchGachaItems()
  }, [fetchGachaItems])

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

  const getRarityBadge = (rarity: string) => {
    const rarityStyles: Record<string, { color: string; borderColor: string; bgColor: string; shadowColor: string }> = {
      COMMON: {
        color: 'text-white/40',
        borderColor: 'border-white/20',
        bgColor: 'bg-white/10',
        shadowColor: 'shadow-white/10',
      },
      RARE: {
        color: 'text-[#00F5FF]',
        borderColor: 'border-[#00F5FF]/40',
        bgColor: 'bg-[#00F5FF]/20',
        shadowColor: 'shadow-[#00F5FF]/20',
      },
      EPIC: {
        color: 'text-[#8B5CF6]',
        borderColor: 'border-[#8B5CF6]/40',
        bgColor: 'bg-[#8B5CF6]/20',
        shadowColor: 'shadow-[#8B5CF6]/20',
      },
      SSR: {
        color: 'text-[#FFC700]',
        borderColor: 'border-[#FFC700]/40',
        bgColor: 'bg-[#FFC700]/20',
        shadowColor: 'shadow-[#FFC700]/20',
      },
      LEGENDARY: {
        color: 'text-[#FF1F7D]',
        borderColor: 'border-[#FF1F7D]/40',
        bgColor: 'bg-[#FF1F7D]/20',
        shadowColor: 'shadow-[#FF1F7D]/20',
      },
    }
    return rarityStyles[rarity] || rarityStyles.COMMON
  }

  const columns = [
    {
      key: 'prize.name',
      label: 'Prize',
      render: (item: GachaItem) => (
        <div className="flex items-center gap-3">
          {item.prize.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.prize.image}
              alt={item.prize.name}
              className="h-12 w-12 rounded-lg border-2 border-white/10 object-cover"
            />
          )}
          <div>
            <div className="font-medium text-white">{item.prize.name}</div>
            <div className="text-sm text-white/60">{item.prize.type}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'prize.rarity',
      label: 'Rarity',
      render: (item: GachaItem) => {
        const styles = getRarityBadge(item.prize.rarity)
        return (
          <span className={`inline-flex rounded-full border-2 ${styles.borderColor} ${styles.bgColor} px-3 py-1 font-display text-xs font-black uppercase tracking-wider ${styles.color} shadow-lg ${styles.shadowColor}`}>
            {item.prize.rarity}
          </span>
        )
      },
    },
    {
      key: 'probability',
      label: 'Probability',
      render: (item: GachaItem) => (
        <span className="font-medium text-white">{item.probability.toFixed(2)}%</span>
      ),
    },
    {
      key: '_count.pulls',
      label: 'Total Pulls',
      render: (item: GachaItem) => (
        <span className="text-white/60">{item._count.pulls.toLocaleString()}</span>
      ),
    },
    {
      key: 'prize.value',
      label: 'Value',
      render: (item: GachaItem) => (
        <span className="flex items-center gap-1 text-[#FFC700]">
          <Gem className="h-4 w-4" />
          {item.prize.value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: GachaItem) => (
        item.isActive ? (
          <span className="inline-flex rounded-full border-2 border-[#10B981]/40 bg-[#10B981]/20 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-[#10B981] shadow-lg shadow-[#10B981]/20">
            Active
          </span>
        ) : (
          <span className="inline-flex rounded-full border-2 border-white/20 bg-white/10 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-white/40">
            Inactive
          </span>
        )
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
              onClick: () => router.push(`/admin/gacha/${item.id}/edit`),
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
        <AdminPageHeader
          title="Aura Zone"
          description="Manage gacha items and view statistics"
          actions={
            <Link
              href="/admin/gacha/new"
              className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40"
            >
              <Plus className="h-5 w-5 text-[#FF1F7D]" />
              <span className="text-[#FF1F7D]">Add Gacha Item</span>
            </Link>
          }
        />

      {/* Statistics Dashboard */}
      {statsLoading ? (
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-8 text-center shadow-xl backdrop-blur-xl">
          <div className="text-white/60">Loading statistics...</div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Pulls - Cyan */}
          <div className="group relative overflow-hidden rounded-3xl border-2 border-[#00F5FF]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#00F5FF]/60 hover:shadow-[0_0_40px_rgba(0,245,255,0.3)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
            <div className="relative flex items-center gap-4">
              <div className="rounded-2xl bg-[#00F5FF]/20 p-3 ring-2 ring-[#00F5FF]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Sparkles className="h-8 w-8 text-[#00F5FF]" />
              </div>
              <div>
                <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Total Pulls</p>
                <p className="font-display text-3xl font-black tabular-nums text-white">
                  {stats.totalPulls.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="relative mt-3 text-sm font-medium text-white/60">
              {stats.recentPulls24h} in last 24h
            </div>
          </div>

          {/* Total Revenue - Gold */}
          <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FFC700]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FFC700]/60 hover:shadow-[0_0_40px_rgba(255,199,0,0.3)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FFC700]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
            <div className="relative flex items-center gap-4">
              <div className="rounded-2xl bg-[#FFC700]/20 p-3 ring-2 ring-[#FFC700]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Gem className="h-8 w-8 text-[#FFC700]" />
              </div>
              <div>
                <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Total Revenue</p>
                <p className="font-display text-3xl font-black tabular-nums text-white">
                  {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="relative mt-3 text-sm font-medium text-white/60">
              Diamonds spent
            </div>
          </div>

          {/* SSR Rate - Purple */}
          <div className="group relative overflow-hidden rounded-3xl border-2 border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
            <div className="relative flex items-center gap-4">
              <div className="rounded-2xl bg-[#8B5CF6]/20 p-3 ring-2 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Star className="h-8 w-8 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">SSR Rate</p>
                <p className="font-display text-3xl font-black tabular-nums text-white">
                  {stats.ssrRate}%
                </p>
              </div>
            </div>
            <div className="relative mt-3 text-sm font-medium text-white/60">
              {stats.guaranteedSSRCount} guaranteed
            </div>
          </div>

          {/* Active Items - Emerald */}
          <div className="group relative overflow-hidden rounded-3xl border-2 border-[#10B981]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#10B981]/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#10B981]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
            <div className="relative flex items-center gap-4">
              <div className="rounded-2xl bg-[#10B981]/20 p-3 ring-2 ring-[#10B981]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <TrendingUp className="h-8 w-8 text-[#10B981]" />
              </div>
              <div>
                <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Active Items</p>
                <p className="font-display text-3xl font-black tabular-nums text-white">
                  {stats.activeItemsCount}
                </p>
              </div>
            </div>
            <div className="relative mt-3 text-sm font-medium text-white/60">
              {stats.uniqueUsersCount} unique users
            </div>
          </div>
        </div>
      ) : null}

      {/* Prize Distribution */}
      {stats && stats.prizeDistribution.length > 0 && (
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">Prize Distribution</h2>
          <div className="space-y-3">
            {stats.prizeDistribution.map((item) => {
              const styles = getRarityBadge(item.rarity)
              return (
                <div key={item.rarity} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex rounded-full border-2 ${styles.borderColor} ${styles.bgColor} px-3 py-1 font-display text-xs font-black uppercase tracking-wider ${styles.color} shadow-lg ${styles.shadowColor}`}>
                      {item.rarity}
                    </span>
                    <span className="text-white/60">{item.count.toLocaleString()} pulls</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-48 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#8B5CF6]/50 to-[#FF1F7D]/50"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-16 text-right font-bold text-white">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Gacha Items Table */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl">
        <div className="border-b-2 border-white/10 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">Gacha Items</h2>
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

