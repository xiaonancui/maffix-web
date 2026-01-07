import { cn } from '@/lib/utils'

type Tone = 'hot' | 'cool' | 'gold' | 'neutral'

const toneConfig: Record<Tone, { gradient: string; border: string; iconBg: string; glow: string }> = {
  hot: {
    gradient: 'from-[#FF6A3A]/15 via-[#FF6A3A]/5 to-transparent',
    border: 'border-[#FF6A3A]/20 hover:border-[#FF6A3A]/40',
    iconBg: 'bg-[#FF6A3A]/10 ring-1 ring-[#FF6A3A]/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(255,106,58,0.15)]',
  },
  cool: {
    gradient: 'from-[#7C4DFF]/15 via-[#7C4DFF]/5 to-transparent',
    border: 'border-[#7C4DFF]/20 hover:border-[#7C4DFF]/40',
    iconBg: 'bg-[#7C4DFF]/10 ring-1 ring-[#7C4DFF]/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(124,77,255,0.15)]',
  },
  gold: {
    gradient: 'from-[#FFD966]/15 via-[#FFD966]/5 to-transparent',
    border: 'border-[#FFD966]/20 hover:border-[#FFD966]/40',
    iconBg: 'bg-[#FFD966]/10 ring-1 ring-[#FFD966]/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(255,217,102,0.12)]',
  },
  neutral: {
    gradient: 'from-white/5 via-white/[0.02] to-transparent',
    border: 'border-white/10 hover:border-white/20',
    iconBg: 'bg-white/5 ring-1 ring-white/10',
    glow: '',
  },
}

interface StatCardProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  value: React.ReactNode
  helper?: React.ReactNode
  tone?: Tone
  className?: string
  footer?: React.ReactNode
  children?: React.ReactNode
  trendText?: string
}

export function StatCard({
  title,
  subtitle,
  icon,
  value,
  helper,
  tone = 'neutral',
  className,
  footer,
  children,
  trendText,
}: StatCardProps) {
  const config = toneConfig[tone]

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-surface-card/90 p-5 backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-0.5',
        'shadow-[0_4px_24px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.2)]',
        'hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.2)]',
        config.border,
        config.glow,
        className,
      )}
    >
      {/* Gradient overlay */}
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60', config.gradient)} />

      {/* Subtle top shine */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-white/40">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
              config.iconBg
            )}>
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-3xl font-bold tracking-tight text-white">
              {value}
            </div>
            {trendText && (
              <p className="text-[11px] text-white/40">{trendText}</p>
            )}
          </div>
          {helper && (
            <div className="text-right text-xs text-white/50">{helper}</div>
          )}
        </div>

        {/* Children (progress bars, etc.) */}
        {children && <div className="mt-1">{children}</div>}
      </div>

      {/* Footer */}
      {footer && (
        <div className="relative mt-4 border-t border-white/5 pt-3 text-[11px] text-white/40">
          {footer}
        </div>
      )}
    </div>
  )
}
