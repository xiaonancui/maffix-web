/**
 * Gacha System Utilities
 * 
 * This module provides core gacha mechanics including:
 * - Weighted probability selection
 * - SSR guarantee mechanism
 * - Prize pool management
 * - Rarity tier definitions
 */

import { Rarity } from '@prisma/client'

// =============================================================================
// Rarity Tier Configuration
// =============================================================================

/**
 * Standard probability distribution for gacha pulls
 * Total: 100%
 */
export const RARITY_PROBABILITIES: Record<Rarity, number> = {
  COMMON: 60.0,      // 60% - Common items
  RARE: 25.0,        // 25% - Rare items
  EPIC: 10.0,        // 10% - Epic items
  SSR: 4.0,          // 4% - Super Super Rare items
  LEGENDARY: 1.0,    // 1% - Legendary items (highest rarity)
}

/**
 * Check if a rarity is SSR or higher (for guarantee mechanism)
 */
export function isSSROrHigher(rarity: Rarity): boolean {
  return rarity === 'SSR' || rarity === 'LEGENDARY'
}

/**
 * Get rarity display name
 */
export function getRarityDisplayName(rarity: Rarity): string {
  const names: Record<Rarity, string> = {
    COMMON: 'Common',
    RARE: 'Rare',
    EPIC: 'Epic',
    SSR: 'SSR',
    LEGENDARY: 'Legendary',
  }
  return names[rarity]
}

/**
 * Get rarity color for UI display
 */
export function getRarityColor(rarity: Rarity): string {
  const colors: Record<Rarity, string> = {
    COMMON: '#9CA3AF',    // Gray
    RARE: '#3B82F6',      // Blue
    EPIC: '#A855F7',      // Purple
    SSR: '#F59E0B',       // Amber/Gold
    LEGENDARY: '#EF4444', // Red
  }
  return colors[rarity]
}

// =============================================================================
// Weighted Random Selection
// =============================================================================

export interface GachaItemWithPrize {
  id: string
  prizeId: string
  probability: number
  prize: {
    id: string
    name: string
    description: string
    rarity: Rarity
    type: string
    image: string | null
    value: number
    stock: number | null
  }
}

/**
 * Select a random gacha item based on weighted probabilities
 * 
 * @param items - Array of gacha items with probabilities
 * @returns Selected gacha item
 */
export function selectRandomGachaItem(
  items: GachaItemWithPrize[]
): GachaItemWithPrize {
  if (items.length === 0) {
    throw new Error('No gacha items available')
  }

  // Filter out items that are out of stock
  const availableItems = items.filter(
    (item) => item.prize.stock === null || item.prize.stock > 0
  )

  if (availableItems.length === 0) {
    throw new Error('All gacha items are out of stock')
  }

  // Calculate total probability
  const totalProbability = availableItems.reduce(
    (sum, item) => sum + item.probability,
    0
  )

  // Generate random number
  const random = Math.random() * totalProbability
  let cumulativeProbability = 0

  // Select item based on probability
  for (const item of availableItems) {
    cumulativeProbability += item.probability
    if (random <= cumulativeProbability) {
      return item
    }
  }

  // Fallback to last item (should never reach here)
  return availableItems[availableItems.length - 1]
}

/**
 * Select multiple random gacha items (for 10x pulls)
 * 
 * @param items - Array of gacha items with probabilities
 * @param count - Number of items to select (default: 10)
 * @returns Array of selected gacha items
 */
export function selectMultipleGachaItems(
  items: GachaItemWithPrize[],
  count: number = 10
): GachaItemWithPrize[] {
  const results: GachaItemWithPrize[] = []

  for (let i = 0; i < count; i++) {
    const selected = selectRandomGachaItem(items)
    results.push(selected)
  }

  return results
}

// =============================================================================
// SSR Guarantee Mechanism
// =============================================================================

/**
 * SSR guarantee configuration
 */
export const SSR_GUARANTEE_CONFIG = {
  PULLS_PER_GUARANTEE: 10,  // Every 10 pulls guarantees at least 1 SSR+
  PITY_THRESHOLD: 90,       // After 90 pulls without SSR+, next pull is guaranteed SSR+
}

/**
 * Check if a 10x pull contains at least one SSR or higher
 * 
 * @param items - Array of 10 pulled items
 * @returns True if contains SSR+, false otherwise
 */
export function hasSSROrHigher(items: GachaItemWithPrize[]): boolean {
  return items.some((item) => isSSROrHigher(item.prize.rarity))
}

/**
 * Enforce SSR guarantee for 10x pull
 * If the pull doesn't contain any SSR+, replace the lowest rarity item with a guaranteed SSR
 * 
 * @param items - Array of 10 pulled items
 * @param allGachaItems - All available gacha items
 * @returns Modified array with guaranteed SSR
 */
export function enforceSSRGuarantee(
  items: GachaItemWithPrize[],
  allGachaItems: GachaItemWithPrize[]
): { items: GachaItemWithPrize[]; guaranteedIndex: number | null } {
  // Check if already has SSR+
  if (hasSSROrHigher(items)) {
    return { items, guaranteedIndex: null }
  }

  // Get all SSR+ items
  const ssrItems = allGachaItems.filter((item) =>
    isSSROrHigher(item.prize.rarity)
  )

  if (ssrItems.length === 0) {
    console.warn('No SSR+ items available for guarantee')
    return { items, guaranteedIndex: null }
  }

  // Select a random SSR+ item
  const guaranteedSSR = selectRandomGachaItem(ssrItems)

  // Find the index of the lowest rarity item to replace
  let lowestRarityIndex = 0
  let lowestRarityValue = getRarityValue(items[0].prize.rarity)

  for (let i = 1; i < items.length; i++) {
    const rarityValue = getRarityValue(items[i].prize.rarity)
    if (rarityValue < lowestRarityValue) {
      lowestRarityValue = rarityValue
      lowestRarityIndex = i
    }
  }

  // Replace the lowest rarity item with guaranteed SSR
  const modifiedItems = [...items]
  modifiedItems[lowestRarityIndex] = guaranteedSSR

  return { items: modifiedItems, guaranteedIndex: lowestRarityIndex }
}

/**
 * Get numeric value for rarity (for comparison)
 */
function getRarityValue(rarity: Rarity): number {
  const values: Record<Rarity, number> = {
    COMMON: 1,
    RARE: 2,
    EPIC: 3,
    SSR: 4,
    LEGENDARY: 5,
  }
  return values[rarity]
}

/**
 * Calculate new pity counter after a pull
 * 
 * @param currentPity - Current pity counter
 * @param gotSSROrHigher - Whether the pull resulted in SSR+
 * @returns New pity counter value
 */
export function calculateNewPityCounter(
  currentPity: number,
  gotSSROrHigher: boolean
): number {
  if (gotSSROrHigher) {
    return 0 // Reset pity counter
  }
  return currentPity + 1
}

/**
 * Check if pity guarantee should trigger
 * 
 * @param pityCounter - Current pity counter
 * @returns True if pity guarantee should trigger
 */
export function shouldTriggerPityGuarantee(pityCounter: number): boolean {
  return pityCounter >= SSR_GUARANTEE_CONFIG.PITY_THRESHOLD
}

// =============================================================================
// Stock Management
// =============================================================================

/**
 * Check if a prize has sufficient stock
 * 
 * @param stock - Current stock (null = unlimited)
 * @param quantity - Quantity to check
 * @returns True if sufficient stock available
 */
export function hasSufficientStock(
  stock: number | null,
  quantity: number = 1
): boolean {
  if (stock === null) {
    return true // Unlimited stock
  }
  return stock >= quantity
}

/**
 * Validate stock for multiple items
 * 
 * @param items - Array of items to validate
 * @returns True if all items have sufficient stock
 */
export function validateStockForMultiplePulls(
  items: GachaItemWithPrize[]
): boolean {
  const stockCount = new Map<string, number>()

  // Count how many times each prize is pulled
  for (const item of items) {
    const currentCount = stockCount.get(item.prizeId) || 0
    stockCount.set(item.prizeId, currentCount + 1)
  }

  // Check if each prize has sufficient stock
  for (const item of items) {
    const requiredQuantity = stockCount.get(item.prizeId) || 0
    if (!hasSufficientStock(item.prize.stock, requiredQuantity)) {
      return false
    }
  }

  return true
}

