import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

type Tone = 'hot' | 'cool' | 'gold'

const toneConfig: Record<Tone, { card: string; iconBg: string; badge: string }> = {
  hot: {
    card: 'border-[#FF6A3A]/25 bg-gradient-to-r from-[#FF6A3A]/10 to-transparent hover:border-[#FF6A3A]/50 hover:from-[#FF6A3A]/15',
    iconBg: 'bg-[#FF6A3A]/15 ring-1 ring-[#FF6A3A]/30 group-hover:ring-[#FF6A3A]/50 group-hover:bg-[#FF6A3A]/20',
    badge: 'bg-[#FF6A3A]/20 text-[#FF6A3A] ring-1 ring-[#FF6A3A]/30',
  },
  cool: {
    card: 'border-[#7C4DFF]/25 bg-gradient-to-r from-[#7C4DFF]/10 to-transparent hover:border-[#7C4DFF]/50 hover:from-[#7C4DFF]/15',
    iconBg: 'bg-[#7C4DFF]/15 ring-1 ring-[#7C4DFF]/30 group-hover:ring-[#7C4DFF]/50 group-hover:bg-[#7C4DFF]/20',
    badge: 'bg-[#7C4DFF]/20 text-[#7C4DFF] ring-1 ring-[#7C4DFF]/30',
  },
  gold: {
    card: 'border-[#FFD966]/25 bg-gradient-to-r from-[#FFD966]/10 to-transparent hover:border-[#FFD966]/50 hover:from-[#FFD966]/15',
    iconBg: 'bg-[#FFD966]/15 ring-1 ring-[#FFD966]/30 group-hover:ring-[#FFD966]/50 group-hover:bg-[#FFD966]/20',
    badge: 'bg-[#FFD966]/20 text-[#FFD966] ring-1 ring-[#FFD966]/30',
  },
}

interface QuickActionCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  tone?: Tone
  badge?: string
}

export function QuickActionCard({
  title,
  description,
  href,
  icon,
  tone = 'cool',
  badge,
}: QuickActionCardProps) {
  const config = toneConfig[tone]

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex items-center gap-4 rounded-xl border px-4 py-3.5',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-0.5',
        'shadow-[0_2px_8px_rgba(0,0,0,0.15)]',
        'hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]',
        config.card,
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          'transition-all duration-300',
          config.iconBg,
        )}
      >
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white transition-colors group-hover:text-white">
            {title}
          </p>
          {badge && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                config.badge,
              )}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-white/50 transition-colors group-hover:text-white/60">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight
        className={cn(
          'h-4 w-4 shrink-0 text-white/30',
          'transition-all duration-300',
          'group-hover:translate-x-0.5 group-hover:text-white/60',
        )}
      />
    </Link>
  )
}
