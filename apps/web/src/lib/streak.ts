/**
 * Streak Management System
 *
 * Handles 7-day login streak tracking and rewards.
 * Streak increments on consecutive daily logins and resets if user misses a day.
 *
 * Rewards:
 * - Days 1-6: Base mission rewards (25-50 diamonds)
 * - Day 7: Bonus reward (100 diamonds)
 */

import { db } from '@/lib/db'
import { addCurrency } from '@/lib/transaction'

/**
 * Streak status result
 */
export interface StreakStatus {
  userId: string
  currentStreak: number
  lastStreakDate: Date | null
  isActive: boolean
  daysUntilReset: number
  nextRewardLevel: number
}

/**
 * Update user's login streak
 *
 * This should be called when a user logs in.
 * It checks the last login date and either:
 * - Increments the streak (if login was yesterday)
 * - Maintains the streak (if login was today)
 * - Resets the streak to 1 (if login was 2+ days ago)
 *
 * @param userId - The user's ID
 * @returns Updated streak status
 *
 * @example
 * // Call on user login
 * const streakStatus = await updateUserStreak(userId)
 * if (streakStatus.currentStreak === 7) {
 *   console.log('7-day streak completed!')
 * }
 */
export async function updateUserStreak(userId: string): Promise<StreakStatus> {
  return await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        streakCount: true,
        lastStreakDate: true,
        lastLoginAt: true,
      },
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    const now = new Date()
    const today = getStartOfDay(now)
    const lastStreak = user.lastStreakDate ? getStartOfDay(user.lastStreakDate) : null
    const lastLogin = user.lastLoginAt ? getStartOfDay(user.lastLoginAt) : null

    let newStreakCount = user.streakCount
    let shouldUpdate = false

    // If no previous streak, start new streak
    if (!lastStreak) {
      newStreakCount = 1
      shouldUpdate = true
    } else {
      const daysSinceLastStreak = Math.floor((today.getTime() - lastStreak.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSinceLastStreak === 0) {
        // Same day - no change
        newStreakCount = user.streakCount
      } else if (daysSinceLastStreak === 1) {
        // Consecutive day - increment streak (max 7)
        newStreakCount = Math.min(user.streakCount + 1, 7)
        shouldUpdate = true
      } else {
        // Missed a day - reset streak
        newStreakCount = 1
        shouldUpdate = true
      }
    }

    // Update database if streak changed
    if (shouldUpdate) {
      await tx.user.update({
        where: { id: userId },
        data: {
          streakCount: newStreakCount,
          lastStreakDate: now,
          lastLoginAt: now,
        },
      })
    } else {
      // Just update login time
      await tx.user.update({
        where: { id: userId },
        data: {
          lastLoginAt: now,
        },
      })
    }

    return {
      userId,
      currentStreak: newStreakCount,
      lastStreakDate: now,
      isActive: true,
      daysUntilReset: 1, // Resets if no login within 1 day
      nextRewardLevel: newStreakCount < 7 ? newStreakCount + 1 : 7,
    }
  })
}

/**
 * Get user's current streak status (read-only)
 *
 * @param userId - The user's ID
 * @returns Current streak status
 */
export async function getStreakStatus(userId: string): Promise<StreakStatus> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      streakCount: true,
      lastStreakDate: true,
      lastLoginAt: true,
    },
  })

  if (!user) {
    throw new Error(`User not found: ${userId}`)
  }

  const now = new Date()
  const today = getStartOfDay(now)
  const lastStreak = user.lastStreakDate ? getStartOfDay(user.lastStreakDate) : null

  // Check if streak is still active
  let isActive = false
  let daysUntilReset = 0

  if (lastStreak) {
    const daysSinceLastStreak = Math.floor((today.getTime() - lastStreak.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceLastStreak === 0) {
      isActive = true
      daysUntilReset = 1
    } else if (daysSinceLastStreak === 1) {
      isActive = true
      daysUntilReset = 0 // Need to login today to maintain streak
    } else {
      isActive = false
      daysUntilReset = 0 // Streak already broken
    }
  }

  return {
    userId,
    currentStreak: user.streakCount,
    lastStreakDate: user.lastStreakDate,
    isActive,
    daysUntilReset,
    nextRewardLevel: user.streakCount < 7 ? user.streakCount + 1 : 7,
  }
}

/**
 * Calculate streak-based rewards
 *
 * Returns the diamond multiplier based on current streak.
 * - Days 1-6: 1x base rewards
 * - Day 7: 2x base rewards + 100 bonus diamonds
 *
 * @param streakCount - Current streak count (1-7)
 * @returns Reward configuration
 */
export function calculateStreakRewards(streakCount: number): {
  multiplier: number
  bonusDiamonds: number
  isMaxStreak: boolean
} {
  const normalizedStreak = Math.max(1, Math.min(streakCount, 7))

  if (normalizedStreak === 7) {
    return {
      multiplier: 2,
      bonusDiamonds: 100,
      isMaxStreak: true,
    }
  }

  return {
    multiplier: 1,
    bonusDiamonds: 0,
    isMaxStreak: false,
  }
}

/**
 * Grant streak bonus rewards
 *
 * This should be called when user completes a mission while on a streak.
 *
 * @param userId - The user's ID
 * @param streakCount - Current streak count
 * @param baseDiamonds - Base diamond reward from mission
 * @returns Total diamonds granted (with streak bonus)
 */
export async function grantStreakBonus(
  userId: string,
  streakCount: number,
  baseDiamonds: number
): Promise<number> {
  const rewards = calculateStreakRewards(streakCount)
  const totalDiamonds = baseDiamonds * rewards.multiplier + rewards.bonusDiamonds

  if (rewards.bonusDiamonds > 0) {
    // Grant bonus diamonds through transaction system
    await addCurrency(
      userId,
      rewards.bonusDiamonds,
      'DIAMONDS',
      'EARN',
      `streak_bonus_${Date.now()}`
    )
  }

  return totalDiamonds
}

/**
 * Reset streak for a user (admin/system use)
 *
 * @param userId - The user's ID
 */
export async function resetStreak(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      streakCount: 0,
      lastStreakDate: null,
    },
  })
}

/**
 * Check and reset inactive streaks (for cron job)
 *
 * This should be called by the daily reset cron job.
 * It resets streaks for users who haven't logged in for 2+ days.
 *
 * @returns Number of streaks reset
 */
export async function resetInactiveStreaks(): Promise<number> {
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
  twoDaysAgo.setHours(0, 0, 0, 0)

  const result = await db.user.updateMany({
    where: {
      AND: [
        { streakCount: { gt: 0 } },
        {
          OR: [
            { lastStreakDate: { lt: twoDaysAgo } },
            { lastStreakDate: null },
          ],
        },
      ],
    },
    data: {
      streakCount: 0,
      lastStreakDate: null,
    },
  })

  return result.count
}

/**
 * Get start of day (00:00:00) for date comparison
 */
function getStartOfDay(date: Date): Date {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  return startOfDay
}

/**
 * Get streak display data for UI
 *
 * Returns an array of 7 objects representing each day of the streak.
 *
 * @param streakCount - Current streak count (0-7)
 * @returns Array of streak day data
 */
export function getStreakDisplayData(streakCount: number): Array<{
  day: number
  completed: boolean
  reward: number
  isBonus: boolean
}> {
  const baseRewards = [25, 30, 35, 40, 50, 60, 100] // Escalating rewards

  return Array.from({ length: 7 }, (_, index) => {
    const day = index + 1
    return {
      day,
      completed: day <= streakCount,
      reward: baseRewards[index],
      isBonus: day === 7,
    }
  })
}
