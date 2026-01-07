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
import { Gem, Ticket, Sparkles, Info, AlertCircle, X } from 'lucide-react'
import { BANNER_TYPES, getRarityDistribution, AURA_ZONE_COSTS, type BannerType } from '@/lib/aura-zone'

interface AuraZoneClientProps {
  diamonds: number
  tickets: number
  userId: string
  userRole: string
}

export default function AuraZoneClient({
  diamonds: initialDiamonds,
  tickets: initialTickets,
}: AuraZoneClientProps) {
  const [selectedBanner, setSelectedBanner] = useState<BannerType>('beat-like-dat')
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

  const currentBanner = BANNER_TYPES[selectedBanner]
  const canAffordWithDiamonds = diamonds >= AURA_ZONE_COSTS.TENX_DIAMONDS
  const canAffordWithTickets = tickets >= AURA_ZONE_COSTS.TENX_TICKETS
  const canAffordEither = canAffordWithDiamonds || canAffordWithTickets

  const rarityDistribution = getRarityDistribution()

  // Reset video error when banner changes
  useEffect(() => {
    setVideoError(false)
  }, [selectedBanner])

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
          bannerId: selectedBanner,
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
              key={selectedBanner}
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
              className="h-full w-full object-cover scale-105 animate-[zoom_20s_ease-in-out_infinite]"
            >
              <source src={currentBanner.backgroundVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#8B5CF6]/20 via-black to-[#00F5FF]/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF1F7D]/10 via-transparent to-transparent" />
          </div>
        )}
      </div>

      <div className="relative z-10 px-4 pt-28 pb-16 md:px-8 md:pt-32 animate-fade-in-up">
        {/* Enhanced Header with Glow Effect */}
        <div className="mb-12 text-center" style={{ animationDelay: '0ms' }}>
          <h1 className="font-display text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF1F7D] via-[#8B5CF6] to-[#00F5FF] mb-4 drop-shadow-[0_0_30px_rgba(255,31,125,0.5)]" style={{ backgroundSize: '200%', animation: 'gradient-shift 3s ease-in-out infinite' }}>
            AURA ZONE
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-semibold uppercase tracking-wider">
            Draw exclusive prizes • Unlock legendary rewards
          </p>
        </div>

        {/* Enhanced Balance Display - Missions Style */}
        <div className="mb-12 flex justify-center gap-6 flex-wrap" style={{ animationDelay: '100ms' }}>
          {/* Diamonds Balance */}
          <div className="group relative overflow-hidden rounded-3xl border border-[#00F5FF]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#00F5FF]/60 hover:shadow-[0_0_40px_rgba(0,245,255,0.4)]">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

            {/* Hover overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex items-center gap-4">
              <div className="rounded-xl bg-[#00F5FF]/20 p-3 ring-1 ring-[#00F5FF]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Gem className="h-8 w-8 text-[#00F5FF]" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#00F5FF]">Diamonds</p>
                <p className="font-display text-3xl font-black tabular-nums text-white">
                  {diamonds.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Tickets Balance */}
          <div className="group relative overflow-hidden rounded-3xl border border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

            {/* Hover overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex items-center gap-4">
              <div className="rounded-xl bg-[#8B5CF6]/20 p-3 ring-1 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Ticket className="h-8 w-8 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#8B5CF6]">Tickets</p>
                <p className="font-display text-3xl font-black tabular-nums text-white">
                  {tickets.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Banner Selection */}
        <div className="mb-20 max-w-5xl mx-auto" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#FF1F7D] to-transparent" />
            <h2 className="font-display text-3xl md:text-4xl font-black text-white uppercase tracking-wider">Select Song</h2>
            <div className="h-px w-20 bg-gradient-to-l from-transparent via-[#FF1F7D] to-transparent" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Beat Like Dat Banner */}
            <button
              onClick={() => setSelectedBanner('beat-like-dat')}
              className={`group relative overflow-hidden rounded-3xl border-2 p-8 transition-all duration-500 backdrop-blur-xl ${
                selectedBanner === 'beat-like-dat'
                  ? 'border-[#FF1F7D] bg-gradient-to-br from-[#FF1F7D]/30 to-[#8B5CF6]/20 shadow-[0_0_50px_rgba(255,31,125,0.5)] scale-[1.03]'
                  : 'border-white/10 bg-surface-card/50 hover:border-[#FF1F7D]/50 hover:bg-[#FF1F7D]/10 hover:scale-[1.02]'
              }`}
            >
              {/* Ambient glow */}
              <div className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF1F7D]/30 to-transparent blur-3xl transition-all duration-700 ${selectedBanner === 'beat-like-dat' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF1F7D]/10 via-transparent to-[#8B5CF6]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-2xl md:text-3xl font-black text-white">Beat Like Dat</h3>
                  {selectedBanner === 'beat-like-dat' && (
                    <Badge className="bg-[#FF1F7D] text-white border-0 font-display font-bold uppercase tracking-wider shadow-lg shadow-[#FF1F7D]/50">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-medium">
                  {BANNER_TYPES['beat-like-dat'].description}
                </p>
              </div>
            </button>

            {/* SYBAU Banner */}
            <button
              onClick={() => setSelectedBanner('sybau')}
              className={`group relative overflow-hidden rounded-3xl border-2 p-8 transition-all duration-500 backdrop-blur-xl ${
                selectedBanner === 'sybau'
                  ? 'border-[#00F5FF] bg-gradient-to-br from-[#00F5FF]/30 to-[#8B5CF6]/20 shadow-[0_0_50px_rgba(0,245,255,0.5)] scale-[1.03]'
                  : 'border-white/10 bg-surface-card/50 hover:border-[#00F5FF]/50 hover:bg-[#00F5FF]/10 hover:scale-[1.02]'
              }`}
            >
              {/* Ambient glow */}
              <div className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#00F5FF]/30 to-transparent blur-3xl transition-all duration-700 ${selectedBanner === 'sybau' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-[#8B5CF6]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-2xl md:text-3xl font-black text-white">SYBAU</h3>
                  {selectedBanner === 'sybau' && (
                    <Badge className="bg-[#00F5FF] text-white border-0 font-display font-bold uppercase tracking-wider shadow-lg shadow-[#00F5FF]/50">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-medium">
                  {BANNER_TYPES.sybau.description}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Draw Options */}
        <div className="mb-20 max-w-5xl mx-auto" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#FFC700] to-transparent" />
            <h2 className="font-display text-3xl md:text-4xl font-black text-white uppercase tracking-wider">Select Draw</h2>
            <div className="h-px w-20 bg-gradient-to-l from-transparent via-[#FFC700] to-transparent" />
          </div>
          <div className="text-center mb-8">
            <p className="text-white/70 text-base md:text-lg mb-4 font-bold uppercase tracking-wider">
              10x Draw Only • No SSR Guarantee • Pure Luck!
            </p>
            <Dialog open={showProbability} onOpenChange={setShowProbability}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 text-white font-semibold"
                >
                  <Info className="mr-2 h-4 w-4" />
                  View Probability
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
                        <span className="text-4xl">{config.emoji}</span>
                        <div>
                          <div className="font-display font-bold text-white text-lg">{config.name}</div>
                          <div className="text-sm text-white/60 font-medium">{config.shortName}</div>
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

          <div className="grid gap-8 sm:grid-cols-2">
            {/* Enhanced Diamond Draw */}
            <button
              onClick={() => {
                setPaymentMethod('diamonds')
                setShowConfirm(true)
              }}
              disabled={!canAffordWithDiamonds || isPulling}
              className={`group relative overflow-hidden rounded-3xl border-2 p-12 text-center transition-all duration-500 backdrop-blur-xl ${
                !canAffordWithDiamonds
                  ? 'border-white/10 bg-surface-card/30 opacity-50 cursor-not-allowed'
                  : 'border-[#00F5FF]/50 bg-gradient-to-br from-[#00F5FF]/20 to-[#8B5CF6]/10 hover:from-[#00F5FF]/30 hover:to-[#8B5CF6]/20 hover:border-[#00F5FF] hover:shadow-[0_0_50px_rgba(0,245,255,0.5)] hover:scale-[1.05] cursor-pointer'
              }`}
            >
              {/* Ambient glow */}
              <div className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#00F5FF]/30 to-transparent blur-3xl transition-all duration-700 ${!canAffordWithDiamonds ? 'opacity-0' : 'group-hover:scale-150'}`} />

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-[#8B5CF6]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-center gap-4">
                  <div className="rounded-2xl bg-[#00F5FF]/20 p-4 ring-2 ring-[#00F5FF]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Gem className="h-12 w-12 text-[#00F5FF]" />
                  </div>
                  <span className="font-display text-5xl md:text-6xl font-black text-white tabular-nums">
                    {AURA_ZONE_COSTS.TENX_DIAMONDS.toLocaleString()}
                  </span>
                </div>
                <div className="mb-6 flex items-center justify-center gap-3">
                  <Sparkles className="h-7 w-7 text-[#00F5FF] transition-transform duration-300 group-hover:rotate-180" />
                  <p className="font-display text-3xl font-black text-white uppercase tracking-wider">10x Diamond Draw</p>
                </div>
                <p className="text-base text-white/70 font-bold uppercase tracking-wider">
                  {canAffordWithDiamonds
                    ? `${Math.floor(diamonds / AURA_ZONE_COSTS.TENX_DIAMONDS)} Draws Available`
                    : 'Insufficient Diamonds'}
                </p>
              </div>
            </button>

            {/* Enhanced Ticket Draw */}
            <button
              onClick={() => {
                setPaymentMethod('tickets')
                setShowConfirm(true)
              }}
              disabled={!canAffordWithTickets || isPulling}
              className={`group relative overflow-hidden rounded-3xl border-2 p-12 text-center transition-all duration-500 backdrop-blur-xl ${
                !canAffordWithTickets
                  ? 'border-white/10 bg-surface-card/30 opacity-50 cursor-not-allowed'
                  : 'border-[#8B5CF6]/50 bg-gradient-to-br from-[#8B5CF6]/20 to-[#FF1F7D]/10 hover:from-[#8B5CF6]/30 hover:to-[#FF1F7D]/20 hover:border-[#8B5CF6] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] hover:scale-[1.05] cursor-pointer'
              }`}
            >
              {/* Ambient glow */}
              <div className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#8B5CF6]/30 to-transparent blur-3xl transition-all duration-700 ${!canAffordWithTickets ? 'opacity-0' : 'group-hover:scale-150'}`} />

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-[#FF1F7D]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-center gap-4">
                  <div className="rounded-2xl bg-[#8B5CF6]/20 p-4 ring-2 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Ticket className="h-12 w-12 text-[#8B5CF6]" />
                  </div>
                  <span className="font-display text-5xl md:text-6xl font-black text-white tabular-nums">
                    {AURA_ZONE_COSTS.TENX_TICKETS.toLocaleString()}
                  </span>
                </div>
                <div className="mb-6 flex items-center justify-center gap-3">
                  <Sparkles className="h-7 w-7 text-[#8B5CF6] transition-transform duration-300 group-hover:rotate-180" />
                  <p className="font-display text-3xl font-black text-white uppercase tracking-wider">10x Ticket Draw</p>
                </div>
                <p className="text-base text-white/70 font-bold uppercase tracking-wider">
                  {canAffordWithTickets
                    ? `${Math.floor(tickets / AURA_ZONE_COSTS.TENX_TICKETS)} Draws Available`
                    : 'Insufficient Tickets'}
                </p>
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
