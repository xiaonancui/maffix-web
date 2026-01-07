'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import SearchBar from '@/components/admin/SearchBar'
import FilterDropdown from '@/components/admin/FilterDropdown'
import ActionMenu from '@/components/admin/ActionMenu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { Plus, Gem, Edit, Play, Pause, Trash2 } from 'lucide-react'

interface Prize {
  id: string
  name: string
  description: string
  rarity: string
  type: string
  image: string | null
  value: number
  stock: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    userPrizes: number
    gachaItems: number
    gachaPulls: number
    premiumPacks: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function PrizesPage() {
  const router = useRouter()
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [rarityFilter, setRarityFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [prizeToDelete, setPrizeToDelete] = useState<Prize | null>(null)

  useEffect(() => {
    fetchPrizes()
  }, [pagination.page, searchQuery, rarityFilter, typeFilter, activeFilter])

  const fetchPrizes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(rarityFilter && { rarity: rarityFilter }),
        ...(typeFilter && { type: typeFilter }),
        ...(activeFilter && { isActive: activeFilter }),
      })

      const response = await fetch(`/api/admin/prizes?${params}`)
      const data = await response.json()

      if (data.success) {
        setPrizes(data.prizes || [])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch prizes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
  }

  const handleToggleActive = async (prize: Prize) => {
    try {
      const response = await fetch(`/api/admin/prizes/${prize.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !prize.isActive }),
      })

      if (response.ok) {
        fetchPrizes()
      }
    } catch (error) {
      console.error('Failed to toggle prize status:', error)
    }
  }

  const handleDeleteClick = (prize: Prize) => {
    setPrizeToDelete(prize)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!prizeToDelete) return

    try {
      const response = await fetch(`/api/admin/prizes/${prizeToDelete.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (response.ok) {
        fetchPrizes()
        setDeleteDialogOpen(false)
        setPrizeToDelete(null)
      } else {
        alert(result.error || 'Failed to delete prize')
      }
    } catch (error) {
      console.error('Failed to delete prize:', error)
      alert('Failed to delete prize')
    }
  }

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      COMMON: 'gray',
      RARE: 'blue',
      EPIC: 'purple',
      SSR: 'error',
      LEGENDARY: 'yellow',
    }
    return colors[rarity] || 'gray'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PHYSICAL: 'blue',
      DIGITAL: 'purple',
      EXPERIENCE: 'yellow',
      DISCOUNT: 'green',
      EXCLUSIVE: 'error',
    }
    return colors[type] || 'gray'
  }

  const columns = [
    {
      key: 'prize',
      label: 'Prize',
      render: (prize: Prize) => (
        <div className="flex items-center gap-3">
          {prize.image ? (
            <img
              src={prize.image}
              alt={prize.name}
              className="w-16 h-16 rounded-lg object-cover border border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-border flex items-center justify-center text-2xl">
              🎁
            </div>
          )}
          <div>
            <div className="font-medium text-foreground">{prize.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {prize.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'rarity',
      label: 'Rarity',
      render: (prize: Prize) => (
        <StatusBadge variant={getRarityColor(prize.rarity)}>
          {prize.rarity}
        </StatusBadge>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (prize: Prize) => (
        <StatusBadge variant={getTypeColor(prize.type)}>{prize.type}</StatusBadge>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      render: (prize: Prize) => (
        <div className="flex items-center gap-1 text-yellow-400 font-medium">
          <Gem className="h-4 w-4" />
          {prize.value.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (prize: Prize) => (
        <div className="text-muted-foreground">
          {prize.stock === null ? '∞ Unlimited' : prize.stock.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'usage',
      label: 'Usage',
      render: (prize: Prize) => (
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>👥 {prize._count.userPrizes} owned</div>
          <div>🎰 {prize._count.gachaPulls} pulls</div>
          <div>📦 {prize._count.premiumPacks} packs</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (prize: Prize) => (
        <StatusBadge variant={prize.isActive ? 'success' : 'gray'}>
          {prize.isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (prize: Prize) => (
        <ActionMenu
          items={[
            {
              label: 'Edit',
              icon: <Edit className="h-4 w-4" />,
              onClick: () => router.push(`/admin/prizes/${prize.id}/edit`),
            },
            {
              label: prize.isActive ? 'Deactivate' : 'Activate',
              icon: prize.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />,
              onClick: () => handleToggleActive(prize),
            },
            {
              label: 'Delete',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => handleDeleteClick(prize),
              variant: 'danger',
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
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Prizes</h1>
          <p className="text-muted-foreground mt-1">Manage prize catalog and inventory</p>
        </div>
        <Link
          href="/admin/prizes/new"
          className="px-4 py-2 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
        >
          + Add Prize
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Total Prizes</div>
          <div className="font-display text-3xl font-bold text-foreground">{pagination.total}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Active</div>
          <div className="font-display text-3xl font-bold text-green-400">
            {prizes.filter((p) => p.isActive).length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">SSR Prizes</div>
          <div className="font-display text-3xl font-bold text-red-400">
            {prizes.filter((p) => p.rarity === 'SSR').length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Legendary</div>
          <div className="font-display text-3xl font-bold text-yellow-400">
            {prizes.filter((p) => p.rarity === 'LEGENDARY').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search prizes..."
          />
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
            label="Type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: 'All Types', value: '' },
              { label: 'Physical', value: 'PHYSICAL' },
              { label: 'Digital', value: 'DIGITAL' },
              { label: 'Experience', value: 'EXPERIENCE' },
              { label: 'Discount', value: 'DISCOUNT' },
              { label: 'Exclusive', value: 'EXCLUSIVE' },
            ]}
          />
          <FilterDropdown
            label="Status"
            value={activeFilter}
            onChange={setActiveFilter}
            options={[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg dark:shadow-lg dark:shadow-red-500/10">
        <DataTable
          columns={columns}
          data={prizes}
          keyExtractor={(prize) => prize.id}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Prize"
        message={
          prizeToDelete
            ? `Are you sure you want to delete "${prizeToDelete.name}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

