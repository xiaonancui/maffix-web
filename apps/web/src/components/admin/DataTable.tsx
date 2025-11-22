'use client'

import { ReactNode } from 'react'
import Pagination from './Pagination'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  selectable?: boolean
  selectedIds?: string[]
  selectedRows?: string[]
  onSelectionChange?: (ids: string[]) => void
  emptyMessage?: string
  loading?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
  pagination?: {
    page: number
    totalPages: number
    total?: number
    limit?: number
  }
  onPageChange?: (page: number) => void
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectable = false,
  selectedIds,
  selectedRows,
  onSelectionChange,
  emptyMessage = 'No data available',
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  pagination,
  onPageChange,
}: DataTableProps<T>) {
  const resolvedSelectedIds = selectedIds ?? selectedRows ?? []

  const handleSelectAll = () => {
    if (resolvedSelectedIds.length === data.length) {
      onSelectionChange?.([])
    } else {
      onSelectionChange?.(data.map(keyExtractor))
    }
  }

  const handleSelectRow = (id: string) => {
    if (resolvedSelectedIds.includes(id)) {
      onSelectionChange?.(
        resolvedSelectedIds.filter((selectedId) => selectedId !== id)
      )
    } else {
      onSelectionChange?.([...resolvedSelectedIds, id])
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg bg-card border border-red-500/20 p-12 text-center dark:shadow-lg shadow-red-500/20">
        <div className="flex items-center justify-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-gray-400">Loading...</span>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg bg-card border border-red-500/20 p-12 text-center dark:shadow-lg shadow-red-500/20">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-card dark:shadow-lg shadow-red-500/20 border border-red-500/20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-red-900/20 border-b-2 border-red-500/30">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={
                      resolvedSelectedIds.length === data.length && data.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-red-500/30 bg-card text-red-500 focus:ring-red-500/20"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-red-400 ${
                    column.width || ''
                  } ${column.sortable ? 'cursor-pointer hover:text-red-300' : ''}`}
                  onClick={() => column.sortable && onSort?.(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortBy === column.key && (
                      <span className="text-red-400">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-card">
            {data.map((item) => {
              const id = keyExtractor(item)
              const isSelected = resolvedSelectedIds.includes(id)

              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(item)}
                  className={`odd:bg-red-500/5 hover:bg-red-500/10 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${isSelected ? 'bg-red-500/15' : ''}`}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleSelectRow(id)
                        }}
                        className="rounded border-red-500/30 bg-card text-red-500 focus:ring-red-500/20"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-gray-300">
                      {column.render
                        ? column.render(item)
                        : String((item as any)[column.key] || '-')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange && (
        <div className="px-6 py-4 border-t border-gray-800 bg-card">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages || 1}
            onPageChange={onPageChange}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
          />
        </div>
      )}
    </div>
  )
}
