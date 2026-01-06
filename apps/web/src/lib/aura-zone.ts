// =============================================================================
// Maffix Aura Zone (Gacha) System
// =============================================================================
// New gacha system with:
// - Only 10x draw support (removed single draw)
// - No SSR guarantee/pity system
// - New probability distribution (UR, SSR, SR, R, N)
// - Cost: 3000 diamonds OR 10 tickets for 10x draw
// =============================================================================

import type { Rarity } from '@prisma/client'

export type AuraZoneRarity = 'LEGENDARY' | 'SSR' | 'EPIC' | 'RARE' | 'COMMON'

export interface AuraZoneItem {
  id: string
  prizeId: string
  probability: number
  prize: {
    id: string
    name: string
    description: string
    rarity: Rarity
    image?: string | null
    type: string
  }
}

export interface PullResult {
  prizeId: string
  prizeName: string
  rarity: Rarity
  rarityDisplay: string
  imageUrl?: string | null
  rarityColor: string
  rarityBorder: string
}

export interface TenPullResult {
  pulls: PullResult[]
  batchId: string
  cost: number
  costType: 'diamonds' | 'points'
  timestamp: Date
}

/**
 * New Aura Zone rarity probabilities (10-draw combined)
 * Based on typical gacha distribution:
 * - LEGENDARY: 3%
 * - SSR (Super Super Rare): 15.65%
 * - EPIC: 25%
 * - RARE: 35%
 * - COMMON: 21.35%
 */
export const AURA_ZONE_PROBABILITIES = {
  LEGENDARY: 3.0,      // Legendary - highest tier
  SSR: 15.65,   // Super Super Rare
  EPIC: 25.0,     // Epic
  RARE: 35.0,      // Rare
  COMMON: 21.35,     // Common
} as const

/**
 * Cost constants for Aura Zone draws
 */
export const AURA_ZONE_COSTS = {
  TENX_DIAMONDS: 3000,  // 10x draw cost in diamonds
  TENX_POINTS: 10,      // 10x draw cost in points
} as const

/**
 * Rarity display configuration
 */
export const RARITY_CONFIG = {
  LEGENDARY: {
    name: 'Legendary',
    shortName: 'LEG',
    color: 'bg-gradient-to-r from-red-600 to-orange-500',
    borderColor: 'border-red-500',
    textColor: 'text-red-500',
    glow: 'shadow-red-500/50',
    emoji: '👑',
    animate: true,
  },
  SSR: {
    name: 'Super Super Rare',
    shortName: 'SSR',
    color: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-500',
    glow: 'shadow-yellow-500/50',
    emoji: '⭐',
    animate: true,
  },
  EPIC: {
    name: 'Epic',
    shortName: 'EP',
    color: 'bg-gradient-to-r from-purple-500 to-purple-700',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-500',
    glow: 'shadow-purple-500/50',
    emoji: '💜',
    animate: false,
  },
  RARE: {
    name: 'Rare',
    shortName: 'R',
    color: 'bg-gradient-to-r from-blue-500 to-blue-700',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-500',
    glow: 'shadow-blue-500/50',
    emoji: '💙',
    animate: false,
  },
  COMMON: {
    name: 'Common',
    shortName: 'COM',
    color: 'bg-gradient-to-r from-gray-400 to-gray-600',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-400',
    glow: 'shadow-gray-400/50',
    emoji: '⚪',
    animate: false,
  },
} as const

/**
 * Get rarity configuration for a given rarity
 */
export function getRarityConfig(rarity: string) {
  return RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG] || RARITY_CONFIG.COMMON
}

/**
 * Generate a random rarity based on probability weights
 * Uses weighted random selection
 */
export function generateRandomRarity(): AuraZoneRarity {
  const random = Math.random() * 100
  let cumulativeProbability = 0

  // Check LEGENDARY (0-3%)
  cumulativeProbability += AURA_ZONE_PROBABILITIES.LEGENDARY
  if (random < cumulativeProbability) return 'LEGENDARY' as const

  // Check SSR (3-18.65%)
  cumulativeProbability += AURA_ZONE_PROBABILITIES.SSR
  if (random < cumulativeProbability) return 'SSR' as const

  // Check EPIC (18.65-43.65%)
  cumulativeProbability += AURA_ZONE_PROBABILITIES.EPIC
  if (random < cumulativeProbability) return 'EPIC' as const

  // Check RARE (43.65-78.65%)
  cumulativeProbability += AURA_ZONE_PROBABILITIES.RARE
  if (random < cumulativeProbability) return 'RARE' as const

  // Default to COMMON (78.65-100%)
  return 'COMMON' as const
}

/**
 * Map AuraZone rarity to Prisma Rarity
 */
function mapAuraZoneRarityToPrisma(rarity: AuraZoneRarity): Rarity {
  const mapping: Record<AuraZoneRarity, Rarity> = {
    'LEGENDARY': 'LEGENDARY',
    'SSR': 'SSR',
    'EPIC': 'EPIC',
    'RARE': 'RARE',
    'COMMON': 'COMMON',
  }
  return mapping[rarity]
}

/**
 * Perform a 10x pull and return results
 * @param items - Available gacha items
 * @param costType - 'diamonds' or 'points'
 * @returns TenPullResult with array of 10 prizes
 */
export function performTenPull(
  items: AuraZoneItem[],
  costType: 'diamonds' | 'points' = 'diamonds'
): TenPullResult {
  const pulls: PullResult[] = []
  const batchId = `batch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  // Group items by rarity for weighted selection
  const itemsByRarity = new Map<Rarity, AuraZoneItem[]>()

  for (const item of items) {
    if (!itemsByRarity.has(item.prize.rarity)) {
      itemsByRarity.set(item.prize.rarity, [])
    }
    itemsByRarity.get(item.prize.rarity)!.push(item)
  }

  // Generate 10 pulls
  for (let i = 0; i < 10; i++) {
    const auraRarity = generateRandomRarity()
    const prismaRarity = mapAuraZoneRarityToPrisma(auraRarity)
    const rarityItems = itemsByRarity.get(prismaRarity)

    if (!rarityItems || rarityItems.length === 0) {
      // Fallback to any item if rarity pool is empty
      const fallbackItem = items[Math.floor(Math.random() * items.length)]
      if (fallbackItem) {
        pulls.push(createPullResult(fallbackItem))
      } else {
        // Create a placeholder if no items exist
        pulls.push(createPlaceholderPull(prismaRarity, auraRarity))
      }
    } else {
      // Random item from selected rarity
      const randomItem = rarityItems[Math.floor(Math.random() * rarityItems.length)]
      pulls.push(createPullResult(randomItem))
    }
  }

  return {
    pulls,
    batchId,
    cost: costType === 'diamonds' ? AURA_ZONE_COSTS.TENX_DIAMONDS : AURA_ZONE_COSTS.TENX_POINTS,
    costType,
    timestamp: new Date(),
  }
}

/**
 * Create a pull result from a gacha item
 */
function createPullResult(item: AuraZoneItem): PullResult {
  const rarityConfig = getRarityConfig(item.prize.rarity as Rarity)

  return {
    prizeId: item.prizeId,
    prizeName: item.prize.name,
    rarity: item.prize.rarity as Rarity,
    rarityDisplay: rarityConfig.shortName,
    imageUrl: item.prize.image,
    rarityColor: rarityConfig.color,
    rarityBorder: rarityConfig.borderColor,
  }
}

/**
 * Create a placeholder pull result for empty rarity pools
 */
function createPlaceholderPull(prismaRarity: Rarity, auraRarity: AuraZoneRarity): PullResult {
  const rarityConfig = getRarityConfig(auraRarity)

  return {
    prizeId: `placeholder-${auraRarity}-${Date.now()}`,
    prizeName: `${rarityConfig.name} Prize`,
    rarity: prismaRarity,
    rarityDisplay: rarityConfig.shortName,
    imageUrl: null,
    rarityColor: rarityConfig.color,
    rarityBorder: rarityConfig.borderColor,
  }
}

/**
 * Check if user can afford a 10x pull
 */
export function canAffordTenPull(diamonds: number, points: number): {
  canAffordWithDiamonds: boolean
  canAffordWithPoints: boolean
  canAffordEither: boolean
} {
  const canAffordWithDiamonds = diamonds >= AURA_ZONE_COSTS.TENX_DIAMONDS
  const canAffordWithPoints = points >= AURA_ZONE_COSTS.TENX_POINTS

  return {
    canAffordWithDiamonds,
    canAffordWithPoints,
    canAffordEither: canAffordWithDiamonds || canAffordWithPoints,
  }
}

/**
 * Get rarity distribution summary for display
 */
export function getRarityDistribution(): Array<{
  rarity: string
  probability: number
  config: typeof RARITY_CONFIG[keyof typeof RARITY_CONFIG]
}> {
  return [
    { rarity: 'LEGENDARY', probability: AURA_ZONE_PROBABILITIES.LEGENDARY, config: RARITY_CONFIG.LEGENDARY },
    { rarity: 'SSR', probability: AURA_ZONE_PROBABILITIES.SSR, config: RARITY_CONFIG.SSR },
    { rarity: 'EPIC', probability: AURA_ZONE_PROBABILITIES.EPIC, config: RARITY_CONFIG.EPIC },
    { rarity: 'RARE', probability: AURA_ZONE_PROBABILITIES.RARE, config: RARITY_CONFIG.RARE },
    { rarity: 'COMMON', probability: AURA_ZONE_PROBABILITIES.COMMON, config: RARITY_CONFIG.COMMON },
  ]
}

/**
 * Calculate expected value of a 10x pull
 * Returns expected number of each rarity per 10 pulls
 */
export function getExpectedValue() {
  const pulls = 10

  return {
    LEGENDARY: (pulls * AURA_ZONE_PROBABILITIES.LEGENDARY) / 100,
    SSR: (pulls * AURA_ZONE_PROBABILITIES.SSR) / 100,
    EPIC: (pulls * AURA_ZONE_PROBABILITIES.EPIC) / 100,
    RARE: (pulls * AURA_ZONE_PROBABILITIES.RARE) / 100,
    COMMON: (pulls * AURA_ZONE_PROBABILITIES.COMMON) / 100,
  }
}

/**
 * Simulate n number of 10x pulls for testing/preview
 */
export function simulatePulls(
  items: AuraZoneItem[],
  numberOfTenPulls: number
): TenPullResult[] {
  const results: TenPullResult[] = []

  for (let i = 0; i < numberOfTenPulls; i++) {
    results.push(performTenPull(items))
  }

  return results
}

/**
 * Banner types for Aura Zone
 */
export const BANNER_TYPES = {
  'beat-like-dat': {
    id: 'beat-like-dat',
    name: 'Beat Like Dat',
    description: 'Exclusive rewards from the Beat Like Dat collection',
    backgroundVideo: '/banners/beat-like-dat.mp4',
    accentColor: 'from-purple-600 to-pink-600',
  },
  sybau: {
    id: 'sybau',
    name: 'SYBAU',
    description: 'Special SYBAU collection rewards',
    backgroundVideo: '/banners/sybau.mp4',
    accentColor: 'from-blue-600 to-cyan-600',
  },
} as const

export type BannerType = keyof typeof BANNER_TYPES
