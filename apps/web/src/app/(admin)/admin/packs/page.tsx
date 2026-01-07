'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ActionMenu from '@/components/admin/ActionMenu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { Plus, Gem, Ticket, Star, Edit, Play, Pause, Trash2, Package, TrendingUp, Sparkles, ShoppingBag } from 'lucide-react'

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

  const getRarityBadge = (rarity: string) => {
    const badgeStyles: Record<string, { color: string; borderColor: string; bgColor: string; shadowColor: string }> = {
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
      LEGENDARY: {
        color: 'text-[#FF1F7D]',
        borderColor: 'border-[#FF1F7D]/40',
        bgColor: 'bg-[#FF1F7D]/20',
        shadowColor: 'shadow-[#FF1F7D]/20',
      },
      SSR: {
        color: 'text-[#FFC700]',
        borderColor: 'border-[#FFC700]/40',
        bgColor: 'bg-[#FFC700]/20',
        shadowColor: 'shadow-[#FFC700]/20',
      },
    }
    return badgeStyles[rarity] || badgeStyles.COMMON
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
              className="w-16 h-16 rounded-lg object-cover border-2 border-white/10"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-white/10 flex items-center justify-center text-2xl">
              📦
            </div>
          )}
          <div>
            <div className="font-medium text-white">{pack.name}</div>
            <div className="text-sm text-white/60 line-clamp-1">{pack.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (pack: PremiumPack) => (
        <div>
          <div className="text-white font-bold text-lg">${pack.price.toFixed(2)}</div>
          <div className="text-xs text-white/60">{pack.currency}</div>
        </div>
      ),
    },
    {
      key: 'contents',
      label: 'Contents',
      render: (pack: PremiumPack) => {
        const styles = pack.guaranteedPrize ? getRarityBadge(pack.guaranteedPrize.rarity) : null
        return (
          <div className="space-y-2 text-sm">
            {pack.guaranteedPrize && styles && (
              <div className="space-y-1">
                <span className={`inline-flex rounded-full border-2 ${styles.borderColor} ${styles.bgColor} px-3 py-1 font-display text-xs font-black uppercase tracking-wider ${styles.color} shadow-lg ${styles.shadowColor}`}>
                  {pack.guaranteedPrize.rarity}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-white/60">🎁</span>
                  <span className="text-white/60">{pack.guaranteedPrize.name}</span>
                </div>
              </div>
            )}
            {pack.bonusTickets > 0 && (
              <div className="flex items-center gap-1 text-white/60">
                <Ticket className="h-4 w-4 text-[#00F5FF]" />
                {pack.bonusTickets} Draw Ticket{pack.bonusTickets > 1 ? 's' : ''}
              </div>
            )}
            {pack.bonusDiamonds > 0 && (
              <div className="flex items-center gap-1 text-white/60">
                <Gem className="h-4 w-4 text-[#FFC700]" />
                {pack.bonusDiamonds.toLocaleString()} Diamonds
              </div>
            )}
          </div>
        )
      },
    },
    {
      key: 'value',
      label: 'Total Value',
      render: (pack: PremiumPack) => (
        <span className="text-[#10B981] font-medium">${getTotalValue(pack).toFixed(2)}</span>
      ),
    },
    {
      key: 'purchases',
      label: 'Purchases',
      render: (pack: PremiumPack) => (
        <span className="text-white/60">{pack._count.purchases}</span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (pack: PremiumPack) => (
        pack.featured ? (
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#FFC700]/40 bg-[#FFC700]/20 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-[#FFC700] shadow-lg shadow-[#FFC700]/20">
            <Star className="h-3 w-3" />
            Yes
          </span>
        ) : (
          <span className="inline-flex rounded-full border-2 border-white/20 bg-white/10 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-white/40">
            No
          </span>
        )
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (pack: PremiumPack) => (
        pack.isActive ? (
          <span className="inline-flex rounded-full border-2 border-[#10B981]/40 bg-[#10B981]/20 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-[#10B981] shadow-lg shadow-[#10B981]/20">
            Active
          </span>
        ) : (
          <span className="inline-flex rounded-full border-2 border-[#FF1F7D]/40 bg-[#FF1F7D]/20 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-[#FF1F7D] shadow-lg shadow-[#FF1F7D]/20">
            Inactive
          </span>
        )
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
      <AdminPageHeader
        title="Premium Packs"
        description="Manage premium pack offerings and bundles"
        actions={
          <Link
            href="/admin/packs/new"
            className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40"
          >
            <Plus className="h-5 w-5 text-[#FF1F7D]" />
            <span className="text-[#FF1F7D]">Add Pack</span>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Packs - Cyan */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#00F5FF]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#00F5FF]/60 hover:shadow-[0_0_40px_rgba(0,245,255,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#00F5FF]/20 p-3 ring-2 ring-[#00F5FF]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Package className="h-8 w-8 text-[#00F5FF]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Total Packs</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">{packs.length}</p>
            </div>
          </div>
        </div>

        {/* Active Packs - Emerald */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#10B981]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#10B981]/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#10B981]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#10B981]/20 p-3 ring-2 ring-[#10B981]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <TrendingUp className="h-8 w-8 text-[#10B981]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Active Packs</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {packs.filter((p) => p.isActive).length}
              </p>
            </div>
          </div>
        </div>

        {/* Featured Packs - Gold */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FFC700]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FFC700]/60 hover:shadow-[0_0_40px_rgba(255,199,0,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FFC700]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#FFC700]/20 p-3 ring-2 ring-[#FFC700]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Sparkles className="h-8 w-8 text-[#FFC700]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Featured Packs</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {packs.filter((p) => p.featured).length}
              </p>
            </div>
          </div>
        </div>

        {/* Total Purchases - Purple */}
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-[#8B5CF6]/20 p-3 ring-2 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <ShoppingBag className="h-8 w-8 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-white/60">Total Purchases</p>
              <p className="font-display text-3xl font-black tabular-nums text-white">
                {packs.reduce((sum, p) => sum + p._count.purchases, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl">
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

