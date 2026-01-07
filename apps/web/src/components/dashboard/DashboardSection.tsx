import { cn } from '@/lib/utils'

interface DashboardSectionProps {
  children: React.ReactNode
  className?: string
  bleed?: boolean
}

/**
 * Consistent wrapper for dashboard content blocks so every page
 * keeps the same max width, spacing, and responsive padding.
 */
export function DashboardSection({ children, className, bleed = false }: DashboardSectionProps) {
  return (
    <section
      className={cn(
        'relative w-full py-10',
        bleed ? 'px-0' : 'px-4 sm:px-6 lg:px-8',
        className,
      )}
    >
      <div className={cn('mx-auto w-full max-w-6xl', bleed && 'max-w-none')}>{children}</div>
    </section>
  )
}
