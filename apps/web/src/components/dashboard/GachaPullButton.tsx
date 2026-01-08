'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Gem, Ticket, Sparkles, Loader2 } from 'lucide-react'
import { AURA_ZONE_COSTS } from '@/lib/aura-zone'

interface GachaPullButtonProps {
  /** Payment method for this button (new API) */
  paymentMethod?: 'diamonds' | 'tickets'
  /** Current user balance for this currency */
  currentBalance: number
  /** Whether a pull is currently in progress (new API) */
  isPulling?: boolean
  /** Callback when button is clicked (new API) */
  onPull?: (paymentMethod: 'diamonds' | 'tickets') => void
  /** Optional custom cost (defaults to AURA_ZONE_COSTS) */
  cost?: number
  /** Show compact version */
  compact?: boolean
  /** @deprecated Legacy prop for old gacha page - use paymentMethod and onPull instead */
  pullType?: 'single' | '10x'
}

/**
 * 10x Gacha Pull Button Component
 *
 * Renders a stylized button for 10x gacha pulls with either diamonds or tickets.
 * Supports disabled state when user can't afford the pull.
 * Also supports legacy mode for the old gacha page.
 */
export default function GachaPullButton({
  paymentMethod = 'diamonds',
  currentBalance,
  isPulling: externalIsPulling,
  onPull,
  cost,
  compact = false,
  pullType,
}: GachaPullButtonProps) {
  const router = useRouter()

  // Legacy mode: internal state when onPull is not provided
  const [internalIsPulling, setInternalIsPulling] = useState(false)
  const isLegacyMode = !onPull && pullType !== undefined
  const isPulling = externalIsPulling ?? internalIsPulling

  const isDiamond = paymentMethod === 'diamonds'
  const pullCost = cost ?? (isDiamond ? AURA_ZONE_COSTS.TENX_DIAMONDS : AURA_ZONE_COSTS.TENX_TICKETS)
  const canAfford = currentBalance >= pullCost
  const drawsAvailable = Math.floor(currentBalance / pullCost)

  // Legacy pull handler for old gacha page
  const handleLegacyPull = async () => {
    if (!canAfford || isPulling) return

    setInternalIsPulling(true)
    try {
      const response = await fetch('/api/gacha/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pullType }),
      })

      if (!response.ok) {
        throw new Error('Pull failed')
      }

      // Refresh the page to show updated balance and results
      router.refresh()
    } catch (error) {
      console.error('Gacha pull error:', error)
    } finally {
      setInternalIsPulling(false)
    }
  }

  // Click handler - use new API or legacy mode
  const handleClick = () => {
    if (isLegacyMode) {
      handleLegacyPull()
    } else if (onPull) {
      onPull(paymentMethod)
    }
  }

  // Color schemes
  const colors = isDiamond
    ? {
        primary: '#00F5FF',
        secondary: '#8B5CF6',
        icon: Gem,
      }
    : {
        primary: '#8B5CF6',
        secondary: '#FF1F7D',
        icon: Ticket,
      }

  const Icon = colors.icon

  // Legacy mode: simple button for old gacha page
  if (isLegacyMode) {
    return (
      <button
        onClick={handleClick}
        disabled={!canAfford || isPulling}
        className={`w-full rounded-lg px-6 py-3 font-display font-bold transition-all duration-300 ${
          !canAfford || isPulling
            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]'
        }`}
      >
        {isPulling ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Drawing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5" />
            Draw {pullType === '10x' ? '10x' : ''}
          </span>
        )}
      </button>
    )
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={!canAfford || isPulling}
        className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border-2 px-6 py-4 font-display font-bold transition-all duration-500 ${
          !canAfford || isPulling
            ? 'border-white/10 bg-surface-card/30 opacity-50 cursor-not-allowed'
            : 'hover:scale-[1.03] cursor-pointer'
        }`}
        style={
          canAfford && !isPulling
            ? {
                borderColor: `${colors.primary}60`,
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}15)`,
              }
            : undefined
        }
      >
        {isPulling ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-white" />
            <span className="text-white">Drawing...</span>
          </>
        ) : (
          <>
            <Icon className="h-5 w-5" style={{ color: colors.primary }} />
            <span className="text-white">
              10x Draw ({pullCost.toLocaleString()})
            </span>
          </>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={!canAfford || isPulling}
      className={`group relative overflow-hidden rounded-3xl border-2 p-12 text-center transition-all duration-500 backdrop-blur-xl ${
        !canAfford || isPulling
          ? 'border-white/10 bg-surface-card/30 opacity-50 cursor-not-allowed'
          : 'hover:scale-[1.05] cursor-pointer'
      }`}
      style={
        canAfford && !isPulling
          ? {
              borderColor: `${colors.primary}80`,
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}15)`,
              boxShadow: `0 0 30px ${colors.primary}30`,
            }
          : undefined
      }
    >
      {/* Ambient glow */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl transition-all duration-700 ${
          !canAfford || isPulling ? 'opacity-0' : 'group-hover:scale-150'
        }`}
        style={{ background: `linear-gradient(135deg, ${colors.primary}40, transparent)` }}
      />

      {/* Hover overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}15, transparent, ${colors.secondary}15)`,
        }}
      />

      <div className="relative">
        {isPulling ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2
              className="h-16 w-16 animate-spin"
              style={{ color: colors.primary }}
            />
            <p className="font-display text-2xl font-black text-white uppercase tracking-wider">
              Drawing...
            </p>
          </div>
        ) : (
          <>
            {/* Cost display */}
            <div className="mb-6 flex items-center justify-center gap-4">
              <div
                className="rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  boxShadow: `0 0 0 2px ${colors.primary}50`,
                }}
              >
                <Icon className="h-12 w-12" style={{ color: colors.primary }} />
              </div>
              <span className="font-display text-5xl md:text-6xl font-black text-white tabular-nums">
                {pullCost.toLocaleString()}
              </span>
            </div>

            {/* Title */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <Sparkles
                className="h-7 w-7 transition-transform duration-300 group-hover:rotate-180"
                style={{ color: colors.primary }}
              />
              <p className="font-display text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                10x {isDiamond ? 'Diamond' : 'Ticket'} Draw
              </p>
            </div>

            {/* Availability */}
            <p className="text-base text-white/70 font-bold uppercase tracking-wider">
              {canAfford
                ? `${drawsAvailable} Draw${drawsAvailable !== 1 ? 's' : ''} Available`
                : `Insufficient ${isDiamond ? 'Diamonds' : 'Tickets'}`}
            </p>
          </>
        )}
      </div>
    </button>
  )
}

/**
 * Dual Pull Buttons Component
 *
 * Renders both diamond and ticket 10x pull buttons side by side.
 */
export function GachaPullButtons({
  diamonds,
  tickets,
  isPulling,
  onPull,
}: {
  diamonds: number
  tickets: number
  isPulling: boolean
  onPull: (paymentMethod: 'diamonds' | 'tickets') => void
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <GachaPullButton
        paymentMethod="diamonds"
        currentBalance={diamonds}
        isPulling={isPulling}
        onPull={onPull}
      />
      <GachaPullButton
        paymentMethod="tickets"
        currentBalance={tickets}
        isPulling={isPulling}
        onPull={onPull}
      />
    </div>
  )
}
