/**
 * Leveling Manager
 *
 * Server-side XP and level-up logic with automatic diamond rewards.
 * Integrates level-system.ts calculations with transaction.ts currency management.
 *
 * CRITICAL: This is the ONLY way to grant XP and trigger level-ups.
 * Never update user XP or level directly - always use these functions.
 */

import { db } from '@/lib/db'
import { addCurrency } from '@/lib/transaction'
import { calculateLevelUp, getXpForDifficulty, getLevelFromXp } from '@/lib/level-system'
import { Difficulty } from '@prisma/client'

/**
 * Result of granting XP to a user
 */
export interface XpGrantResult {
  xpGranted: number
  newTotalXp: number
  previousLevel: number
  newLevel: number
  leveledUp: boolean
  levelUpResult?: LevelUpResult
}

/**
 * Result of checking and applying level-ups
 */
export interface LevelUpResult {
  userId: string
  previousLevel: number
  newLevel: number
  levelsGained: number
  totalDiamondsAwarded: number
  levelUps: Array<{
    level: number
    diamondReward: number
    isMilestone: boolean
  }>
}

/**
 * Grant XP to a user from mission completion
 *
 * This is the main entry point for awarding XP. It:
 * 1. Adds XP to the user's total
 * 2. Checks for level-ups
 * 3. Awards diamond rewards automatically
 *
 * @param userId - The user's ID
 * @param difficulty - Mission difficulty (EASY/MEDIUM/HARD)
 * @param taskId - Reference to the task for audit trail
 * @returns XP grant result including any level-ups
 *
 * @example
 * // Grant XP after mission completion
 * const result = await grantMissionXp(userId, 'HARD', taskId)
 * if (result.leveledUp) {
 *   console.log(`Leveled up to ${result.newLevel}!`)
 * }
 */
export async function grantMissionXp(
  userId: string,
  difficulty: Difficulty,
  taskId: string
): Promise<XpGrantResult> {
  // Calculate XP amount based on difficulty
  const xpAmount = getXpForDifficulty(difficulty)

  // Use atomic transaction to update XP and check for level-ups
  const result = await db.$transaction(async (tx) => {
    // Fetch current user state
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    const previousXp = user.xp
    const previousLevel = user.level
    const newTotalXp = previousXp + xpAmount

    // Update user's XP
    await tx.user.update({
      where: { id: userId },
      data: { xp: newTotalXp },
    })

    // Check if user leveled up
    const newLevel = getLevelFromXp(newTotalXp)
    const leveledUp = newLevel > previousLevel

    let levelUpResult: LevelUpResult | undefined

    if (leveledUp) {
      // Apply level-up rewards within the same transaction
      levelUpResult = await applyLevelUpRewards(userId, previousLevel, newLevel, newTotalXp, tx)
    }

    return {
      xpGranted: xpAmount,
      newTotalXp,
      previousLevel,
      newLevel,
      leveledUp,
      levelUpResult,
    }
  })

  return result
}

/**
 * Check and apply level-up rewards for a user
 *
 * This function should be called after XP changes to check if the user
 * has leveled up. If so, it awards diamond rewards and updates the level.
 *
 * @param userId - The user's ID
 * @returns Level-up result if leveled up, null otherwise
 *
 * @example
 * // Check for level-ups (e.g., after admin XP adjustment)
 * const result = await checkAndApplyLevelUp(userId)
 * if (result) {
 *   console.log(`User leveled up ${result.levelsGained} times!`)
 * }
 */
export async function checkAndApplyLevelUp(userId: string): Promise<LevelUpResult | null> {
  const result = await db.$transaction(async (tx) => {
    // Fetch current user state
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    const currentLevel = user.level
    const currentXp = user.xp
    const actualLevel = getLevelFromXp(currentXp)

    // Check if level needs updating
    if (actualLevel <= currentLevel) {
      return null
    }

    // Apply level-up rewards
    return await applyLevelUpRewards(userId, currentLevel, actualLevel, currentXp, tx)
  })

  return result
}

/**
 * Internal function to apply level-up rewards
 * Must be called within a Prisma transaction context
 *
 * @private
 */
async function applyLevelUpRewards(
  userId: string,
  previousLevel: number,
  newLevel: number,
  currentXp: number,
  tx: any // Prisma transaction client
): Promise<LevelUpResult> {
  // Calculate rewards for all levels gained
  const levelUpCalc = calculateLevelUp(currentXp - (currentXp - currentXp), previousLevel, currentXp)

  // Use the correct calculation: compare old vs new level
  const levelsGained = newLevel - previousLevel

  // Calculate total diamond rewards
  let totalDiamondsAwarded = 0
  const levelUps: Array<{ level: number; diamondReward: number; isMilestone: boolean }> = []

  for (let level = previousLevel + 1; level <= newLevel; level++) {
    const levelInfo = calculateLevelUp(0, level - 1, 1) // Get info for this specific level
    const reward = levelInfo.totalDiamondReward

    totalDiamondsAwarded += reward
    levelUps.push({
      level,
      diamondReward: reward,
      isMilestone: level % 5 === 0,
    })
  }

  // Update user level
  await tx.user.update({
    where: { id: userId },
    data: { level: newLevel },
  })

  // Award diamond rewards using addCurrency
  // Note: We need to manually handle the transaction here since we're already in one
  if (totalDiamondsAwarded > 0) {
    // Determine which field to update
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        diamonds: {
          increment: totalDiamondsAwarded,
        },
      },
    })

    // Create transaction records for each level-up
    for (const levelUp of levelUps) {
      await tx.transaction.create({
        data: {
          userId,
          type: 'LEVEL_UP',
          amount: levelUp.diamondReward,
          currency: 'DIAMONDS',
          description: levelUp.isMilestone
            ? `Milestone reward for reaching Level ${levelUp.level}`
            : `Level up reward for reaching Level ${levelUp.level}`,
          reference: `level_${levelUp.level}`,
          status: 'COMPLETED',
        },
      })
    }
  }

  return {
    userId,
    previousLevel,
    newLevel,
    levelsGained,
    totalDiamondsAwarded,
    levelUps,
  }
}

/**
 * Grant XP with a custom amount (for admin/special events)
 *
 * @param userId - The user's ID
 * @param xpAmount - Amount of XP to grant
 * @param reason - Reason for granting XP (for audit)
 * @returns XP grant result including any level-ups
 */
export async function grantCustomXp(
  userId: string,
  xpAmount: number,
  reason: string
): Promise<XpGrantResult> {
  if (xpAmount <= 0 || !Number.isFinite(xpAmount)) {
    throw new Error(`Invalid XP amount: ${xpAmount}`)
  }

  const result = await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    const previousXp = user.xp
    const previousLevel = user.level
    const newTotalXp = previousXp + xpAmount

    await tx.user.update({
      where: { id: userId },
      data: { xp: newTotalXp },
    })

    const newLevel = getLevelFromXp(newTotalXp)
    const leveledUp = newLevel > previousLevel

    let levelUpResult: LevelUpResult | undefined

    if (leveledUp) {
      levelUpResult = await applyLevelUpRewards(userId, previousLevel, newLevel, newTotalXp, tx)
    }

    return {
      xpGranted: xpAmount,
      newTotalXp,
      previousLevel,
      newLevel,
      leveledUp,
      levelUpResult,
    }
  })

  return result
}

/**
 * Get user's current level progress
 * This is a read-only helper for UI display
 */
export async function getUserLevelProgress(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      xp: true,
      level: true,
      diamonds: true,
    },
  })

  if (!user) {
    throw new Error(`User not found: ${userId}`)
  }

  return {
    currentXp: user.xp,
    currentLevel: user.level,
    diamonds: user.diamonds,
  }
}
