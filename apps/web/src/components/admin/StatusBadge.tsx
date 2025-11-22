import { ReactNode } from 'react'

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'admin'
  | 'artist'
  | 'gray'

interface StatusBadgeProps {
  variant: BadgeVariant | string
  children: ReactNode
  icon?: string
  glow?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/20',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20',
  error: 'bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-blue-500/20',
  neutral: 'bg-gray-800 text-gray-300 border-gray-700 shadow-gray-700/20',
  admin: 'bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20',
  artist: 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-purple-500/20',
  gray: 'bg-gray-800 text-gray-300 border-gray-700 shadow-gray-700/20',
}

export default function StatusBadge({ 
  variant, 
  children, 
  icon,
  glow = false 
}: StatusBadgeProps) {
  const style = variantStyles[(variant as BadgeVariant) ?? 'neutral'] || variantStyles.neutral

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold border ${
        style
      } ${glow ? 'shadow-sm' : ''}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}
