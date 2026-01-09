'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Gem, Ticket, Sparkles, Info, AlertCircle, X, Music, Crown, Star, Award, Circle } from 'lucide-react'
import { getRarityDistribution, AURA_ZONE_COSTS } from '@/lib/aura-zone'
import type { BannerData } from './page'

// Accent colors for banner tabs (cycles through)
const BANNER_ACCENT_COLORS = [
  { primary: '#FF1F7D', secondary: '#8B5CF6' },
  { primary: '#00F5FF', secondary: '#8B5CF6' },
  { primary: '#FFC700', secondary: '#FF1F7D' },
  { primary: '#10B981', secondary: '#00F5FF' },
]

// Helper function to get icon for each rarity tier
const getRarityIcon = (rarity: string, className: string = 'h-6 w-6') => {
  switch (rarity) {
    case 'LEGENDARY':
      return <Crown className={className} aria-hidden="true" />
    case 'SSR':
      return <Star className={className} aria-hidden="true" />
    case 'EPIC':
      return <Sparkles className={className} aria-hidden="true" />
    case 'RARE':
      return <Award className={className} aria-hidden="true" />
    case 'COMMON':
      return <Circle className={className} aria-hidden="true" />
    default:
      return <Circle className={className} aria-hidden="true" />
  }
}

interface AuraZoneClientProps {
  diamonds: number
  tickets: number
  userId: string
  userRole: string
  banners: BannerData[]
}

export default function AuraZoneClient({
  diamonds: initialDiamonds,
  tickets: initialTickets,
  banners,
}: AuraZoneClientProps) {
  const [selectedBannerIndex, setSelectedBannerIndex] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'diamonds' | 'tickets'>('diamonds')
  const [isPulling, setIsPulling] = useState(false)
  const [pullResults, setPullResults] = useState<any[]>([])
  const [showProbability, setShowProbability] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [videoError, setVideoError] = useState(false)

  // Local state for balances that can be updated without page reload
  const [diamonds, setDiamonds] = useState(initialDiamonds)
  const [tickets, setTickets] = useState(initialTickets)

  const currentBanner = banners[selectedBannerIndex] || banners[0]
  const currentAccent = BANNER_ACCENT_COLORS[selectedBannerIndex % BANNER_ACCENT_COLORS.length]
  const canAffordWithDiamonds = diamonds >= AURA_ZONE_COSTS.TENX_DIAMONDS
  const canAffordWithTickets = tickets >= AURA_ZONE_COSTS.TENX_TICKETS
  const canAffordEither = canAffordWithDiamonds || canAffordWithTickets

  const rarityDistribution = getRarityDistribution()

  // Reset video error when banner changes
  useEffect(() => {
    setVideoError(false)
  }, [selectedBannerIndex])

  const handlePull = async () => {
    if (!canAffordEither) return

    setIsPulling(true)
    setShowConfirm(false)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/aura-zone/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          bannerId: currentBanner.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to perform pull')
      }

      const data = await response.json()
      setPullResults(data.pulls || [])

      // Update balance from API response instead of reloading
      if (data.newBalance !== undefined) {
        if (paymentMethod === 'diamonds') {
          setDiamonds(data.newBalance)
        } else {
          setTickets(data.newBalance)
        }
      }
    } catch (error) {
      console.error('Pull error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to perform pull')
    } finally {
      setIsPulling(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background with Enhanced Styling */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {!videoError ? (
          <>
            <video
              key={currentBanner.id}
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
              className="h-full w-full object-cover scale-105 animate-[zoom_20s_ease-in-out_infinite]"
            >
              <source src={currentBanner.backgroundVideoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#8B5CF6]/20 via-black to-[#00F5FF]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF1F7D]/10 via-transparent to-transparent" />
          </div>
        )}
      </div>

      <div className="relative z-10 px-4 pt-24 pb-16 md:px-8 md:pt-28 animate-fade-in-up">
        {/* Compact Balance Display - Top Right Corner */}
        <div className="fixed top-20 right-4 md:right-8 z-30 flex gap-3" style={{ animationDelay: '0ms' }}>
          {/* Diamonds Balance - Compact */}
          <div
            className="group relative rounded-2xl border border-[#00F5FF]/40 bg-surface-card/80 backdrop-blur-xl px-4 py-2.5 shadow-lg transition-all duration-300 hover:border-[#00F5FF] hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] focus-within:ring-2 focus-within:ring-[#00F5FF]/50 focus-within:ring-offset-2 focus-within:ring-offset-black"
            role="status"
            aria-label={`${diamonds.toLocaleString()} diamonds available`}
          >
            <div className="flex items-center gap-2.5">
              <Gem className="h-5 w-5 text-[#00F5FF] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#00F5FF]/70 leading-none">Diamonds</p>
                <p className="font-display text-lg font-black tabular-nums text-white leading-none mt-1">
                  {diamonds.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Tickets Balance - Compact */}
          <div
            className="group relative rounded-2xl border border-[#8B5CF6]/40 bg-surface-card/80 backdrop-blur-xl px-4 py-2.5 shadow-lg transition-all duration-300 hover:border-[#8B5CF6] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] focus-within:ring-2 focus-within:ring-[#8B5CF6]/50 focus-within:ring-offset-2 focus-within:ring-offset-black"
            role="status"
            aria-label={`${tickets.toLocaleString()} tickets available`}
          >
            <div className="flex items-center gap-2.5">
              <Ticket className="h-5 w-5 text-[#8B5CF6] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]/70 leading-none">Tickets</p>
                <p className="font-display text-lg font-black tabular-nums text-white leading-none mt-1">
                  {tickets.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Header with Glow Effect */}
        <div className="mb-16 text-center" style={{ animationDelay: '100ms' }}>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF1F7D] via-[#8B5CF6] to-[#00F5FF] mb-4 drop-shadow-[0_0_30px_rgba(255,31,125,0.5)]" style={{ backgroundSize: '200%', animation: 'gradient-shift 3s ease-in-out infinite' }}>
            AURA ZONE
          </h1>
          <p className="text-white/80 text-base md:text-lg font-semibold uppercase tracking-wider">
            Try Your Luck • Win Rare Collectibles & Exclusive Merch
          </p>
        </div>

        {/* Banner Selection - Consolidated Design */}
        <div className="mb-24 max-w-6xl mx-auto px-4" style={{ animationDelay: '200ms' }}>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-black text-white mb-2">Choose Your Banner</h2>
            <p className="text-white/60 text-sm">Each banner features different prize pools and rarities</p>
          </div>

          {/* Banner Cards - Integrated Info */}
          <div className="grid gap-6 sm:grid-cols-2">
            {banners.map((banner, index) => {
              const accent = BANNER_ACCENT_COLORS[index % BANNER_ACCENT_COLORS.length]
              const isActive = selectedBannerIndex === index

              return (
                <button
                  key={banner.id}
                  onClick={() => setSelectedBannerIndex(index)}
                  className={`group relative overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 backdrop-blur-xl ${
                    isActive
                      ? 'scale-[1.02]'
                      : 'hover:scale-[1.01] border-white/10 bg-surface-card/40'
                  }`}
                  style={isActive ? {
                    borderColor: accent.primary,
                    background: `linear-gradient(135deg, ${accent.primary}20, ${accent.secondary}15)`,
                    boxShadow: `0 0 40px -5px ${accent.primary}50, 0 0 20px -3px ${accent.primary}40`,
                  } : undefined}
                  aria-pressed={isActive}
                  aria-label={`${banner.name} banner ${isActive ? 'selected' : ''}`}
                >
                  {/* Selection Indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4">
                      <div
                        className="rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-wider"
                        style={{
                          background: accent.primary,
                          boxShadow: `0 0 15px ${accent.primary}60`
                        }}
                      >
                        Selected
                      </div>
                    </div>
                  )}

                  {/* Banner Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-110"
                      style={isActive ? {
                        background: `${accent.primary}30`,
                        boxShadow: `0 0 15px ${accent.primary}40`
                      } : { background: 'rgba(255,255,255,0.1)' }}
                    >
                      <Music
                        className="h-5 w-5"
                        style={{ color: isActive ? accent.primary : 'rgba(255,255,255,0.6)' }}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-display text-xl font-black leading-tight ${isActive ? 'text-white' : 'text-white/80'}`}>
                        {banner.name}
                      </h3>
                      <p className={`text-sm mt-1 leading-relaxed ${isActive ? 'text-white/70' : 'text-white/50'}`}>
                        {banner.description || 'Exclusive prize collection'}
                      </p>
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      {banner.currencyType === 'DIAMONDS' ? (
                        <Gem className="h-4 w-4 text-[#00F5FF]" aria-hidden="true" />
                      ) : (
                        <Ticket className="h-4 w-4 text-[#8B5CF6]" aria-hidden="true" />
                      )}
                      <span className={`font-display text-sm font-bold ${isActive ? 'text-white' : 'text-white/70'}`}>
                        {banner.costPerPull * 10} {banner.currencyType.toLowerCase()}
                      </span>
                    </div>
                    {banner.currencyType === 'TICKETS' && (
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
                        Ticket Only
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Draw Section - Hero Element */}
        <div className="mb-20 max-w-6xl mx-auto" style={{ animationDelay: '300ms' }}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#FFC700] to-transparent" />
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider">
                Ready To Draw?
              </h2>
              <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#FFC700] to-transparent" />
            </div>
            <p className="text-white/70 text-sm md:text-base mb-3">
              10x Pull • All Rarities Available
            </p>
            <Dialog open={showProbability} onOpenChange={setShowProbability}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl backdrop-blur-md border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 text-white/80 hover:text-white font-semibold focus:ring-2 focus:ring-[#FFC700]/50 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="View probability rates for all rarities"
                >
                  <Info className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Drop Rates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-b from-surface-card to-surface-raised border-white/20">
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl font-black text-white">Prize Probability</DialogTitle>
                  <DialogDescription className="text-white/70 font-medium">
                    Drop rates for all rarity tiers in Aura Zone
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {rarityDistribution.map(({ rarity, probability, config }) => (
                    <div
                      key={rarity}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`rounded-xl p-2.5 ${config.color}`}>
                          {getRarityIcon(rarity, 'h-6 w-6 text-white')}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="font-display font-bold text-white text-lg">{config.name}</div>
                            <div className={`rounded-full border px-3 py-1 font-display text-xs font-bold uppercase tracking-wider ${config.borderColor} ${config.textColor} bg-black/40 backdrop-blur-sm`}>
                              {config.shortName}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl font-black tabular-nums text-white">{probability.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Diamond Draw - Enhanced Hero CTA */}
            <button
              onClick={() => {
                setPaymentMethod('diamonds')
                setShowConfirm(true)
              }}
              disabled={!canAffordWithDiamonds || isPulling}
              className={`group relative overflow-hidden rounded-3xl border-2 p-8 md:p-10 text-center transition-all duration-300 backdrop-blur-xl ${
                !canAffordWithDiamonds
                  ? 'border-white/20 bg-surface-card/40 cursor-not-allowed'
                  : 'border-[#00F5FF]/60 bg-gradient-to-br from-[#00F5FF]/20 to-[#8B5CF6]/10 hover:from-[#00F5FF]/30 hover:to-[#8B5CF6]/20 hover:border-[#00F5FF] hover:shadow-[0_0_60px_rgba(0,245,255,0.6)] hover:scale-[1.03] cursor-pointer focus:ring-4 focus:ring-[#00F5FF]/50 focus:ring-offset-4 focus:ring-offset-black'
              }`}
              aria-label={`Draw 10 times using ${AURA_ZONE_COSTS.TENX_DIAMONDS} diamonds${!canAffordWithDiamonds ? ' - insufficient balance' : ''}`}
              aria-disabled={!canAffordWithDiamonds || isPulling}
            >
              {/* Disabled state overlay */}
              {!canAffordWithDiamonds && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-white/50 mx-auto mb-3" aria-hidden="true" />
                    <p className="font-display text-lg font-bold text-white/70">Need More Diamonds</p>
                    <p className="text-sm text-white/50 mt-1">Complete missions to earn more</p>
                  </div>
                </div>
              )}

              {/* Ambient glow */}
              {canAffordWithDiamonds && (
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#00F5FF]/30 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />
              )}

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-[#8B5CF6]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-5 flex items-center justify-center gap-3">
                  <div className={`rounded-2xl p-3 ring-2 transition-all duration-300 ${canAffordWithDiamonds ? 'bg-[#00F5FF]/20 ring-[#00F5FF]/40 group-hover:scale-110 group-hover:rotate-12' : 'bg-white/5 ring-white/10'}`}>
                    <Gem className={`h-10 w-10 md:h-12 md:w-12 ${canAffordWithDiamonds ? 'text-[#00F5FF]' : 'text-white/30'}`} aria-hidden="true" />
                  </div>
                  <span className={`font-display text-4xl md:text-5xl lg:text-6xl font-black tabular-nums ${canAffordWithDiamonds ? 'text-white' : 'text-white/40'}`}>
                    {AURA_ZONE_COSTS.TENX_DIAMONDS.toLocaleString()}
                  </span>
                </div>
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Sparkles className={`h-6 w-6 transition-transform duration-300 ${canAffordWithDiamonds ? 'text-[#00F5FF] group-hover:rotate-180' : 'text-white/30'}`} aria-hidden="true" />
                  <p className={`font-display text-2xl md:text-3xl font-black uppercase tracking-wider ${canAffordWithDiamonds ? 'text-white' : 'text-white/40'}`}>
                    10x Draw
                  </p>
                </div>
                {canAffordWithDiamonds && (
                  <p className="text-sm text-white/70 font-semibold">
                    {Math.floor(diamonds / AURA_ZONE_COSTS.TENX_DIAMONDS)} pull{Math.floor(diamonds / AURA_ZONE_COSTS.TENX_DIAMONDS) !== 1 ? 's' : ''} available
                  </p>
                )}
              </div>
            </button>

            {/* Ticket Draw - Enhanced Hero CTA */}
            <button
              onClick={() => {
                setPaymentMethod('tickets')
                setShowConfirm(true)
              }}
              disabled={!canAffordWithTickets || isPulling}
              className={`group relative overflow-hidden rounded-3xl border-2 p-8 md:p-10 text-center transition-all duration-300 backdrop-blur-xl ${
                !canAffordWithTickets
                  ? 'border-white/20 bg-surface-card/40 cursor-not-allowed'
                  : 'border-[#8B5CF6]/60 bg-gradient-to-br from-[#8B5CF6]/20 to-[#FF1F7D]/10 hover:from-[#8B5CF6]/30 hover:to-[#FF1F7D]/20 hover:border-[#8B5CF6] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] hover:scale-[1.03] cursor-pointer focus:ring-4 focus:ring-[#8B5CF6]/50 focus:ring-offset-4 focus:ring-offset-black'
              }`}
              aria-label={`Draw 10 times using ${AURA_ZONE_COSTS.TENX_TICKETS} tickets${!canAffordWithTickets ? ' - insufficient balance' : ''}`}
              aria-disabled={!canAffordWithTickets || isPulling}
            >
              {/* Disabled state overlay */}
              {!canAffordWithTickets && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-white/50 mx-auto mb-3" aria-hidden="true" />
                    <p className="font-display text-lg font-bold text-white/70">Need More Tickets</p>
                    <p className="text-sm text-white/50 mt-1">Earn tickets from missions & events</p>
                  </div>
                </div>
              )}

              {/* Ambient glow */}
              {canAffordWithTickets && (
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#8B5CF6]/30 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />
              )}

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-[#FF1F7D]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-5 flex items-center justify-center gap-3">
                  <div className={`rounded-2xl p-3 ring-2 transition-all duration-300 ${canAffordWithTickets ? 'bg-[#8B5CF6]/20 ring-[#8B5CF6]/40 group-hover:scale-110 group-hover:rotate-12' : 'bg-white/5 ring-white/10'}`}>
                    <Ticket className={`h-10 w-10 md:h-12 md:w-12 ${canAffordWithTickets ? 'text-[#8B5CF6]' : 'text-white/30'}`} aria-hidden="true" />
                  </div>
                  <span className={`font-display text-4xl md:text-5xl lg:text-6xl font-black tabular-nums ${canAffordWithTickets ? 'text-white' : 'text-white/40'}`}>
                    {AURA_ZONE_COSTS.TENX_TICKETS.toLocaleString()}
                  </span>
                </div>
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Sparkles className={`h-6 w-6 transition-transform duration-300 ${canAffordWithTickets ? 'text-[#8B5CF6] group-hover:rotate-180' : 'text-white/30'}`} aria-hidden="true" />
                  <p className={`font-display text-2xl md:text-3xl font-black uppercase tracking-wider ${canAffordWithTickets ? 'text-white' : 'text-white/40'}`}>
                    10x Draw
                  </p>
                </div>
                {canAffordWithTickets && (
                  <p className="text-sm text-white/70 font-semibold">
                    {Math.floor(tickets / AURA_ZONE_COSTS.TENX_TICKETS)} pull{Math.floor(tickets / AURA_ZONE_COSTS.TENX_TICKETS) !== 1 ? 's' : ''} available
                  </p>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Confirmation Dialog */}
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent className="backdrop-blur-xl bg-gradient-to-b from-surface-card to-surface-raised border-2 border-white/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-3xl font-black text-white">Confirm 10x Draw</AlertDialogTitle>
              <AlertDialogDescription className="text-white/70 text-base font-medium pt-2">
                This will cost{' '}
                <span className={`font-display font-black text-transparent bg-clip-text ${paymentMethod === 'diamonds' ? 'bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6]' : 'bg-gradient-to-r from-[#8B5CF6] to-[#FF1F7D]'}`}>
                  {paymentMethod === 'diamonds'
                    ? `${AURA_ZONE_COSTS.TENX_DIAMONDS.toLocaleString()} Diamonds`
                    : `${AURA_ZONE_COSTS.TENX_TICKETS.toLocaleString()} Tickets`}
                </span>
                . This action is <span className="text-[#FF1F7D] font-black">NON-REFUNDABLE</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl hover:scale-105 transition-transform duration-300 font-semibold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handlePull}
                disabled={isPulling}
                className="rounded-xl bg-gradient-to-r from-[#FF1F7D] to-[#8B5CF6] hover:from-[#FF1F7D]/90 hover:to-[#8B5CF6]/90 hover:scale-105 hover:shadow-lg hover:shadow-[#FF1F7D]/50 transition-all duration-300 font-display font-bold"
              >
                {isPulling ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Drawing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Confirm Draw
                  </span>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Enhanced Error Dialog */}
        <Dialog open={!!errorMessage} onOpenChange={(open) => !open && setErrorMessage(null)}>
          <DialogContent className="backdrop-blur-xl bg-gradient-to-b from-surface-card to-surface-raised border-2 border-[#FF1F7D]/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-[#FF1F7D] font-display text-2xl font-black">
                <AlertCircle className="h-7 w-7" />
                Error
              </DialogTitle>
              <DialogDescription className="pt-4 text-base text-white/70 font-medium">
                {errorMessage}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setErrorMessage(null)}
                className="rounded-xl hover:scale-105 transition-transform duration-300 font-semibold"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Results Display */}
        {pullResults.length > 0 && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-gradient-to-b from-surface-card to-surface-raised border-2 border-[#FFC700]/50 rounded-3xl p-8 md:p-12 max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-[#FFC700]/20">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFC700] via-[#FF1F7D] to-[#8B5CF6] flex items-center gap-4">
                  <div className="rounded-2xl bg-[#FFC700]/20 p-3 ring-2 ring-[#FFC700]/50">
                    <Sparkles className="h-10 w-10 text-[#FFC700] animate-pulse" />
                  </div>
                  Draw Results
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setPullResults([])}
                  className="rounded-xl text-white hover:bg-white/10 hover:scale-110 hover:rotate-90 transition-all duration-300"
                  size="icon"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                {pullResults.map((pull, index) => {
                  const config = rarityDistribution.find((r) => r.rarity === pull.rarity)?.config
                  return (
                    <div
                      key={`${pull.prizeId}-${index}`}
                      className={`group relative rounded-2xl p-6 border-2 text-center backdrop-blur-sm ${pull.rarityBorder} ${pull.rarityColor} transform hover:scale-110 transition-all duration-300 hover:shadow-2xl animate-in zoom-in`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationDuration: '500ms'
                      }}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">{config?.emoji || '🎁'}</div>
                        <Badge
                          className={`mb-3 ${pull.rarityColor} border-0 text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg`}
                        >
                          {pull.rarityDisplay}
                        </Badge>
                        <p className="font-display font-bold text-white text-sm leading-tight">{pull.prizeName}</p>
                        {pull.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={pull.imageUrl}
                            alt={pull.prizeName}
                            className="mt-4 w-full h-24 object-cover rounded-xl shadow-lg ring-2 ring-white/20"
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes zoom {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
