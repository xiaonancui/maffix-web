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
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#8B5CF6]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {action.label}
        </button>
      )
    }
    return null
  }

  return (
    <div className="relative mb-8 pb-6">
      {/* Gradient border divider */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF1F7D] via-[#8B5CF6] to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#FF1F7D]/50 via-[#8B5CF6]/50 to-transparent blur-sm" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl font-black tracking-tight text-white">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-2 text-sm font-medium text-white/60">{description}</p>
          )}
        </div>
        {renderActions() && (
          <div className="flex flex-shrink-0 items-center gap-3">
            {renderActions()}
          </div>
        )}
      </div>
    </div>
  )
}
