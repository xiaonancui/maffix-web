'use client'

import Link from 'next/link'
import MissionSubmitButton from '@/components/dashboard/MissionSubmitButton'
import { Gem, Trophy, Clock, Sparkles } from 'lucide-react'

type MissionCompletionStatus = 'NOT_STARTED' | 'PENDING' | 'FAILED' | 'APPROVED' | string

export interface MissionCardData {
  id: string
  title: string
  description: string
  missionType?: string | null
  difficulty?: string | null
  diamonds?: number | null
  points?: number | null
  xpReward?: number | null
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
  FOLLOW: 'Follow',
  LIKE: 'Like',
  REPOST: 'Share',
  USE_AUDIO: 'Create',
  SETUP: 'Setup',
}

const missionTypeColors: Record<string, string> = {
  FOLLOW: '#00F5FF',
  LIKE: '#FF1F7D',
  REPOST: '#8B5CF6',
  USE_AUDIO: '#FFC700',
  SETUP: '#00F5FF',
}

const difficultyColors: Record<string, { text: string; bg: string; border: string }> = {
  EASY: { text: '#10B981', bg: '#10B981/20', border: '#10B981/40' },
  MEDIUM: { text: '#FFC700', bg: '#FFC700/20', border: '#FFC700/40' },
  HARD: { text: '#FF1F7D', bg: '#FF1F7D/20', border: '#FF1F7D/40' },
}

const statusStyles: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  NOT_STARTED: {
    label: 'Available',
    color: '#00F5FF',
    bgColor: 'bg-[#00F5FF]/10',
    borderColor: 'border-[#00F5FF]/40',
  },
  PENDING: {
    label: 'Verifying...',
    color: '#FFC700',
    bgColor: 'bg-[#FFC700]/10',
    borderColor: 'border-[#FFC700]/40',
  },
  FAILED: {
    label: 'Failed',
    color: '#FF1F7D',
    bgColor: 'bg-[#FF1F7D]/10',
    borderColor: 'border-[#FF1F7D]/40',
  },
  APPROVED: {
    label: 'Completed',
    color: '#10B981',
    bgColor: 'bg-[#10B981]/10',
    borderColor: 'border-[#10B981]/40',
  },
}

const getMissionTypeLabel = (type?: string | null) => {
  if (!type) return 'Mission'
  return missionTypeLabels[type] || type
}

const getMissionTypeColor = (type?: string | null) => {
  if (!type) return '#8B5CF6'
  return missionTypeColors[type] || '#8B5CF6'
}

// Get estimated time based on mission type if not provided
const getEstimatedTime = (mission: MissionCardData) => {
  if (mission.estimatedTime) return mission.estimatedTime

  // Default estimates based on mission type
  switch (mission.missionType) {
    case 'FOLLOW':
      return '30 secs'
    case 'LIKE':
      return '1 min'
    case 'REPOST':
      return '2 mins'
    case 'USE_AUDIO':
      return '15 mins'
    case 'SETUP':
      return '2 mins'
    default:
      return '5 mins'
  }
}

export default function MissionCard({ mission, hasTikTokLinked, onViewDetail }: MissionCardProps) {
  const statusKey = (mission.completionStatus || 'NOT_STARTED').toUpperCase()
  const statusConfig = statusStyles[statusKey] || statusStyles.NOT_STARTED
  const showSubmit = statusKey === 'NOT_STARTED'
  const isCompleted = statusKey === 'APPROVED'
  const isPending = statusKey === 'PENDING'
  const hasRewards = (mission.diamonds || 0) > 0 || (mission.points || 0) > 0
  const isDaily = mission.recurrence === 'DAILY'
  const missionTypeColor = getMissionTypeColor(mission.missionType)
  const estimatedTime = getEstimatedTime(mission)

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br to-transparent blur-3xl transition-all duration-700 group-hover:scale-150"
        style={{ backgroundColor: `${missionTypeColor}15` }}
      />

      <div className="relative space-y-4 p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* Mission Type Badge */}
            <div
              className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 ring-1 ring-white/20"
              style={{ backgroundColor: `${missionTypeColor}15`, color: missionTypeColor }}
            >
              <span className="font-display text-xs font-bold uppercase tracking-wider">
                {getMissionTypeLabel(mission.missionType)}
              </span>
            </div>
            <h3 className="font-display text-lg font-black text-white">{mission.title}</h3>
          </div>

          {/* Right Side Badges */}
          <div className="flex flex-col items-end gap-2">
            {/* Difficulty Badge */}
            {mission.difficulty && (
              <span
                className="rounded-full border px-3 py-1 font-display text-xs font-bold uppercase tracking-wider"
                style={{
                  color: difficultyColors[mission.difficulty]?.text || '#8B5CF6',
                  backgroundColor: `${difficultyColors[mission.difficulty]?.text || '#8B5CF6'}15`,
                  borderColor: `${difficultyColors[mission.difficulty]?.text || '#8B5CF6'}40`,
                }}
              >
                {mission.difficulty}
              </span>
            )}
            {/* Daily Badge */}
            {isDaily && (
              <span className="flex items-center gap-1 rounded-full border border-[#FF1F7D]/40 bg-[#FF1F7D]/10 px-3 py-1 font-display text-xs font-bold text-[#FF1F7D]">
                <Sparkles className="h-3 w-3" />
                Daily
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-white/60">{mission.description}</p>

        {/* Estimated Time Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <Clock className="h-3.5 w-3.5 text-[#00F5FF]" />
            <span className="font-display text-xs font-bold text-white/70">
              Est. {estimatedTime}
            </span>
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center rounded-full border px-3 py-1.5 ${statusConfig.bgColor} ${statusConfig.borderColor}`}
          >
            <span
              className="font-display text-xs font-bold"
              style={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Rewards */}
        {hasRewards && (
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#FF1F7D]/20 p-2 ring-1 ring-[#FF1F7D]/30">
                <Gem className="h-5 w-5 text-[#FF1F7D]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-white/50">Diamonds</p>
                <p className="font-display text-lg font-black tabular-nums text-white">{mission.diamonds ?? 0}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#8B5CF6]/20 p-2 ring-1 ring-[#8B5CF6]/30">
                <Trophy className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-white/50">Points</p>
                <p className="font-display text-lg font-black tabular-nums text-white">{mission.points ?? 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="relative border-t border-white/10 p-4">
        <div className="flex gap-3">
          {/* View Details Button - Always shown */}
          <button
            onClick={onViewDetail}
            className="flex-1 rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-[#00F5FF]/40 hover:bg-[#00F5FF]/10 hover:text-[#00F5FF]"
          >
            View Details
          </button>

          {/* Action Button */}
          {renderAction({
            showSubmit,
            statusKey,
            hasTikTokLinked,
            missionId: mission.id,
            isCompleted,
            isPending,
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
  isCompleted,
  isPending,
}: {
  showSubmit: boolean
  statusKey: string
  hasTikTokLinked: boolean
  missionId: string
  isCompleted: boolean
  isPending: boolean
}) {
  if (showSubmit) {
    if (!hasTikTokLinked) {
      return (
        <Link
          href="/profile/link-tiktok"
          className="flex flex-1 items-center justify-center rounded-2xl border-2 border-[#00F5FF]/40 bg-[#00F5FF]/10 px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-[#00F5FF] transition-all duration-300 hover:border-[#00F5FF]/60 hover:bg-[#00F5FF]/20"
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

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-[#FFC700]/40 bg-[#FFC700]/10 px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-[#FFC700]">
        Verifying...
      </div>
    )
  }

  if (statusKey === 'FAILED') {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-[#FF1F7D]/40 bg-[#FF1F7D]/10 px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-[#FF1F7D]">
        Failed
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-[#10B981]/40 bg-[#10B981]/10 px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-[#10B981]">
        Completed
      </div>
    )
  }

  return null
}

