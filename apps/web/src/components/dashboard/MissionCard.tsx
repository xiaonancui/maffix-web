'use client'

import Link from 'next/link'
import MissionSubmitButton from '@/components/dashboard/MissionSubmitButton'

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
}

interface MissionCardProps {
  mission: MissionCardData
  hasTikTokLinked: boolean
}

const missionTypeLabels: Record<string, string> = {
  FOLLOW: 'Follow Mission',
  LIKE: 'Like Mission',
  REPOST: 'Repost Mission',
  USE_AUDIO: 'Use Audio Mission',
}

const difficultyClasses: Record<string, string> = {
  EASY: 'border-green-600 bg-green-900/20 text-green-400',
  MEDIUM: 'border-yellow-600 bg-yellow-900/20 text-yellow-400',
  HARD: 'border-red-600 bg-red-900/20 text-red-400',
}

const statusStyles: Record<string, { label: string; className: string }> = {
  NOT_STARTED: {
    label: 'Available',
    className: 'border-blue-600 bg-blue-900/20 text-blue-400',
  },
  PENDING: {
    label: 'Verification Pending',
    className: 'border-yellow-600 bg-yellow-900/20 text-yellow-400',
  },
  FAILED: {
    label: 'Verification Failed',
    className: 'border-red-600 bg-red-900/20 text-red-400',
  },
  APPROVED: {
    label: 'Completed',
    className: 'border-green-600 bg-green-900/20 text-green-400',
  },
}

const getMissionTypeLabel = (type?: string | null) => {
  if (!type) return 'Mission'
  return missionTypeLabels[type] || type
}

const getDifficultyBadgeClasses = (difficulty?: string | null) => {
  if (!difficulty) {
    return 'border-gray-600 bg-gray-800 text-gray-400'
  }
  return difficultyClasses[difficulty] || 'border-gray-600 bg-gray-800 text-gray-400'
}

const sanitizeTikTokAccount = (account?: string | null) => {
  if (!account) return null
  return account.startsWith('@') ? account.slice(1) : account
}

export default function MissionCard({ mission, hasTikTokLinked }: MissionCardProps) {
  const statusKey = (mission.completionStatus || 'NOT_STARTED').toUpperCase()
  const statusConfig = statusStyles[statusKey] || statusStyles.NOT_STARTED
  const showSubmit = statusKey === 'NOT_STARTED'
  const completionLabel = statusConfig.label
  const accountSlug = sanitizeTikTokAccount(mission.targetTikTokAccount)
  const accountUrl = accountSlug ? `https://www.tiktok.com/@${accountSlug}` : null
  const hasRewards = (mission.diamonds || 0) > 0 || (mission.points || 0) > 0

  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-sm transition-all hover:shadow-md hover:border-[#FF5656]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {getMissionTypeLabel(mission.missionType)}
            </p>
            <h3 className="mt-1 text-lg font-bold text-white">{mission.title}</h3>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyBadgeClasses(
              mission.difficulty
            )}`}
          >
            {mission.difficulty || 'UNKNOWN'}
          </span>
        </div>

        <p className="text-sm text-gray-300">{mission.description}</p>

        {hasRewards && (
          <div className="grid grid-cols-2 gap-3 rounded-md border border-gray-700 bg-gray-800 p-3 text-sm">
            <div>
              <p className="text-xs uppercase text-gray-400">Diamonds</p>
              <p className="text-base font-semibold text-white">{mission.diamonds ?? 0}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400">Points</p>
              <p className="text-base font-semibold text-white">{mission.points ?? 0}</p>
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-300">
          {mission.estimatedTime && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Estimated time</span>
              <span className="font-medium text-white">~{mission.estimatedTime}</span>
            </div>
          )}

          {mission.targetTikTokAccount && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-400">Target account</span>
              {accountUrl ? (
                <Link
                  href={accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-medium text-[#FF5656] hover:underline"
                >
                  @{accountSlug}
                </Link>
              ) : (
                <span className="truncate font-medium text-white">{mission.targetTikTokAccount}</span>
              )}
            </div>
          )}

          {mission.targetVideoUrl && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-400">Target video</span>
              <Link
                href={mission.targetVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-medium text-[#FF5656] hover:underline"
              >
                View on TikTok
              </Link>
            </div>
          )}

          {mission.targetAudioId && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-400">Audio ID</span>
              <span className="truncate font-medium text-white">{mission.targetAudioId}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.className}`}>
            {completionLabel}
          </span>
          {mission.estimatedTime && (
            <span className="text-xs text-gray-400">Typical completion: ~{mission.estimatedTime}</span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/missions/${mission.id}`}
            className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            View Details
          </Link>
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
          className="inline-flex flex-1 items-center justify-center rounded-md border border-blue-600 bg-blue-900/20 px-4 py-2 text-sm font-semibold text-blue-400 transition-colors hover:bg-blue-900/30"
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
      <div className="flex-1 rounded-md border border-yellow-600 bg-yellow-900/20 px-4 py-2 text-center text-sm text-yellow-400">
        ⏳ Verifying...
      </div>
    )
  }

  if (statusKey === 'FAILED') {
    return (
      <div className="flex-1 rounded-md border border-red-600 bg-red-900/20 px-4 py-2 text-center text-sm text-red-400">
        ✗ Failed
      </div>
    )
  }

  if (statusKey === 'APPROVED') {
    return (
      <div className="flex-1 rounded-md border border-green-600 bg-green-900/20 px-4 py-2 text-center text-sm text-green-400">
        ✓ Completed
      </div>
    )
  }

  return null
}

