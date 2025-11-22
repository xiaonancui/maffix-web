import { ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  action?: {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  badge?: ReactNode
}

export default function AdminPageHeader({
  title,
  description,
  actions,
  action,
  badge,
}: AdminPageHeaderProps) {
  const renderActions = () => {
    if (actions) return actions
    if (action) {
      return (
        <button
          onClick={action.onClick}
          disabled={action.disabled}
          className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/30 hover:from-red-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {action.label}
        </button>
      )
    }
    return null
  }

  return (
    <div className="border-b-2 border-red-500/30 pb-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-2 text-sm text-gray-400">{description}</p>
          )}
        </div>
        {renderActions() && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {renderActions()}
          </div>
        )}
      </div>
    </div>
  )
}
