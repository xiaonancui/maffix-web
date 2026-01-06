/**
 * Commerce Integration Helpers
 *
 * Handles ticket calculation from merchandise purchases
 * and integration with the reward system.
 */

/**
 * Fixed USD to GBP exchange rate for MVP
 * In production, this should be fetched from a real-time API
 * or the store should use GBP natively
 */
const USD_TO_GBP_RATE = 0.79

/**
 * Calculate tickets earned from a purchase
 *
 * Formula: tickets = floor(GBP_total / 10)
 *
 * Examples:
 * - $50 USD = £39.50 → floor(39.5 / 10) = 3 tickets
 * - $63.29 USD = £50 → floor(50 / 10) = 5 tickets
 * - $12.66 USD = £10 → floor(10 / 10) = 1 ticket
 * - $9.99 USD = £7.89 → floor(7.89 / 10) = 0 tickets
 *
 * @param totalUSD - Order total in USD
 * @returns Number of tickets earned
 */
export function calculateTicketsFromPurchase(totalUSD: number): number {
  if (totalUSD <= 0) {
    return 0
  }

  // Convert USD to GBP
  const totalGBP = totalUSD * USD_TO_GBP_RATE

  // Calculate tickets (1 ticket per £10 spent)
  const tickets = Math.floor(totalGBP / 10)

  return tickets
}

/**
 * Get detailed ticket calculation breakdown (for logging/display)
 *
 * @param totalUSD - Order total in USD
 * @returns Detailed calculation breakdown
 */
export function getTicketCalculationBreakdown(totalUSD: number): {
  totalUSD: number
  totalGBP: number
  tickets: number
  exchangeRate: number
} {
  const totalGBP = totalUSD * USD_TO_GBP_RATE
  const tickets = calculateTicketsFromPurchase(totalUSD)

  return {
    totalUSD,
    totalGBP: Math.round(totalGBP * 100) / 100, // Round to 2 decimals
    tickets,
    exchangeRate: USD_TO_GBP_RATE,
  }
}

/**
 * Convert USD to GBP using fixed rate
 *
 * @param amountUSD - Amount in USD
 * @returns Amount in GBP
 */
export function convertUSDtoGBP(amountUSD: number): number {
  return amountUSD * USD_TO_GBP_RATE
}

/**
 * Get the current exchange rate
 *
 * @returns Current USD to GBP exchange rate
 */
export function getExchangeRate(): number {
  return USD_TO_GBP_RATE
}

/**
 * Format currency for display
 *
 * @param amount - Amount to format
 * @param currency - Currency code (USD or GBP)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: 'USD' | 'GBP'): string {
  const symbol = currency === 'USD' ? '$' : '£'
  return `${symbol}${amount.toFixed(2)}`
}
