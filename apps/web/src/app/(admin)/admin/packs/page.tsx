'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import ActionMenu from '@/components/admin/ActionMenu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { Plus, Gem, Ticket, Star, Edit, Play, Pause, Trash2 } from 'lucide-react'

interface Prize {
  id: string
  name: string
  rarity: string
  type: string
  image: string | null
  value: number
}

interface PremiumPack {
  id: string
  name: string
  description: string
  price: number
  currency: string
  guaranteedPrizeId: string | null
  bonusTickets: number
  bonusDiamonds: number
  imageUrl: string | null
  featured: boolean
  sortOrder: number
  isActive: boolean
  createdAt: string
  guaranteedPrize: Prize | null
  _count: {
    purchases: number
  }
}

export default function PremiumPacksPage() {
  const router = useRouter()
  const [packs, setPacks] = useState<PremiumPack[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [packToDelete, setPackToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchPacks()
  }, [])

  const fetchPacks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/packs')
      const data = await response.json()

      if (data.success) {
        setPacks(data.packs || [])
      }
    } catch (error) {
      console.error('Failed to fetch packs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/packs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (response.ok) {
        fetchPacks()
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error)
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/packs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      })

      if (response.ok) {
        fetchPacks()
      }
    } catch (error) {
      console.error('Failed to toggle active:', error)
    }
  }

  const handleDelete = async () => {
    if (!packToDelete) return

    try {
      const response = await fetch(`/api/admin/packs/${packToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPacks()
        setDeleteDialogOpen(false)
        setPackToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete pack:', error)
    }
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

  const getTotalValue = (pack: PremiumPack) => {
    // Rough calculation: diamonds/100 + tickets*1 + prize value/100
    const diamondValue = pack.bonusDiamonds / 100
    const ticketValue = pack.bonusTickets * 1
    const prizeValue = pack.guaranteedPrize ? pack.guaranteedPrize.value / 100 : 0
    return pack.price + diamondValue + ticketValue + prizeValue
  }

  const columns = [
    {
      key: 'name',
      label: 'Pack',
      render: (pack: PremiumPack) => (
        <div className="flex items-center gap-3">
          {pack.imageUrl ? (
            <img
              src={pack.imageUrl}
              alt={pack.name}
              className="w-16 h-16 rounded-lg object-cover border border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-border flex items-center justify-center text-2xl">
              📦
            </div>
          )}
          <div>
            <div className="font-medium text-foreground">{pack.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-1">{pack.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (pack: PremiumPack) => (
        <div>
          <div className="text-foreground font-bold text-lg">${pack.price.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">{pack.currency}</div>
        </div>
      ),
    },
    {
      key: 'contents',
      label: 'Contents',
      render: (pack: PremiumPack) => (
        <div className="space-y-1 text-sm">
          {pack.guaranteedPrize && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">🎁</span>
              <span className="text-muted-foreground">{pack.guaranteedPrize.name}</span>
              <StatusBadge variant={getRarityColor(pack.guaranteedPrize.rarity)}>
                {pack.guaranteedPrize.rarity}
              </StatusBadge>
            </div>
          )}
          {pack.bonusTickets > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Ticket className="h-4 w-4 text-blue-400" />
              {pack.bonusTickets} Draw Ticket{pack.bonusTickets > 1 ? 's' : ''}
            </div>
          )}
          {pack.bonusDiamonds > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Gem className="h-4 w-4 text-yellow-400" />
              {pack.bonusDiamonds.toLocaleString()} Diamonds
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'value',
      label: 'Total Value',
      render: (pack: PremiumPack) => (
        <span className="text-green-400 font-medium">${getTotalValue(pack).toFixed(2)}</span>
      ),
    },
    {
      key: 'purchases',
      label: 'Purchases',
      render: (pack: PremiumPack) => (
        <span className="text-muted-foreground">{pack._count.purchases}</span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (pack: PremiumPack) => (
        <StatusBadge variant={pack.featured ? 'warning' : 'gray'}>
          {pack.featured ? (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Yes
            </span>
          ) : (
            'No'
          )}
        </StatusBadge>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (pack: PremiumPack) => (
        <StatusBadge variant={pack.isActive ? 'success' : 'error'}>
          {pack.isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (pack: PremiumPack) => (
        <ActionMenu
          items={[
            {
              label: 'Edit',
              icon: <Edit className="h-4 w-4" />,
              onClick: () => router.push(`/admin/packs/${pack.id}/edit`),
            },
            {
              label: pack.featured ? 'Unfeature' : 'Feature',
              icon: <Star className="h-4 w-4" />,
              onClick: () => handleToggleFeatured(pack.id, pack.featured),
            },
            {
              label: pack.isActive ? 'Deactivate' : 'Activate',
              icon: pack.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />,
              onClick: () => handleToggleActive(pack.id, pack.isActive),
            },
            {
              label: 'Delete',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => {
                setPackToDelete(pack.id)
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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Premium Packs</h1>
          <p className="text-muted-foreground mt-1">Manage premium pack offerings and bundles</p>
        </div>
        <Link
          href="/admin/packs/new"
          className="px-4 py-2 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
        >
          + Add Pack
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Total Packs</div>
          <div className="text-3xl font-bold text-foreground">{packs.length}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Active Packs</div>
          <div className="text-3xl font-bold text-green-400">
            {packs.filter((p) => p.isActive).length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Featured Packs</div>
          <div className="text-3xl font-bold text-yellow-400">
            {packs.filter((p) => p.featured).length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <div className="text-muted-foreground text-sm mb-1">Total Purchases</div>
          <div className="text-3xl font-bold text-purple-400">
            {packs.reduce((sum, p) => sum + p._count.purchases, 0)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg dark:shadow-lg dark:shadow-red-500/10">
        <DataTable
          columns={columns}
          data={packs}
          keyExtractor={(pack) => pack.id}
          loading={loading}
          pagination={{
            page: 1,
            limit: packs.length,
            total: packs.length,
            totalPages: 1,
          }}
          onPageChange={() => {}}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setPackToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Deactivate Premium Pack"
        message="Are you sure you want to deactivate this pack? It will no longer be available for purchase. This action can be reversed."
        confirmText="Deactivate"
        variant="danger"
      />
      </div>
    </div>
  )
}

