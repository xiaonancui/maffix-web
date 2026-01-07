'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable, { Column } from '@/components/admin/DataTable'
import SearchBar from '@/components/admin/SearchBar'
import FilterDropdown, { FilterOption } from '@/components/admin/FilterDropdown'
import Pagination from '@/components/admin/Pagination'
import BulkActions, { BulkAction } from '@/components/admin/BulkActions'
import StatusBadge, { BadgeVariant } from '@/components/admin/StatusBadge'
import ActionMenu, { ActionMenuItem } from '@/components/admin/ActionMenu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { Plus, Gem, Star, Edit, Play, Pause, Trash2 } from 'lucide-react'

interface Mission {
  id: string
  title: string
  type: string
  difficulty: string
  missionType: string | null
  points: number
  diamonds: number
  isActive: boolean
  createdAt: string
  _count: {
    completions: number
  }
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [missionToDelete, setMissionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch missions
  const fetchMissions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      })

      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (statusFilter !== 'all') params.append('isActive', statusFilter)

      const response = await fetch(`/api/admin/missions?${params}`)
      const data = await response.json()

      if (data.success) {
        setMissions(data.missions || [])
        setPagination(data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        })
      } else {
        console.error('Failed to fetch missions:', data.error)
        setMissions([])
      }
    } catch (error) {
      console.error('Failed to fetch missions:', error)
      setMissions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, typeFilter, statusFilter])

  // Filter missions by search query (client-side)
  const filteredMissions = (missions || []).filter((mission) =>
    mission.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Type filter options
  const typeOptions: FilterOption[] = [
    { label: 'All Types', value: 'all' },
    { label: 'Social', value: 'SOCIAL' },
    { label: 'Content', value: 'CONTENT' },
    { label: 'Daily', value: 'DAILY' },
    { label: 'Profile', value: 'PROFILE' },
    { label: 'Referral', value: 'REFERRAL' },
    { label: 'Purchase', value: 'PURCHASE' },
    { label: 'Event', value: 'EVENT' },
  ]

  // Status filter options
  const statusOptions: FilterOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ]

  // Table columns
  const columns: Column<Mission>[] = [
    {
      key: 'title',
      label: 'Mission',
      render: (mission) => (
        <div>
          <div className="font-semibold text-foreground">{mission.title}</div>
          <div className="text-xs text-muted-foreground">ID: {mission.id.slice(0, 8)}</div>
        </div>
      ),
      width: '30%',
    },
    {
      key: 'type',
      label: 'Type',
      render: (mission) => (
        <StatusBadge variant="info">{mission.type}</StatusBadge>
      ),
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (mission) => {
        const variant: BadgeVariant = 
          mission.difficulty === 'EASY' ? 'success' :
          mission.difficulty === 'MEDIUM' ? 'warning' : 'error'
        return <StatusBadge variant={variant}>{mission.difficulty}</StatusBadge>
      },
    },
    {
      key: 'rewards',
      label: 'Rewards',
      render: (mission) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Gem className="h-4 w-4 text-yellow-400" />
            {mission.diamonds}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-4 w-4 text-blue-400" />
            {mission.points}
          </div>
        </div>
      ),
    },
    {
      key: 'completions',
      label: 'Completions',
      render: (mission) => (
        <span className="text-foreground font-semibold">{mission._count.completions}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (mission) => (
        <StatusBadge variant={mission.isActive ? 'success' : 'neutral'}>
          {mission.isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (mission) => {
        const menuItems: ActionMenuItem[] = [
          {
            label: 'Edit',
            icon: <Edit className="h-4 w-4" />,
            onClick: () => window.location.href = `/admin/missions/${mission.id}/edit`,
          },
          {
            label: mission.isActive ? 'Deactivate' : 'Activate',
            icon: mission.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />,
            onClick: () => handleToggleStatus(mission.id, mission.isActive),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => {
              setMissionToDelete(mission.id)
              setDeleteDialogOpen(true)
            },
            variant: 'danger',
          },
        ]
        return <ActionMenu items={menuItems} />
      },
      width: '80px',
    },
  ]

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: 'Activate',
      icon: '▶️',
      onClick: (ids) => handleBulkToggleStatus(ids, true),
      variant: 'success',
    },
    {
      label: 'Deactivate',
      icon: '⏸️',
      onClick: (ids) => handleBulkToggleStatus(ids, false),
      variant: 'default',
    },
    {
      label: 'Delete',
      icon: '🗑️',
      onClick: (ids) => handleBulkDelete(ids),
      variant: 'danger',
    },
  ]

  // Handlers
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/missions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchMissions()
      }
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const handleDelete = async () => {
    if (!missionToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/missions/${missionToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchMissions()
        setDeleteDialogOpen(false)
        setMissionToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete mission:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkToggleStatus = async (ids: string[], isActive: boolean) => {
    // TODO: Implement bulk status update API
    console.log('Bulk toggle status:', ids, isActive)
  }

  const handleBulkDelete = async (ids: string[]) => {
    // TODO: Implement bulk delete API
    console.log('Bulk delete:', ids)
  }

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Mission Management"
        description="Create and manage TikTok missions for users"
        actions={
          <Link
            href="/admin/missions/new"
            className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40"
          >
            <Plus className="h-5 w-5 text-[#FF1F7D]" />
            <span className="text-[#FF1F7D]">Create Mission</span>
          </Link>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Search missions..."
          onSearch={setSearchQuery}
          className="sm:w-96"
        />
        <div className="flex gap-3">
          <FilterDropdown
            label="Type"
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          <FilterDropdown
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedIds.length}
        totalCount={filteredMissions.length}
        actions={bulkActions}
        onSelectAll={() => setSelectedIds(filteredMissions.map((m) => m.id))}
        onDeselectAll={() => setSelectedIds([])}
        selectedIds={selectedIds}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredMissions}
        keyExtractor={(mission) => mission.id}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        loading={loading}
        emptyMessage="No missions found. Create your first mission to get started!"
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setMissionToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete Mission"
        message="Are you sure you want to delete this mission? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}


