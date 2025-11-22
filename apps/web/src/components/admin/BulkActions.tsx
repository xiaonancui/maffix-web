'use client'

import { ReactNode } from 'react'

export interface BulkAction {
  label: string
  icon?: string
  onClick: (selectedIds: string[]) => void
  variant?: 'default' | 'danger' | 'success'
  disabled?: boolean
}

interface BulkActionsProps {
  selectedCount: number
  totalCount?: number
  actions: BulkAction[]
  onSelectAll?: () => void
  onDeselectAll?: () => void
  onClearSelection?: () => void
  selectedIds?: string[]
}

export default function BulkActions({
  selectedCount,
  totalCount,
  actions,
  onSelectAll,
  onDeselectAll,
  onClearSelection,
  selectedIds = [],
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  const variantStyles = {
    default: 'bg-[#1a1a1a] border-red-500/30 text-white hover:border-red-500/50',
    danger: 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30',
    success: 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30',
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 mb-4">
      {/* Selection Info */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-white">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </span>
        {totalCount && selectedCount < totalCount ? (
          <button
            onClick={onSelectAll}
            className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            Select all {totalCount}
          </button>
        ) : (
          <button
            onClick={onDeselectAll ?? onClearSelection}
            className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            {totalCount ? 'Deselect all' : 'Clear selection'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => action.onClick(selectedIds)}
            disabled={action.disabled}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              variantStyles[action.variant || 'default']
            }`}
          >
            {action.icon && <span>{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
