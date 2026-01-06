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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Gem, Ticket, Sparkles } from 'lucide-react'
import { BANNER_TYPES, getRarityDistribution, type BannerType } from '@/lib/aura-zone'

interface AuraZoneClientProps {
  diamonds: number
  points: number
  userId: string
  userRole: string
}

const TENX_DIAMOND_COST = 3000
const TENX_POINTS_COST = 10

export default function AuraZoneClient({
  diamonds,
  points,
}: AuraZoneClientProps) {
  const [selectedBanner, setSelectedBanner] = useState<BannerType>('beat-like-dat')
  const [showConfirm, setShowConfirm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'diamonds' | 'points'>('diamonds')
  const [isPulling, setIsPulling] = useState(false)
  const [pullResults, setPullResults] = useState<any[]>([])

  const currentBanner = BANNER_TYPES[selectedBanner]
  const canAffordWithDiamonds = diamonds >= TENX_DIAMOND_COST
  const canAffordWithTickets = points >= TENX_POINTS_COST
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

      if (!response.ok) throw new Error('Failed to perform pull')

      const data = await response.json()
      setPullResults(data.pulls || [])
    } catch (error) {
      console.error('Pull error:', error)
      // Show error toast/notification
    } finally {
      setIsPulling(false)
    }
  }

  return (
    <div>
      {/* Banner Selection */}
      <div className="mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedBanner('beat-like-dat')}
            className={`flex-1 rounded-lg border-2 p-4 transition-all ${
              selectedBanner === 'beat-like-dat'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <h3 className="font-bold text-foreground">Beat Like Dat</h3>
            <p className="text-sm text-muted-foreground">
              {BANNER_TYPES['beat-like-dat'].description}
            </p>
          </button>
          <button
            onClick={() => setSelectedBanner('sybau')}
            className={`flex-1 rounded-lg border-2 p-4 transition-all ${
              selectedBanner === 'sybau'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <h3 className="font-bold text-foreground">SYBAU</h3>
            <p className="text-sm text-muted-foreground">
              {BANNER_TYPES.sybau.description}
            </p>
          </button>
        </div>
      </div>

      {/* Draw Options */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-foreground text-center">
          Choose Your Payment Method
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          10x Draw Only • No SSR Guarantee • Pure Luck!
        </p>

        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
          {/* Diamond Draw */}
          <button
            onClick={() => {
              setPaymentMethod('diamonds')
              setShowConfirm(true)
            }}
            disabled={!canAffordWithDiamonds || isPulling}
            className={`relative rounded-lg border-2 p-6 text-center transition-all ${
              !canAffordWithDiamonds
                ? 'border-border bg-card opacity-50 cursor-not-allowed'
                : 'border-border bg-card hover:border-primary cursor-pointer'
            }`}
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <Gem className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">{TENX_DIAMOND_COST}</span>
            </div>
            <p className="font-semibold text-foreground">10x Diamond Draw</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {canAffordWithDiamonds
                ? `You can do ${Math.floor(diamonds / TENX_DIAMOND_COST)} draws`
                : 'Not enough diamonds'}
            </p>
          </button>

          {/* Ticket Draw */}
          <button
            onClick={() => {
              setPaymentMethod('points')
              setShowConfirm(true)
            }}
            disabled={!canAffordWithTickets || isPulling}
            className={`relative rounded-lg border-2 p-6 text-center transition-all ${
              !canAffordWithTickets
                ? 'border-border bg-card opacity-50 cursor-not-allowed'
                : 'border-border bg-card hover:border-primary cursor-pointer'
            }`}
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">{TENX_POINTS_COST}</span>
            </div>
            <p className="font-semibold text-foreground">10x Ticket Draw</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {canAffordWithTickets
                ? `You can do ${Math.floor(points / TENX_POINTS_COST)} draws`
                : 'Not enough tickets'}
            </p>
          </button>
        </div>
      </div>

      {/* Rarity Probability Display */}
      <div className="mb-8 rounded-lg bg-card border border-border p-6">
        <h2 className="mb-4 text-xl font-bold text-foreground">Drop Rates</h2>
        <div className="grid gap-4 sm:grid-cols-5">
          {rarityDistribution.map(({ rarity, probability, config }) => (
            <div
              key={rarity}
              className={`rounded-lg p-4 border-2 text-center ${config.borderColor} ${config.color}`}
            >
              <div className="text-2xl mb-1">{config.emoji}</div>
              <div className="font-bold text-foreground">{config.shortName}</div>
              <div className="text-sm font-semibold text-foreground">{probability.toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm 10x Draw</AlertDialogTitle>
            <AlertDialogDescription>
              This will cost{' '}
              <span className="font-bold text-primary">
                {paymentMethod === 'diamonds' ? `${TENX_DIAMOND_COST} diamonds` : `${TENX_POINTS_COST} tickets`}
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
                'Confirm Draw'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Results Display */}
      {pullResults.length > 0 && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Draw Results
              </h2>
              <Button variant="ghost" onClick={() => setPullResults([])}>
                Close
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {pullResults.map((pull, index) => (
                <div
                  key={`${pull.prizeId}-${index}`}
                  className={`rounded-lg p-4 border-2 text-center ${pull.rarityBorder} ${pull.rarityColor}`}
                >
                  <div className="text-3xl mb-2">
                    {pull.rarityDisplay === 'UR' && '👑'}
                    {pull.rarityDisplay === 'SSR' && '⭐'}
                    {pull.rarityDisplay === 'SR' && '💜'}
                    {pull.rarityDisplay === 'R' && '💙'}
                    {pull.rarityDisplay === 'N' && '⚪'}
                  </div>
                  <Badge className={`mb-2 ${pull.rarityColor} border-0`}>
                    {pull.rarityDisplay}
                  </Badge>
                  <p className="font-semibold text-foreground text-sm">{pull.prizeName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
