import { cn } from '@/lib/utils'

export type ActivityTimelineItem = {
  id: string
  title: string
  description: string
  timestamp: string
  tone?: 'hot' | 'cool' | 'gold'
  pill?: string
  meta?: string
  value?: string
}

const toneConfig: Record<'hot' | 'cool' | 'gold', { dot: string; glow: string; pill: string; cardHover: string }> = {
  hot: {
    dot: 'bg-[#FF1F7D] ring-[#FF1F7D]/40',
    glow: 'shadow-[0_0_12px_rgba(255,31,125,0.6)]',
    pill: 'bg-[#FF1F7D]/20 text-[#FF1F7D] ring-1 ring-[#FF1F7D]/40',
    cardHover: 'hover:border-[#FF1F7D]/30 hover:shadow-[0_0_24px_rgba(255,31,125,0.2)]',
  },
  cool: {
    dot: 'bg-[#8B5CF6] ring-[#8B5CF6]/40',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.6)]',
    pill: 'bg-[#8B5CF6]/20 text-[#8B5CF6] ring-1 ring-[#8B5CF6]/40',
    cardHover: 'hover:border-[#8B5CF6]/30 hover:shadow-[0_0_24px_rgba(139,92,246,0.2)]',
  },
  gold: {
    dot: 'bg-[#FFC700] ring-[#FFC700]/40',
    glow: 'shadow-[0_0_12px_rgba(255,199,0,0.6)]',
    pill: 'bg-[#FFC700]/20 text-[#FFC700] ring-1 ring-[#FFC700]/40',
    cardHover: 'hover:border-[#FFC700]/30 hover:shadow-[0_0_24px_rgba(255,199,0,0.2)]',
  },
}

interface ActivityTimelineProps {
  items: ActivityTimelineItem[]
  emptyState?: React.ReactNode
}

export function ActivityTimeline({ items, emptyState }: ActivityTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surface-card/50 p-8 text-center text-white/50 backdrop-blur-xl">
        {emptyState}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl">
      {/* Top gradient line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF1F7D]/50 via-[#8B5CF6]/50 to-transparent" />

      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#8B5CF6]/10 to-transparent blur-3xl" />

      <div className="relative pl-8">
        <div className="space-y-5">
          {items.map((item, index) => {
            const config = item.tone ? toneConfig[item.tone] : null

            return (
              <div
                key={item.id}
                className={cn(
                  'animate-enter relative pl-8',
                  index === 0 && 'animation-delay-100',
                  index === 1 && 'animation-delay-200',
                  index === 2 && 'animation-delay-300',
                  index === 3 && 'animation-delay-400',
                  index >= 4 && 'animation-delay-500',
                )}
              >
                {/* Timeline dot with pulsing animation */}
                <span
                  className={cn(
                    'absolute left-0 top-[18px] flex h-4 w-4 items-center justify-center rounded-full ring-2 transition-all duration-300',
                    config ? config.dot : 'bg-white/30 ring-white/20',
                    config && config.glow,
                  )}
                >
                  <span className={cn(
                    'h-2 w-2 rounded-full bg-white transition-all duration-300',
                    index === 0 && 'animate-pulse'
                  )} />
                </span>

                {/* Activity Card */}
                <div
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5',
                    'transition-all duration-300',
                    'hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.08]',
                    config && config.cardHover,
                  )}
                >
                  {/* Card gradient overlay on hover */}
                  <div className={cn(
                    'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                    item.tone === 'hot' && 'bg-gradient-to-br from-[#FF1F7D]/10 via-transparent to-transparent',
                    item.tone === 'cool' && 'bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-transparent',
                    item.tone === 'gold' && 'bg-gradient-to-br from-[#FFC700]/10 via-transparent to-transparent',
                  )} />

                  <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="font-display text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-white/50">{item.description}</p>
                    </div>
                    {item.value && (
                      <div className={cn(
                        'rounded-xl px-3 py-1.5 font-display text-base font-black tabular-nums transition-all duration-300',
                        item.tone === 'hot' && 'bg-[#FF1F7D]/10 text-[#FF1F7D] ring-1 ring-[#FF1F7D]/20',
                        item.tone === 'cool' && 'bg-[#8B5CF6]/10 text-[#8B5CF6] ring-1 ring-[#8B5CF6]/20',
                        item.tone === 'gold' && 'bg-[#FFC700]/10 text-[#FFC700] ring-1 ring-[#FFC700]/20',
                        !item.tone && 'bg-white/10 text-white ring-1 ring-white/20',
                      )}>
                        {item.value}
                      </div>
                    )}
                  </div>

                  {/* Footer metadata */}
                  <div className="relative mt-4 flex flex-wrap items-center gap-2.5 text-xs">
                    {item.pill && (
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 font-bold uppercase tracking-wider backdrop-blur-sm transition-all duration-300',
                          config ? config.pill : 'bg-white/10 text-white/70 ring-1 ring-white/20',
                        )}
                      >
                        {item.pill}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-white/40">
                      <span className="h-1 w-1 rounded-full bg-white/40" />
                      {item.timestamp}
                    </span>
                    {item.meta && (
                      <span className="flex items-center gap-1.5 text-white/40">
                        <span className="h-1 w-1 rounded-full bg-white/40" />
                        {item.meta}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
