/**
 * Transaction Manager
 *
 * Secure, server-side currency management with automatic audit trail.
 * All currency operations use atomic transactions to ensure data integrity.
 *
 * CRITICAL: This is the ONLY way to modify user currency balances.
 * Never update user balances directly - always use these functions.
 */

import { db } from '@/lib/db'
import { Currency, TransactionType, User, Transaction } from '@prisma/client'

/**
 * Custom error for insufficient funds
 */
export class InsufficientFundsError extends Error {
  constructor(
    public currency: Currency,
    public required: number,
    public available: number
  ) {
    super(
      `Insufficient ${currency}: Required ${required}, but only ${available} available`
    )
    this.name = 'InsufficientFundsError'
  }
}

/**
 * Custom error for invalid amounts
 */
export class InvalidAmountError extends Error {
  constructor(amount: number) {
    super(`Invalid amount: ${amount}. Amount must be a positive number.`)
    this.name = 'InvalidAmountError'
  }
}

/**
 * Result type for currency operations
 */
export interface CurrencyOperationResult {
  user: User
  transaction: Transaction
}

/**
 * Add currency to a user's balance with automatic transaction logging
 *
 * Uses Prisma $transaction to ensure atomicity:
 * - Updates user balance
 * - Creates transaction record
 * If either fails, both rollback
 *
 * @param userId - The user's ID
 * @param amount - Amount to add (must be positive)
 * @param currency - Type of currency ('DIAMONDS' | 'TICKETS' | 'POINTS')
 * @param type - Transaction type for audit trail
 * @param reference - Optional reference ID (e.g., missionId, orderId)
 * @returns Updated user and transaction record
 * @throws {InvalidAmountError} If amount is not positive
 *
 * @example
 * // Award diamonds from mission completion
 * await addCurrency(
 *   userId,
 *   100,
 *   'DIAMONDS',
 *   'MISSION_REWARD',
 *   missionId
 * )
 *
 * @example
 * // Award tickets from store purchase
 * await addCurrency(
 *   userId,
 *   5,
 *   'TICKETS',
 *   'STORE_BONUS',
 *   orderId
 * )
 */
export async function addCurrency(
  userId: string,
  amount: number,
  currency: Currency,
  type: TransactionType,
  reference?: string
): Promise<CurrencyOperationResult> {
  // Validate amount
  if (amount <= 0 || !Number.isFinite(amount)) {
    throw new InvalidAmountError(amount)
  }

  // Determine which field to update based on currency type
  const balanceField = getCurrencyField(currency)

  // Perform atomic transaction
  const result = await db.$transaction(async (tx) => {
    // Update user balance
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        [balanceField]: {
          increment: amount,
        },
      },
    })

    // Create transaction record for audit trail
    const transaction = await tx.transaction.create({
      data: {
        userId,
        type,
        amount, // Positive for earning
        currency,
        description: getTransactionDescription(type, amount, currency),
        reference,
        status: 'COMPLETED',
      },
    })

    return { user: updatedUser, transaction }
  })

  return result
}

/**
 * Deduct currency from a user's balance with automatic transaction logging
 *
 * CRITICAL: Always validates balance BEFORE deducting
 * Uses Prisma $transaction to ensure atomicity
 *
 * @param userId - The user's ID
 * @param amount - Amount to deduct (must be positive)
 * @param currency - Type of currency ('DIAMONDS' | 'TICKETS' | 'POINTS')
 * @param type - Transaction type for audit trail
 * @param reference - Optional reference ID (e.g., gachaPullId)
 * @returns Updated user and transaction record
 * @throws {InvalidAmountError} If amount is not positive
 * @throws {InsufficientFundsError} If user doesn't have enough balance
 *
 * @example
 * // Deduct diamonds for gacha pull
 * try {
 *   await deductCurrency(
 *     userId,
 *     3000,
 *     'DIAMONDS',
 *     'GACHA_SPEND',
 *     gachaPullId
 *   )
 * } catch (error) {
 *   if (error instanceof InsufficientFundsError) {
 *     return res.status(400).json({ error: error.message })
 *   }
 *   throw error
 * }
 */
export async function deductCurrency(
  userId: string,
  amount: number,
  currency: Currency,
  type: TransactionType,
  reference?: string
): Promise<CurrencyOperationResult> {
  // Validate amount
  if (amount <= 0 || !Number.isFinite(amount)) {
    throw new InvalidAmountError(amount)
  }

  // Determine which field to check
  const balanceField = getCurrencyField(currency)

  // Perform atomic transaction
  const result = await db.$transaction(async (tx) => {
    // Fetch current user balance
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        diamonds: true,
        tickets: true,
        points: true,
      },
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    // Validate sufficient balance
    const currentBalance = user[balanceField]
    if (currentBalance < amount) {
      throw new InsufficientFundsError(currency, amount, currentBalance)
    }

    // Deduct from user balance
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        [balanceField]: {
          decrement: amount,
        },
      },
    })

    // Create transaction record for audit trail
    const transaction = await tx.transaction.create({
      data: {
        userId,
        type,
        amount: -amount, // Negative for spending
        currency,
        description: getTransactionDescription(type, -amount, currency),
        reference,
        status: 'COMPLETED',
      },
    })

    return { user: updatedUser, transaction }
  })

  return result
}

/**
 * Get the user model field name for a given currency type
 */
function getCurrencyField(currency: Currency): 'diamonds' | 'tickets' | 'points' {
  switch (currency) {
    case 'DIAMONDS':
      return 'diamonds'
    case 'TICKETS':
      return 'tickets'
    case 'POINTS':
      return 'points'
    default:
      throw new Error(`Unknown currency type: ${currency}`)
  }
}

/**
 * Generate a human-readable description for a transaction
 */
function getTransactionDescription(
  type: TransactionType,
  amount: number,
  currency: Currency
): string {
  const absAmount = Math.abs(amount)
  const action = amount > 0 ? 'Earned' : 'Spent'
  const currencyName = currency.toLowerCase()

  switch (type) {
    case 'MISSION_REWARD':
      return `${action} ${absAmount} ${currencyName} from mission completion`
    case 'GACHA_SPEND':
      return `${action} ${absAmount} ${currencyName} on gacha pull`
    case 'STORE_BONUS':
      return `${action} ${absAmount} ${currencyName} from store purchase`
    case 'LEVEL_UP':
      return `${action} ${absAmount} ${currencyName} from level up reward`
    case 'GIFT':
      return `${action} ${absAmount} ${currencyName} as a gift`
    case 'ADJUSTMENT':
      return `${action} ${absAmount} ${currencyName} (admin adjustment)`
    default:
      return `${action} ${absAmount} ${currencyName}`
  }
}

/**
 * Get a user's current currency balances
 *
 * @param userId - The user's ID
 * @returns Object with diamonds, tickets, and points balances
 */
export async function getCurrencyBalances(userId: string): Promise<{
  diamonds: number
  tickets: number
  points: number
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      diamonds: true,
      tickets: true,
      points: true,
    },
  })

  if (!user) {
    throw new Error(`User not found: ${userId}`)
  }

  return {
    diamonds: user.diamonds,
    tickets: user.tickets,
    points: user.points,
  }
}
