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
  EASY: 'border-green-200 bg-green-50 text-green-700',
  MEDIUM: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  HARD: 'border-red-200 bg-red-50 text-red-700',
}

const statusStyles: Record<string, { label: string; className: string }> = {
  NOT_STARTED: {
    label: 'Available',
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  PENDING: {
    label: 'Verification Pending',
    className: 'border-yellow-300 bg-yellow-100 text-yellow-800',
  },
  FAILED: {
    label: 'Verification Failed',
    className: 'border-red-300 bg-red-100 text-red-800',
  },
  APPROVED: {
    label: 'Completed',
    className: 'border-green-300 bg-green-100 text-green-800',
  },
}

const getMissionTypeLabel = (type?: string | null) => {
  if (!type) return 'Mission'
  return missionTypeLabels[type] || type
}

const getDifficultyBadgeClasses = (difficulty?: string | null) => {
  if (!difficulty) {
    return 'border-gray-200 bg-gray-50 text-gray-600'
  }
  return difficultyClasses[difficulty] || 'border-gray-200 bg-gray-50 text-gray-600'
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
    <div className="flex h-full flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {getMissionTypeLabel(mission.missionType)}
            </p>
            <h3 className="mt-1 text-lg font-bold text-gray-900">{mission.title}</h3>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyBadgeClasses(
              mission.difficulty
            )}`}
          >
            {mission.difficulty || 'UNKNOWN'}
          </span>
        </div>

        <p className="text-sm text-gray-600">{mission.description}</p>

        {hasRewards && (
          <div className="grid grid-cols-2 gap-3 rounded-md border border-gray-100 bg-gray-50 p-3 text-sm">
            <div>
              <p className="text-xs uppercase text-gray-500">Diamonds</p>
              <p className="text-base font-semibold text-gray-900">{mission.diamonds ?? 0}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500">Points</p>
              <p className="text-base font-semibold text-gray-900">{mission.points ?? 0}</p>
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          {mission.estimatedTime && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Estimated time</span>
              <span className="font-medium text-gray-900">~{mission.estimatedTime}</span>
            </div>
          )}

          {mission.targetTikTokAccount && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500">Target account</span>
              {accountUrl ? (
                <Link
                  href={accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-medium text-blue-600 hover:underline"
                >
                  @{accountSlug}
                </Link>
              ) : (
                <span className="truncate font-medium text-gray-900">{mission.targetTikTokAccount}</span>
              )}
            </div>
          )}

          {mission.targetVideoUrl && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500">Target video</span>
              <Link
                href={mission.targetVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-medium text-blue-600 hover:underline"
              >
                View on TikTok
              </Link>
            </div>
          )}

          {mission.targetAudioId && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500">Audio ID</span>
              <span className="truncate font-medium text-gray-900">{mission.targetAudioId}</span>
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
            <span className="text-xs text-gray-500">Typical completion: ~{mission.estimatedTime}</span>
          )}
        </div>

        {renderAction({
          showSubmit,
          statusKey,
          hasTikTokLinked,
          missionId: mission.id,
        })}
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
          className="inline-flex w-full items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
        >
          Link TikTok account to start
        </Link>
      )
    }

    return <MissionSubmitButton missionId={missionId} />
  }

  if (statusKey === 'PENDING') {
    return (
      <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
        Submission received. Verification typically completes within 15 minutes.
      </div>
    )
  }

  if (statusKey === 'FAILED') {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
        Verification failed. Please review your submission or contact support for assistance.
      </div>
    )
  }

  if (statusKey === 'APPROVED') {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
        Rewards granted. Great job!
      </div>
    )
  }

  return null
}

