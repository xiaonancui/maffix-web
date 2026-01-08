'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import FilterDropdown from '@/components/admin/FilterDropdown'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ActionMenu from '@/components/admin/ActionMenu'
import {
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Music,
  Calendar,
  Gem,
  Ticket,
} from 'lucide-react'

interface GachaBanner {
  id: string
  name: string
  slug: string
  description: string | null
  backgroundVideoUrl: string
  currencyType: 'DIAMONDS' | 'TICKETS'
  costPerPull: number
  startDate: string
  endDate: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  _count?: {
    gachaItems: number
    gachaPulls: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function GachaBannersPage() {
  const router = useRouter()
  const [banners, setBanners] = useState<GachaBanner[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null)

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (statusFilter) params.append('isActive', statusFilter)

      const response = await fetch(`/api/admin/gacha/banners?${params}`)
      const data = await response.json()

      if (data.success) {
        setBanners(data.banners || [])
        setPagination(data.pagination || pagination)
      } else {
        console.error('Failed to fetch banners:', data.error)
        setBanners([])
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [pagination.page, statusFilter])

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/gacha/banners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchBanners()
      }
    } catch (error) {
      console.error('Failed to toggle banner status:', error)
    }
  }

  const handleDelete = async () => {
    if (!bannerToDelete) return

    try {
      const response = await fetch(`/api/admin/gacha/banners/${bannerToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBanners()
        setDeleteDialogOpen(false)
        setBannerToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete banner:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getBannerStatus = (banner: GachaBanner) => {
    const now = new Date()
    const startDate = new Date(banner.startDate)
    const endDate = new Date(banner.endDate)

    if (!banner.isActive) {
      return { label: 'Inactive', color: 'white/40', borderColor: 'white/20', bgColor: 'white/10' }
    }
    if (now < startDate) {
      return { label: 'Scheduled', color: '[#00F5FF]', borderColor: '[#00F5FF]/40', bgColor: '[#00F5FF]/20' }
    }
    if (now > endDate) {
      return { label: 'Ended', color: '[#FF1F7D]', borderColor: '[#FF1F7D]/40', bgColor: '[#FF1F7D]/20' }
    }
    return { label: 'Live', color: '[#10B981]', borderColor: '[#10B981]/40', bgColor: '[#10B981]/20' }
  }

  const columns = [
    {
      key: 'name',
      label: 'Banner',
      render: (banner: GachaBanner) => (
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-white/10 bg-gradient-to-br from-[#8B5CF6]/20 to-[#FF1F7D]/20">
            <Music className="h-6 w-6 text-[#8B5CF6]" />
          </div>
          <div>
            <div className="font-medium text-white">{banner.name}</div>
            <div className="text-sm text-white/60">{banner.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'currencyType',
      label: 'Currency',
      render: (banner: GachaBanner) => (
        <div className="flex items-center gap-2">
          {banner.currencyType === 'DIAMONDS' ? (
            <>
              <Gem className="h-4 w-4 text-[#00F5FF]" />
              <span className="text-[#00F5FF]">{banner.costPerPull}</span>
            </>
          ) : (
            <>
              <Ticket className="h-4 w-4 text-[#8B5CF6]" />
              <span className="text-[#8B5CF6]">{banner.costPerPull}</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'dates',
      label: 'Schedule',
      render: (banner: GachaBanner) => (
        <div className="text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(banner.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <span className="ml-5">to {formatDate(banner.endDate)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'stats',
      label: 'Stats',
      render: (banner: GachaBanner) => (
        <div className="text-sm text-white/60">
          <div>{banner._count?.gachaItems || 0} items</div>
          <div>{banner._count?.gachaPulls || 0} pulls</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (banner: GachaBanner) => {
        const status = getBannerStatus(banner)
        return (
          <span
            className={`inline-flex rounded-full border-2 border-${status.borderColor} bg-${status.bgColor} px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-${status.color}`}
          >
            {status.label}
          </span>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (banner: GachaBanner) => (
        <ActionMenu
          items={[
            {
              label: banner.isActive ? 'Deactivate' : 'Activate',
              icon: banner.isActive ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              ),
              onClick: () => handleToggleActive(banner.id, banner.isActive),
            },
            {
              label: 'Edit',
              icon: <Edit className="h-4 w-4" />,
              onClick: () => router.push(`/admin/gacha/banners/${banner.id}/edit`),
            },
            {
              label: 'Delete',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => {
                setBannerToDelete(banner.id)
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
          title="Banner Management"
          description="Manage gacha banners with start/end dates"
          actions={
            <div className="flex items-center gap-3">
              <Link
                href="/admin/gacha"
                className="rounded-2xl border-2 border-white/10 bg-white/5 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white hover:scale-105 transition-all duration-300"
              >
                Back to Gacha
              </Link>
              <Link
                href="/admin/gacha/banners/new"
                className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40"
              >
                <Plus className="h-5 w-5 text-[#FF1F7D]" />
                <span className="text-[#FF1F7D]">New Banner</span>
              </Link>
            </div>
          }
        />

        {/* Banners Table */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl">
          <div className="border-b-2 border-white/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">
                Gacha Banners
              </h2>
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

          <DataTable
            columns={columns}
            data={banners}
            keyExtractor={(banner) => banner.id}
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
            setBannerToDelete(null)
          }}
          onConfirm={handleDelete}
          title="Delete Banner"
          message="Are you sure you want to delete this banner? This action cannot be undone if there are no associated pulls."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </div>
  )
}
