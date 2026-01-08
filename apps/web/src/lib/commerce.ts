/**
 * Commerce Integration Helpers
 *
 * Handles ticket calculation from merchandise purchases
 * and integration with the reward system.
 *
 * Formula: 1 ticket per £10 GBP spent
 */

/**
 * Calculate tickets earned from a purchase
 *
 * Formula: tickets = floor(GBP_total / 10)
 *
 * Examples:
 * - £50 → floor(50 / 10) = 5 tickets
 * - £29.99 → floor(29.99 / 10) = 2 tickets
 * - £10 → floor(10 / 10) = 1 ticket
 * - £9.99 → floor(9.99 / 10) = 0 tickets
 *
 * @param totalGBP - Order total in GBP
 * @returns Number of tickets earned
 */
export function calculateTicketsFromPurchase(totalGBP: number): number {
  if (totalGBP <= 0) {
    return 0
  }

  // Calculate tickets (1 ticket per £10 spent)
  const tickets = Math.floor(totalGBP / 10)

  return tickets
}

/**
 * Get detailed ticket calculation breakdown (for logging/display)
 *
 * @param totalGBP - Order total in GBP
 * @returns Detailed calculation breakdown
 */
export function getTicketCalculationBreakdown(totalGBP: number): {
  totalGBP: number
  tickets: number
  ticketThreshold: number
} {
  const tickets = calculateTicketsFromPurchase(totalGBP)

  return {
    totalGBP: Math.round(totalGBP * 100) / 100, // Round to 2 decimals
    tickets,
    ticketThreshold: 10, // £10 per ticket
  }
}

/**
 * Format currency for display
 *
 * @param amount - Amount to format
 * @param currency - Currency code (defaults to GBP)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: 'USD' | 'GBP' = 'GBP'): string {
  const symbol = currency === 'USD' ? '$' : '£'
  return `${symbol}${amount.toFixed(2)}`
}
