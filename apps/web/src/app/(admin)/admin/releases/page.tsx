'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import SearchBar from '@/components/admin/SearchBar'
import FilterDropdown from '@/components/admin/FilterDropdown'
import Pagination from '@/components/admin/Pagination'
import StatusBadge from '@/components/admin/StatusBadge'
import ActionMenu from '@/components/admin/ActionMenu'
import BulkActions from '@/components/admin/BulkActions'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface Release {
  id: string
  title: string
  artist: string
  videoUrl: string
  thumbnailUrl?: string
  views?: string
  releaseDate: string
  genre?: string
  featured: boolean
  isActive: boolean
  createdAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function ReleasesPage() {
  const router = useRouter()
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [artistFilter, setArtistFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [selectedReleases, setSelectedReleases] = useState<string[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id?: string; bulk?: boolean }>({
    show: false,
  })

  // Fetch releases from API
  const fetchReleases = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (artistFilter) params.append('artist', artistFilter)
      if (statusFilter) params.append('isActive', statusFilter)

      const response = await fetch(`/api/admin/releases?${params}`)
      const data = await response.json()

      if (data.success) {
        setReleases(data.releases || [])
        setPagination(data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        })
      } else {
        console.error('Failed to fetch releases:', data.error)
        setReleases([])
      }
    } catch (error) {
      console.error('Failed to fetch releases:', error)
      setReleases([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReleases()
  }, [pagination.page, artistFilter, statusFilter])

  // Filter releases by search query (client-side)
  const filteredReleases = (releases || []).filter((release) =>
    release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    release.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/releases/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchReleases()
        setDeleteConfirm({ show: false })
      } else {
        const data = await response.json()
        alert(`Failed to delete release: ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to delete release:', error)
      alert('Failed to delete release')
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedReleases.map((id) =>
          fetch(`/api/admin/releases/${id}`, { method: 'DELETE' })
        )
      )
      setSelectedReleases([])
      fetchReleases()
      setDeleteConfirm({ show: false })
    } catch (error) {
      console.error('Failed to bulk delete releases:', error)
      alert('Failed to delete releases')
    }
  }

  // Table columns
  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (release: Release) => (
        <div className="flex items-center gap-3">
          {release.thumbnailUrl && (
            <img
              src={release.thumbnailUrl}
              alt={release.title}
              className="h-12 w-20 rounded object-cover"
            />
          )}
          <div>
            <div className="font-semibold text-white">{release.title}</div>
            <div className="text-sm text-gray-400">{release.artist}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'genre',
      label: 'Genre',
      render: (release: Release) => (
        <span className="text-gray-300">{release.genre || '-'}</span>
      ),
    },
    {
      key: 'views',
      label: 'Views',
      render: (release: Release) => (
        <span className="text-gray-300">{release.views || '-'}</span>
      ),
    },
    {
      key: 'releaseDate',
      label: 'Release Date',
      render: (release: Release) => (
        <span className="text-gray-300">
          {new Date(release.releaseDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (release: Release) => (
        <div className="flex gap-2">
          {release.featured && <StatusBadge variant="warning">Featured</StatusBadge>}
          {release.isActive ? (
            <StatusBadge variant="success">Active</StatusBadge>
          ) : (
            <StatusBadge variant="neutral">Inactive</StatusBadge>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (release: Release) => (
        <ActionMenu
          items={[
            {
              label: 'Edit',
              onClick: () => router.push(`/admin/releases/${release.id}/edit`),
              variant: 'default',
            },
            {
              label: 'View Video',
              onClick: () => window.open(release.videoUrl, '_blank'),
              variant: 'default',
            },
            {
              label: 'Delete',
              onClick: () => setDeleteConfirm({ show: true, id: release.id }),
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
        <AdminPageHeader
          title="Release Management"
          description="Manage video releases and music content"
          actions={
            <button
              onClick={() => router.push('/admin/releases/new')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/40 hover:scale-105"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Release
            </button>
          }
        />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search releases..."
        />

        <div className="flex gap-3">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All', value: '' },
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReleases.length > 0 && (
        <BulkActions
          selectedCount={selectedReleases.length}
          onClearSelection={() => setSelectedReleases([])}
          actions={[
            {
              label: 'Delete Selected',
              onClick: () => setDeleteConfirm({ show: true, bulk: true }),
              variant: 'danger',
            },
          ]}
        />
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredReleases}
        keyExtractor={(release) => release.id}
        loading={loading}
        selectable
        selectedRows={selectedReleases}
        onSelectionChange={setSelectedReleases}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title={deleteConfirm.bulk ? 'Delete Releases' : 'Delete Release'}
        message={
          deleteConfirm.bulk
            ? `Are you sure you want to delete ${selectedReleases.length} releases? This action cannot be undone.`
            : 'Are you sure you want to delete this release? This action cannot be undone.'
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteConfirm.bulk) {
            handleBulkDelete()
          } else if (deleteConfirm.id) {
            handleDelete(deleteConfirm.id)
          }
        }}
        onCancel={() => setDeleteConfirm({ show: false })}
        variant="danger"
      />
      </div>
    </div>
  )
}

