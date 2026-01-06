'use client'

import Link from 'next/link'
import MissionSubmitButton from '@/components/dashboard/MissionSubmitButton'
import { Gem, Trophy } from 'lucide-react'

type MissionCompletionStatus = 'NOT_STARTED' | 'PENDING' | 'FAILED' | 'APPROVED' | string

export interface MissionCardData {
  id: string
  title: string
  description: string
  missionType?: string | null
  difficulty?: string | null
  diamonds?: number | null
  points?: number | null
  estimatedTime?: string | null
  completionStatus?: MissionCompletionStatus | null
  targetTikTokAccount?: string | null
  targetVideoUrl?: string | null
  targetAudioId?: string | null
  recurrence?: string | null // "DAILY", "WEEKLY", "ONCE"
}

interface MissionCardProps {
  mission: MissionCardData
  hasTikTokLinked: boolean
  onViewDetail?: () => void
}

const missionTypeLabels: Record<string, string> = {
  FOLLOW: 'Follow Mission',
  LIKE: 'Like Mission',
  REPOST: 'Repost Mission',
  USE_AUDIO: 'Use Audio Mission',
}

const difficultyClasses: Record<string, string> = {
  EASY: 'border-green-600 bg-background text-green-600 dark:bg-green-900/20 dark:text-green-400',
  MEDIUM: 'border-yellow-600 bg-background text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  HARD: 'border-red-600 bg-background text-red-600 dark:bg-red-900/20 dark:text-red-400',
}

const statusStyles: Record<string, { label: string; className: string }> = {
  NOT_STARTED: {
    label: 'Available',
    className: 'border-blue-600 bg-background text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  },
  PENDING: {
    label: 'Verification Pending',
    className: 'border-yellow-600 bg-background text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  FAILED: {
    label: 'Verification Failed',
    className: 'border-red-600 bg-background text-red-600 dark:bg-red-900/20 dark:text-red-400',
  },
  APPROVED: {
    label: 'Completed',
    className: 'border-green-600 bg-background text-green-600 dark:bg-green-900/20 dark:text-green-400',
  },
}

const getMissionTypeLabel = (type?: string | null) => {
  if (!type) return 'Mission'
  return missionTypeLabels[type] || type
}

const getDifficultyBadgeClasses = (difficulty?: string | null) => {
  if (!difficulty) {
    return 'border-gray-600 bg-background text-gray-600 dark:bg-secondary dark:text-muted-foreground'
  }
  return difficultyClasses[difficulty] || 'border-gray-600 bg-background text-gray-600 dark:bg-secondary dark:text-muted-foreground'
}

const sanitizeTikTokAccount = (account?: string | null) => {
  if (!account) return null
  return account.startsWith('@') ? account.slice(1) : account
}

export default function MissionCard({ mission, hasTikTokLinked, onViewDetail }: MissionCardProps) {
  const statusKey = (mission.completionStatus || 'NOT_STARTED').toUpperCase()
  const statusConfig = statusStyles[statusKey] || statusStyles.NOT_STARTED
  const showSubmit = statusKey === 'NOT_STARTED'
  const completionLabel = statusConfig.label
  const accountSlug = sanitizeTikTokAccount(mission.targetTikTokAccount)
  const accountUrl = accountSlug ? `https://www.tiktok.com/@${accountSlug}` : null
  const hasRewards = (mission.diamonds || 0) > 0 || (mission.points || 0) > 0
  const isDaily = mission.recurrence === 'DAILY'

  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-border bg-secondary p-6 shadow-sm transition-all hover:shadow-md hover:border-primary">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {getMissionTypeLabel(mission.missionType)}
            </p>
            <h3 className="mt-1 text-lg font-bold text-foreground">{mission.title}</h3>
          </div>
          <div className="flex flex-col gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyBadgeClasses(
                mission.difficulty
              )}`}
            >
              {mission.difficulty || 'UNKNOWN'}
            </span>
            {isDaily && (
              <span className="rounded-full border border-orange-600 bg-background px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 flex items-center gap-1">
                ⚡ Daily
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{mission.description}</p>

        {hasRewards && (
          <div className="grid grid-cols-2 gap-3 rounded-md border border-border bg-card p-3 text-sm">
            <div className="flex items-center gap-2">
              <Gem className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs uppercase text-muted-foreground">Diamonds</p>
                <p className="text-base font-semibold text-foreground">{mission.diamonds ?? 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs uppercase text-muted-foreground">Points</p>
                <p className="text-base font-semibold text-foreground">{mission.points ?? 0}</p>
              </div>
            </div>
          </div>
        )}

        {isDaily && (
          <div className="rounded-md bg-orange-500/10 p-2 text-center">
            <p className="text-xs text-orange-600 dark:text-orange-400">
              ⏰ Resets daily at 00:00 UTC
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.className}`}>
          {completionLabel}
        </span>

        <div className="flex gap-2">
          <button
            onClick={onViewDetail}
            className="flex-1 rounded-md border-2 border-border bg-background px-4 py-2 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary hover:border-primary dark:bg-card"
          >
            View Details
          </button>
          {renderAction({
            showSubmit,
            statusKey,
            hasTikTokLinked,
            missionId: mission.id,
          })}
        </div>
      </div>
    </div>
  )
}

function renderAction({
  showSubmit,
  statusKey,
  hasTikTokLinked,
  missionId,
}: {
  showSubmit: boolean
  statusKey: string
  hasTikTokLinked: boolean
  missionId: string
}) {
  if (showSubmit) {
    if (!hasTikTokLinked) {
      return (
        <Link
          href="/profile/link-tiktok"
          className="inline-flex flex-1 items-center justify-center rounded-md border-2 border-blue-600 bg-background px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-600/10 dark:bg-blue-600 dark:text-primary-foreground dark:hover:bg-blue-700"
        >
          Link TikTok
        </Link>
      )
    }

    return (
      <div className="flex-1">
        <MissionSubmitButton missionId={missionId} />
      </div>
    )
  }

  if (statusKey === 'PENDING') {
    return (
      <div className="flex-1 rounded-md border-2 border-yellow-600 bg-background px-4 py-2 text-center text-sm font-semibold text-yellow-600 dark:bg-yellow-600 dark:text-primary-foreground">
        ⏳ Verifying...
      </div>
    )
  }

  if (statusKey === 'FAILED') {
    return (
      <div className="flex-1 rounded-md border-2 border-red-600 bg-background px-4 py-2 text-center text-sm font-semibold text-red-600 dark:bg-red-600 dark:text-primary-foreground">
        ✗ Failed
      </div>
    )
  }

  if (statusKey === 'APPROVED') {
    return (
      <div className="flex-1 rounded-md border-2 border-green-600 bg-background px-4 py-2 text-center text-sm font-semibold text-green-600 dark:bg-green-600 dark:text-primary-foreground">
        ✓ Completed
      </div>
    )
  }

  return null
}

