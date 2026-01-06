'use client'

import { useState } from 'react'
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
import { Gem, Ticket, Sparkles, Info } from 'lucide-react'
import { BANNER_TYPES, getRarityDistribution, AURA_ZONE_COSTS, type BannerType } from '@/lib/aura-zone'

interface AuraZoneClientProps {
  diamonds: number
  tickets: number // Changed from points to tickets
  userId: string
  userRole: string
}

const TENX_DIAMOND_COST = AURA_ZONE_COSTS.TENX_DIAMONDS
const TENX_TICKET_COST = AURA_ZONE_COSTS.TENX_TICKETS

export default function AuraZoneClient({
  diamonds,
  tickets, // Changed from points
}: AuraZoneClientProps) {
  const [selectedBanner, setSelectedBanner] = useState<BannerType>('beat-like-dat')
  const [showConfirm, setShowConfirm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'diamonds' | 'tickets'>('diamonds')
  const [isPulling, setIsPulling] = useState(false)
  const [pullResults, setPullResults] = useState<any[]>([])
  const [showProbability, setShowProbability] = useState(false)

  const currentBanner = BANNER_TYPES[selectedBanner]
  const canAffordWithDiamonds = diamonds >= TENX_DIAMOND_COST
  const canAffordWithTickets = tickets >= TENX_TICKET_COST
  const canAffordEither = canAffordWithDiamonds || canAffordWithTickets

  const rarityDistribution = getRarityDistribution()

  const handlePull = async () => {
    if (!canAffordEither) return

    setIsPulling(true)
    setShowConfirm(false)

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

      // Refresh page to update balance
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (error) {
      console.error('Pull error:', error)
      alert(error instanceof Error ? error.message : 'Failed to perform pull')
    } finally {
      setIsPulling(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <video
          key={selectedBanner} // Force remount on banner change
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={currentBanner.backgroundVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" /> {/* Overlay for readability */}
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* User Balance Display */}
        <div className="mb-6 flex justify-center gap-6">
          <div className="flex items-center gap-2 rounded-lg bg-black/40 px-4 py-2 backdrop-blur-sm">
            <Gem className="h-5 w-5 text-blue-400" />
            <span className="font-bold text-white">{diamonds.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-black/40 px-4 py-2 backdrop-blur-sm">
            <Ticket className="h-5 w-5 text-purple-400" />
            <span className="font-bold text-white">{tickets.toLocaleString()}</span>
          </div>
        </div>
        {/* Banner Selection */}
        <div className="mb-8 max-w-4xl mx-auto">
          <h2 className="mb-4 text-2xl font-bold text-white text-center">Select Banner</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setSelectedBanner('beat-like-dat')}
              className={`rounded-lg border-2 p-6 transition-all backdrop-blur-sm ${
                selectedBanner === 'beat-like-dat'
                  ? 'border-pink-500 bg-pink-500/20 ring-2 ring-pink-500/50'
                  : 'border-white/20 bg-black/20 hover:border-pink-500/50'
              }`}
            >
              <h3 className="text-xl font-bold text-white">Beat Like Dat</h3>
              <p className="text-sm text-gray-300 mt-2">
                {BANNER_TYPES['beat-like-dat'].description}
              </p>
            </button>
            <button
              onClick={() => setSelectedBanner('sybau')}
              className={`rounded-lg border-2 p-6 transition-all backdrop-blur-sm ${
                selectedBanner === 'sybau'
                  ? 'border-cyan-500 bg-cyan-500/20 ring-2 ring-cyan-500/50'
                  : 'border-white/20 bg-black/20 hover:border-cyan-500/50'
              }`}
            >
              <h3 className="text-xl font-bold text-white">SYBAU</h3>
              <p className="text-sm text-gray-300 mt-2">{BANNER_TYPES.sybau.description}</p>
            </button>
          </div>
        </div>

        {/* Draw Options */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-white">Choose Your Payment Method</h2>
            <p className="text-sm text-gray-300 mb-4">
              10x Draw Only • No SSR Guarantee • Pure Luck!
            </p>
            <Dialog open={showProbability} onOpenChange={setShowProbability}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="backdrop-blur-sm">
                  <Info className="mr-2 h-4 w-4" />
                  View Probability
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Prize Probability</DialogTitle>
                  <DialogDescription>
                    Drop rates for all rarity tiers in Aura Zone
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  {rarityDistribution.map(({ rarity, probability, config }) => (
                    <div
                      key={rarity}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.emoji}</span>
                        <div>
                          <div className="font-bold">{config.name}</div>
                          <div className="text-sm text-muted-foreground">{config.shortName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{probability.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Diamond Draw */}
            <button
              onClick={() => {
                setPaymentMethod('diamonds')
                setShowConfirm(true)
              }}
              disabled={!canAffordWithDiamonds || isPulling}
              className={`relative rounded-lg border-2 p-8 text-center transition-all backdrop-blur-sm ${
                !canAffordWithDiamonds
                  ? 'border-white/10 bg-black/20 opacity-50 cursor-not-allowed'
                  : 'border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-400 cursor-pointer'
              }`}
            >
              <div className="mb-4 flex items-center justify-center gap-3">
                <Gem className="h-8 w-8 text-blue-400" />
                <span className="text-3xl font-bold text-white">
                  {TENX_DIAMOND_COST.toLocaleString()}
                </span>
              </div>
              <div className="mb-3 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <p className="text-xl font-semibold text-white">10x Diamond Draw</p>
              </div>
              <p className="text-sm text-gray-300">
                {canAffordWithDiamonds
                  ? `You can do ${Math.floor(diamonds / TENX_DIAMOND_COST)} draws`
                  : 'Not enough diamonds'}
              </p>
            </button>

            {/* Ticket Draw */}
            <button
              onClick={() => {
                setPaymentMethod('tickets')
                setShowConfirm(true)
              }}
              disabled={!canAffordWithTickets || isPulling}
              className={`relative rounded-lg border-2 p-8 text-center transition-all backdrop-blur-sm ${
                !canAffordWithTickets
                  ? 'border-white/10 bg-black/20 opacity-50 cursor-not-allowed'
                  : 'border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 cursor-pointer'
              }`}
            >
              <div className="mb-4 flex items-center justify-center gap-3">
                <Ticket className="h-8 w-8 text-purple-400" />
                <span className="text-3xl font-bold text-white">
                  {TENX_TICKET_COST.toLocaleString()}
                </span>
              </div>
              <div className="mb-3 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <p className="text-xl font-semibold text-white">10x Ticket Draw</p>
              </div>
              <p className="text-sm text-gray-300">
                {canAffordWithTickets
                  ? `You can do ${Math.floor(tickets / TENX_TICKET_COST)} draws`
                  : 'Not enough tickets'}
              </p>
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent className="backdrop-blur-sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm 10x Draw</AlertDialogTitle>
              <AlertDialogDescription>
                This will cost{' '}
                <span className="font-bold text-primary">
                  {paymentMethod === 'diamonds'
                    ? `${TENX_DIAMOND_COST.toLocaleString()} diamonds`
                    : `${TENX_TICKET_COST.toLocaleString()} tickets`}
                </span>
                . This action is <span className="text-red-500 font-semibold">non-refundable</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePull} disabled={isPulling}>
                {isPulling ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Drawing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Confirm Draw
                  </span>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Results Display */}
        {pullResults.length > 0 && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-primary rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
                  Draw Results
                </h2>
                <Button variant="ghost" onClick={() => setPullResults([])} className="text-white">
                  Close
                </Button>
              </div>

              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                {pullResults.map((pull, index) => {
                  const config = rarityDistribution.find((r) => r.rarity === pull.rarity)?.config
                  return (
                    <div
                      key={`${pull.prizeId}-${index}`}
                      className={`rounded-lg p-4 border-2 text-center backdrop-blur-sm ${pull.rarityBorder} ${pull.rarityColor} transform transition-all hover:scale-105 animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-4xl mb-3">{config?.emoji || '🎁'}</div>
                      <Badge
                        className={`mb-2 ${pull.rarityColor} border-0 text-white font-bold`}
                      >
                        {pull.rarityDisplay}
                      </Badge>
                      <p className="font-semibold text-white text-sm">{pull.prizeName}</p>
                      {pull.imageUrl && (
                        <img
                          src={pull.imageUrl}
                          alt={pull.prizeName}
                          className="mt-2 w-full h-20 object-cover rounded"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-300 text-sm">
                  Page will refresh in 3 seconds to update your balance...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
