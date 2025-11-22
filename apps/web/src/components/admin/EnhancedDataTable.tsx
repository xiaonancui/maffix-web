'use client'

import { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import Pagination from './Pagination'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
  sortable?: boolean
  width?: string
}

interface EnhancedDataTableProps<T> {
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

export default function EnhancedDataTable<T>({
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
}: EnhancedDataTableProps<T>) {
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
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10 hover:bg-primary/10">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      resolvedSelectedIds.length === data.length && data.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    'text-primary font-bold uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:text-primary/80',
                    column.width
                  )}
                  onClick={() => column.sortable && onSort?.(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortBy === column.key && (
                      <span className="text-primary">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const id = keyExtractor(item)
              const isSelected = resolvedSelectedIds.includes(id)

              return (
                <TableRow
                  key={id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    onRowClick && 'cursor-pointer',
                    isSelected && 'bg-primary/15'
                  )}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(e) => {
                          handleSelectRow(id)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item)
                        : String((item as any)[column.key] || '-')}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {pagination && onPageChange && (
        <div className="px-6 py-4 border-t border-border bg-card">
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

