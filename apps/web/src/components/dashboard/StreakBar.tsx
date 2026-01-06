'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface StreakBarProps {
  currentStreak: number
  className?: string
}

/**
 * StreakBar Component
 *
 * Displays a 7-day login streak visualization with:
 * - 7 circles representing each day
 * - Filled circles for completed days
 * - Escalating rewards display
 * - Day 7 bonus highlight
 */
export default function StreakBar({ currentStreak, className = '' }: StreakBarProps) {
  const baseRewards = [25, 30, 35, 40, 50, 60, 100]
  const normalizedStreak = Math.max(0, Math.min(currentStreak, 7))

  const streakDays = Array.from({ length: 7 }, (_, index) => {
    const day = index + 1
    return {
      day,
      completed: day <= normalizedStreak,
      reward: baseRewards[index],
      isBonus: day === 7,
    }
  })

  return (
    <div className={`rounded-lg border border-border bg-card p-6 shadow ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">7-Day Login Streak</h3>
          <p className="text-sm text-muted-foreground">
            Login daily to earn bonus rewards
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2">
          <span className="text-2xl">🔥</span>
          <span className="text-xl font-bold text-white">{normalizedStreak}</span>
        </div>
      </div>

      {/* Streak Visualization */}
      <div className="flex items-center justify-between gap-2">
        {streakDays.map((streakDay, index) => (
          <motion.div
            key={streakDay.day}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Circle */}
            <div
              className={`
                relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300
                ${
                  streakDay.completed
                    ? streakDay.isBonus
                      ? 'border-yellow-500 bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50'
                      : 'border-[#FF5656] bg-gradient-to-br from-[#FF5656] to-[#FF8888] shadow-md'
                    : 'border-border bg-muted'
                }
              `}
            >
              {/* Checkmark or Day Number */}
              {streakDay.completed ? (
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  {streakDay.day}
                </span>
              )}

              {/* Bonus Badge */}
              {streakDay.isBonus && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-yellow-900">
                  ⭐
                </div>
              )}
            </div>

            {/* Day Label */}
            <div className="text-center">
              <div className="text-xs font-medium text-muted-foreground">Day {streakDay.day}</div>
              <div
                className={`
                text-xs font-semibold
                ${
                  streakDay.isBonus
                    ? 'text-yellow-500'
                    : streakDay.completed
                      ? 'text-[#FF5656]'
                      : 'text-muted-foreground'
                }
              `}
              >
                {streakDay.reward}💎
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Text */}
      <div className="mt-4 text-center">
        {normalizedStreak === 0 && (
          <p className="text-sm text-muted-foreground">Start your streak by logging in today!</p>
        )}
        {normalizedStreak > 0 && normalizedStreak < 7 && (
          <p className="text-sm text-muted-foreground">
            {7 - normalizedStreak} day{7 - normalizedStreak !== 1 ? 's' : ''} until 100💎 bonus!
          </p>
        )}
        {normalizedStreak === 7 && (
          <p className="text-sm font-semibold text-yellow-500">
            🎉 Max streak reached! Keep logging in daily to maintain it!
          </p>
        )}
      </div>

      {/* Warning */}
      {normalizedStreak > 0 && (
        <div className="mt-4 rounded-md bg-orange-500/10 p-3 text-center">
          <p className="text-xs text-orange-600 dark:text-orange-400">
            ⚠️ Login tomorrow to keep your streak! Streaks reset if you miss a day.
          </p>
        </div>
      )}
    </div>
  )
}
