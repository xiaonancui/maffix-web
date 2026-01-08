// =============================================================================
// Maffix Level System
// =============================================================================
// Handles XP calculations, level thresholds, and level-up rewards
// =============================================================================

export interface LevelInfo {
  level: number
  xpThreshold: number
  cumulativeXp: number
  diamondReward: number
  isMilestone: boolean
}

export interface LevelProgress {
  currentLevel: number
  currentXp: number
  xpToNextLevel: number
  xpInCurrentLevel: number
  progressPercent: number
  nextLevel: LevelInfo
}

/**
 * XP threshold table for levels 1-50
 * Uses an exponential curve: XP = base * (1.5 ^ (level-1))
 * Milestone levels (5, 10, 15, ...) give bonus diamond rewards
 */
export const LEVEL_THRESHOLDS: LevelInfo[] = [
  // Level 1 (starting level)
  { level: 1, xpThreshold: 0, cumulativeXp: 0, diamondReward: 0, isMilestone: false },

  // Level 2-4 (Regular levels: +30 diamonds each)
  { level: 2, xpThreshold: 100, cumulativeXp: 100, diamondReward: 30, isMilestone: false },
  { level: 3, xpThreshold: 250, cumulativeXp: 250, diamondReward: 30, isMilestone: false },
  { level: 4, xpThreshold: 450, cumulativeXp: 450, diamondReward: 30, isMilestone: false },

  // Level 5 (Milestone: +80 diamonds)
  { level: 5, xpThreshold: 700, cumulativeXp: 700, diamondReward: 80, isMilestone: true },

  // Level 6-9 (Regular levels: +30 diamonds each)
  { level: 6, xpThreshold: 1000, cumulativeXp: 1000, diamondReward: 30, isMilestone: false },
  { level: 7, xpThreshold: 1350, cumulativeXp: 1350, diamondReward: 30, isMilestone: false },
  { level: 8, xpThreshold: 1750, cumulativeXp: 1750, diamondReward: 30, isMilestone: false },
  { level: 9, xpThreshold: 2200, cumulativeXp: 2200, diamondReward: 30, isMilestone: false },

  // Level 10 (Milestone: +80 diamonds)
  { level: 10, xpThreshold: 2700, cumulativeXp: 2700, diamondReward: 80, isMilestone: true },

  // Level 11-14 (Regular levels: +30 diamonds each)
  { level: 11, xpThreshold: 3250, cumulativeXp: 3250, diamondReward: 30, isMilestone: false },
  { level: 12, xpThreshold: 3850, cumulativeXp: 3850, diamondReward: 30, isMilestone: false },
  { level: 13, xpThreshold: 4500, cumulativeXp: 4500, diamondReward: 30, isMilestone: false },
  { level: 14, xpThreshold: 5200, cumulativeXp: 5200, diamondReward: 30, isMilestone: false },

  // Level 15 (Milestone: +80 diamonds)
  { level: 15, xpThreshold: 6000, cumulativeXp: 6000, diamondReward: 80, isMilestone: true },

  // Level 16-19 (Regular levels: +30 diamonds each)
  { level: 16, xpThreshold: 6850, cumulativeXp: 6850, diamondReward: 30, isMilestone: false },
  { level: 17, xpThreshold: 7750, cumulativeXp: 7750, diamondReward: 30, isMilestone: false },
  { level: 18, xpThreshold: 8700, cumulativeXp: 8700, diamondReward: 30, isMilestone: false },
  { level: 19, xpThreshold: 9700, cumulativeXp: 9700, diamondReward: 30, isMilestone: false },

  // Level 20 (Milestone: +80 diamonds)
  { level: 20, xpThreshold: 10750, cumulativeXp: 10750, diamondReward: 80, isMilestone: true },

  // Level 21-24 (Regular levels: +30 diamonds each)
  { level: 21, xpThreshold: 11850, cumulativeXp: 11850, diamondReward: 30, isMilestone: false },
  { level: 22, xpThreshold: 13000, cumulativeXp: 13000, diamondReward: 30, isMilestone: false },
  { level: 23, xpThreshold: 14200, cumulativeXp: 14200, diamondReward: 30, isMilestone: false },
  { level: 24, xpThreshold: 15450, cumulativeXp: 15450, diamondReward: 30, isMilestone: false },

  // Level 25 (Milestone: +80 diamonds)
  { level: 25, xpThreshold: 16750, cumulativeXp: 16750, diamondReward: 80, isMilestone: true },

  // Level 26-29 (Regular levels: +30 diamonds each)
  { level: 26, xpThreshold: 18100, cumulativeXp: 18100, diamondReward: 30, isMilestone: false },
  { level: 27, xpThreshold: 19500, cumulativeXp: 19500, diamondReward: 30, isMilestone: false },
  { level: 28, xpThreshold: 20950, cumulativeXp: 20950, diamondReward: 30, isMilestone: false },
  { level: 29, xpThreshold: 22450, cumulativeXp: 22450, diamondReward: 30, isMilestone: false },

  // Level 30 (Milestone: +80 diamonds)
  { level: 30, xpThreshold: 24000, cumulativeXp: 24000, diamondReward: 80, isMilestone: true },

  // Level 31-34 (Regular levels: +30 diamonds each)
  { level: 31, xpThreshold: 25600, cumulativeXp: 25600, diamondReward: 30, isMilestone: false },
  { level: 32, xpThreshold: 27250, cumulativeXp: 27250, diamondReward: 30, isMilestone: false },
  { level: 33, xpThreshold: 28950, cumulativeXp: 28950, diamondReward: 30, isMilestone: false },
  { level: 34, xpThreshold: 30700, cumulativeXp: 30700, diamondReward: 30, isMilestone: false },

  // Level 35 (Milestone: +80 diamonds)
  { level: 35, xpThreshold: 32500, cumulativeXp: 32500, diamondReward: 80, isMilestone: true },

  // Level 36-39 (Regular levels: +30 diamonds each)
  { level: 36, xpThreshold: 34350, cumulativeXp: 34350, diamondReward: 30, isMilestone: false },
  { level: 37, xpThreshold: 36250, cumulativeXp: 36250, diamondReward: 30, isMilestone: false },
  { level: 38, xpThreshold: 38200, cumulativeXp: 38200, diamondReward: 30, isMilestone: false },
  { level: 39, xpThreshold: 40200, cumulativeXp: 40200, diamondReward: 30, isMilestone: false },

  // Level 40 (Milestone: +80 diamonds)
  { level: 40, xpThreshold: 42250, cumulativeXp: 42250, diamondReward: 80, isMilestone: true },

  // Level 41-44 (Regular levels: +30 diamonds each)
  { level: 41, xpThreshold: 44350, cumulativeXp: 44350, diamondReward: 30, isMilestone: false },
  { level: 42, xpThreshold: 46500, cumulativeXp: 46500, diamondReward: 30, isMilestone: false },
  { level: 43, xpThreshold: 48700, cumulativeXp: 48700, diamondReward: 30, isMilestone: false },
  { level: 44, xpThreshold: 50950, cumulativeXp: 50950, diamondReward: 30, isMilestone: false },

  // Level 45 (Milestone: +80 diamonds)
  { level: 45, xpThreshold: 53250, cumulativeXp: 53250, diamondReward: 80, isMilestone: true },

  // Level 46-49 (Regular levels: +30 diamonds each)
  { level: 46, xpThreshold: 55600, cumulativeXp: 55600, diamondReward: 30, isMilestone: false },
  { level: 47, xpThreshold: 58000, cumulativeXp: 58000, diamondReward: 30, isMilestone: false },
  { level: 48, xpThreshold: 60450, cumulativeXp: 60450, diamondReward: 30, isMilestone: false },
  { level: 49, xpThreshold: 62950, cumulativeXp: 62950, diamondReward: 30, isMilestone: false },

  // Level 50 (Max Level: Milestone +100 diamonds)
  { level: 50, xpThreshold: 65500, cumulativeXp: 65500, diamondReward: 100, isMilestone: true },
]

/**
 * Get level info for a specific level
 */
export function getLevelInfo(level: number): LevelInfo | null {
  if (level < 1 || level > 50) return null
  return LEVEL_THRESHOLDS[level - 1] || null
}

/**
 * Get level from total XP
 */
export function getLevelFromXp(totalXp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i].xpThreshold) {
      return LEVEL_THRESHOLDS[i].level
    }
  }
  return 1
}

/**
 * Calculate level progress for UI display
 */
export function getLevelProgress(currentXp: number, currentLevel: number): LevelProgress {
  const nextLevelInfo = getLevelInfo(Math.min(currentLevel + 1, 50))
  const currentLevelInfo = getLevelInfo(currentLevel)

  if (!nextLevelInfo || !currentLevelInfo) {
    return {
      currentLevel,
      currentXp,
      xpToNextLevel: 0,
      xpInCurrentLevel: 0,
      progressPercent: 100,
      nextLevel: LEVEL_THRESHOLDS[49], // Max level
    }
  }

  // Max level check
  if (currentLevel >= 50) {
    return {
      currentLevel,
      currentXp,
      xpToNextLevel: 0,
      xpInCurrentLevel: currentXp - currentLevelInfo.xpThreshold,
      progressPercent: 100,
      nextLevel: LEVEL_THRESHOLDS[49],
    }
  }

  const xpInCurrentLevel = currentXp - currentLevelInfo.xpThreshold
  const xpRangeForLevel = nextLevelInfo.xpThreshold - currentLevelInfo.xpThreshold
  const xpToNextLevel = nextLevelInfo.xpThreshold - currentXp
  const progressPercent = Math.min((xpInCurrentLevel / xpRangeForLevel) * 100, 100)

  return {
    currentLevel,
    currentXp,
    xpToNextLevel,
    xpInCurrentLevel,
    progressPercent,
    nextLevel: nextLevelInfo,
  }
}

/**
 * Check if adding XP will result in a level up
 * Returns array of levels gained and total diamond reward
 */
export function calculateLevelUp(
  currentXp: number,
  currentLevel: number,
  xpToAdd: number
): {
  newLevel: number
  levelsGained: number
  totalDiamondReward: number
  levelUps: { level: number; diamondReward: number; isMilestone: boolean }[]
} {
  const newTotalXp = currentXp + xpToAdd
  const newLevel = getLevelFromXp(newTotalXp)
  const levelsGained = newLevel - currentLevel

  if (levelsGained <= 0) {
    return {
      newLevel: currentLevel,
      levelsGained: 0,
      totalDiamondReward: 0,
      levelUps: [],
    }
  }

  const levelUps: { level: number; diamondReward: number; isMilestone: boolean }[] = []
  let totalDiamondReward = 0

  for (let i = currentLevel + 1; i <= newLevel; i++) {
    const levelInfo = getLevelInfo(i)
    if (levelInfo) {
      totalDiamondReward += levelInfo.diamondReward
      levelUps.push({
        level: levelInfo.level,
        diamondReward: levelInfo.diamondReward,
        isMilestone: levelInfo.isMilestone,
      })
    }
  }

  return {
    newLevel,
    levelsGained,
    totalDiamondReward,
    levelUps,
  }
}

/**
 * Get diamond reward for reaching a specific level
 */
export function getLevelUpReward(level: number): number {
  const levelInfo = getLevelInfo(level)
  return levelInfo?.diamondReward || 0
}

/**
 * Check if a level is a milestone level (every 5 levels)
 */
export function isMilestoneLevel(level: number): boolean {
  return level % 5 === 0
}

/**
 * Get XP reward for mission based on difficulty
 * Default values:
 * - EASY: 10 XP
 * - MEDIUM: 25 XP
 * - HARD: 50 XP
 */
export function getXpForDifficulty(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): number {
  switch (difficulty) {
    case 'EASY':
      return 10
    case 'MEDIUM':
      return 25
    case 'HARD':
      return 50
    default:
      return 10
  }
}

/**
 * Format XP for display (e.g., "1,250 XP")
 */
export function formatXp(xp: number): string {
  return xp.toLocaleString()
}

/**
 * Calculate tickets earned from an order
 * Formula: tickets = Math.floor(orderSubtotalGBP / 10)
 */
export function calculateTicketsEarned(orderSubtotalGBP: number): number {
  return Math.floor(orderSubtotalGBP / 10)
}

/**
 * Level system constants
 */
export const LEVEL_SYSTEM = {
  MAX_LEVEL: 50,
  BASE_XP: 100,
  XP_MULTIPLIER: 1.5,
  REGULAR_REWARD: 30,  // Diamonds for regular level up
  MILESTONE_REWARD: 80, // Diamonds for milestone level up (5, 10, 15, ...)
  MAX_LEVEL_REWARD: 100, // Special reward for reaching max level
  MILESTONE_INTERVAL: 5, // Every 5 levels is a milestone
} as const
