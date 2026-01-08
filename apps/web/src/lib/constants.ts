/**
 * Feature Flags
 * Toggle visibility of features in the application
 */

// Premium Packs feature - set to false to hide from navigation
export const ENABLE_PREMIUM_PACKS = false

/**
 * Aura Zone Costs
 * Pricing for gacha pulls
 */
export const AURA_ZONE_COSTS = {
  SINGLE_PULL_DIAMONDS: 300,
  TEN_PULL_DIAMONDS: 3000,
  SINGLE_PULL_TICKETS: 1,
  TEN_PULL_TICKETS: 10,
} as const

/**
 * Currency Types
 */
export type CurrencyType = 'DIAMONDS' | 'TICKETS'
