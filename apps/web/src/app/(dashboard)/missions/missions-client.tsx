'use client'

import { useState } from 'react'
import MissionDetailModal from '@/components/dashboard/missions/MissionDetailModal'
import {
  Gem,
  CheckCircle,
  Clock,
  Zap,
  ArrowRight,
  Award,
  Sparkles,
  Target,
  Music,
  Heart,
  Share2,
  UserPlus,
  Flame,
} from 'lucide-react'

interface MissionsClientProps {
  missions: any[]
  userMissions: Map<string, any>
  hasTikTokLinked: boolean
  userId: string
  streakCount?: number
}

export default function MissionsClient({
  missions,
  userMissions,
  hasTikTokLinked,
  userId,
  streakCount = 0,
}: MissionsClientProps) {
  const [selectedMission, setSelectedMission] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'once' | 'completed'>('all')

  const handleViewDetail = (mission: any) => {
    setSelectedMission(mission)
    setModalOpen(true)
  }

  // Mission type icons and labels
  const getMissionTypeConfig = (type: string) => {
    switch (type) {
      case 'FOLLOW':
        return { icon: UserPlus, label: 'Follow', color: '#00F5FF' }
      case 'LIKE':
        return { icon: Heart, label: 'Like', color: '#FF1F7D' }
      case 'REPOST':
        return { icon: Share2, label: 'Share', color: '#8B5CF6' }
      case 'USE_AUDIO':
        return { icon: Music, label: 'Create', color: '#FFC700' }
      case 'SETUP':
        return { icon: Zap, label: 'Setup', color: '#00F5FF' }
      default:
        return { icon: Target, label: 'Mission', color: '#8B5CF6' }
    }
  }

  // Status-based color config (CRITICAL: Based on mission status, not difficulty)
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED': // Completed missions - GREEN
        return {
          color: '#10B981',
          glow: 'rgba(16, 185, 129, 0.4)',
          border: 'border-emerald-500/30',
          hoverBorder: 'hover:border-emerald-500/60',
          hoverShadow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]',
        }
      case 'PENDING': // Pending verification - YELLOW/GOLD
        return {
          color: '#FFC700',
          glow: 'rgba(255, 199, 0, 0.4)',
          border: 'border-[#FFC700]/30',
          hoverBorder: 'hover:border-[#FFC700]/60',
          hoverShadow: 'hover:shadow-[0_0_40px_rgba(255,199,0,0.5)]',
        }
      case 'NOT_STARTED': // Not started - RED/HOT PINK
      default:
        return {
          color: '#FF1F7D',
          glow: 'rgba(255, 31, 125, 0.4)',
          border: 'border-[#FF1F7D]/30',
          hoverBorder: 'hover:border-[#FF1F7D]/60',
          hoverShadow: 'hover:shadow-[0_0_40px_rgba(255,31,125,0.5)]',
        }
    }
  }

  const getCompletionStatus = (missionId: string) => {
    const submission = userMissions.get(missionId)
    return submission
      ? submission.verified
        ? 'APPROVED'
        : submission.verificationStatus
      : 'NOT_STARTED'
  }

  // Filter missions by tab
  const dailyMissions = missions.filter((m) => m.recurrence === 'DAILY')
  const oneTimeMissions = missions.filter((m) => m.recurrence === 'ONCE')
  const completedMissions = missions.filter((m) => {
    const status = userMissions.get(m.id)
    return status?.verified
  })

  const getFilteredMissions = () => {
    switch (activeTab) {
      case 'daily':
        return dailyMissions
      case 'once':
        return oneTimeMissions
      case 'completed':
        return completedMissions
      default:
        return missions
    }
  }

  const filteredMissions = getFilteredMissions()

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'All Quests', count: missions.length, icon: Target },
    { id: 'daily', label: 'Daily', count: dailyMissions.length, icon: Flame },
    { id: 'once', label: 'One-Time', count: oneTimeMissions.length, icon: Sparkles },
    { id: 'completed', label: 'Completed', count: completedMissions.length, icon: CheckCircle },
  ]

  return (
    <>
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group relative flex items-center gap-3 rounded-2xl border px-6 py-4 font-display text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'border-[#FF1F7D]/60 bg-gradient-to-br from-[#FF1F7D]/20 to-[#8B5CF6]/10 text-white shadow-lg shadow-[#FF1F7D]/30 backdrop-blur-xl'
                    : 'border-white/10 bg-surface-card/50 text-white/60 backdrop-blur-xl hover:border-white/20 hover:bg-surface-card/80 hover:text-white/90'
                }`}
              >
                {/* Active glow */}
                {isActive && (
                  <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF1F7D]/20 to-[#8B5CF6]/20 opacity-50 blur-xl" />
                )}

                <Icon className={`relative h-5 w-5 ${isActive ? 'text-[#FF1F7D]' : ''}`} />
                <span className="relative whitespace-nowrap">{tab.label}</span>
                <div
                  className={`relative rounded-full px-2.5 py-0.5 font-display text-xs font-black tabular-nums ${
                    isActive
                      ? 'bg-[#FF1F7D]/30 text-white ring-1 ring-[#FF1F7D]/50'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {tab.count}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mission Grid */}
      {filteredMissions.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMissions.map((mission, index) => {
            const typeConfig = getMissionTypeConfig(mission.missionType)
            const TypeIcon = typeConfig.icon
            const status = getCompletionStatus(mission.id)
            const statusConfig = getStatusConfig(status)
            const isCompleted = status === 'APPROVED'
            const isPending = status === 'PENDING'
            const isAvailable = status === 'NOT_STARTED'

            return (
              <div
                key={mission.id}
                className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-surface-card/90 to-surface-raised/80 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] ${statusConfig.border} ${statusConfig.hoverBorder} ${statusConfig.hoverShadow}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Ambient glow */}
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br to-transparent blur-3xl transition-all duration-700 group-hover:scale-150"
                  style={{ backgroundColor: `${statusConfig.color}20` }}
                />

                {/* Hover overlay */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${statusConfig.color}10, transparent, transparent)` }}
                />

                {/* Status Badge - Top Right Corner */}
                {isCompleted && (
                  <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 backdrop-blur-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="font-display text-xs font-bold text-emerald-400">DONE</span>
                  </div>
                )}
                {isPending && (
                  <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-[#FFC700]/40 bg-[#FFC700]/20 px-3 py-1.5 backdrop-blur-sm">
                    <Clock className="h-4 w-4 animate-pulse text-[#FFC700]" />
                    <span className="font-display text-xs font-bold text-[#FFC700]">PENDING</span>
                  </div>
                )}

                {/* Card Content */}
                <div className="relative p-6">
                  {/* Reward Section - HERO */}
                  <div className="mb-6 text-center">
                    <div className="mb-3 flex items-center justify-center">
                      <div
                        className="rounded-2xl p-4 ring-2 ring-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                        style={{
                          backgroundColor: `${statusConfig.color}15`,
                        }}
                      >
                        <Gem
                          className="h-8 w-8"
                          style={{ color: statusConfig.color }}
                        />
                      </div>
                    </div>
                    <div className="font-display text-4xl font-black tabular-nums text-white">
                      {mission.diamonds.toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm font-bold uppercase tracking-wider text-white/50">
                      Diamonds
                    </div>

                    {/* Additional Rewards Row */}
                    <div className="mt-3 flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1 text-[#8B5CF6]">
                        <Award className="h-4 w-4" />
                        <span className="font-display text-sm font-bold tabular-nums">
                          {mission.points}
                        </span>
                      </div>
                      <div className="h-4 w-px bg-white/10" />
                      <div className="flex items-center gap-1 text-[#00F5FF]">
                        <Zap className="h-4 w-4" />
                        <span className="font-display text-sm font-bold tabular-nums">
                          {mission.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="mb-4 flex items-center gap-2">
                    {/* Mission Type Badge */}
                    <div
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 ring-1 ring-white/20"
                      style={{
                        backgroundColor: `${typeConfig.color}15`,
                        color: typeConfig.color,
                      }}
                    >
                      <TypeIcon className="h-3.5 w-3.5" />
                      <span className="font-display text-xs font-bold uppercase tracking-wider">
                        {typeConfig.label}
                      </span>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20">
                      <span className="font-display text-xs font-bold uppercase tracking-wider text-white/70">
                        {mission.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 font-display text-xl font-black text-white">
                    {mission.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 line-clamp-2 text-sm text-white/60">{mission.description}</p>

                  {/* Time Estimate */}
                  <div className="mb-4 flex items-center gap-2 text-white/50">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{mission.estimatedTime}</span>
                  </div>

                  {/* CTA Button */}
                  {!hasTikTokLinked ? (
                    <button
                      onClick={() => handleViewDetail(mission)}
                      disabled
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-display text-sm font-bold text-white/40 backdrop-blur-sm"
                    >
                      Link TikTok to Unlock
                    </button>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleViewDetail(mission)}
                      className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 font-display text-sm font-bold text-emerald-400 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                    >
                      View Details
                    </button>
                  ) : isPending ? (
                    <button
                      onClick={() => handleViewDetail(mission)}
                      className="w-full rounded-2xl border border-[#FFC700]/30 bg-[#FFC700]/10 px-6 py-3 font-display text-sm font-bold text-[#FFC700] backdrop-blur-sm transition-all duration-300 hover:border-[#FFC700]/50 hover:bg-[#FFC700]/20"
                    >
                      Check Status
                    </button>
                  ) : (
                    <button
                      onClick={() => handleViewDetail(mission)}
                      className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF1F7D] to-[#B200FF] px-6 py-3 font-display text-sm font-bold text-white shadow-lg shadow-[#FF1F7D]/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FF1F7D]/60"
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        Start Mission
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </button>
                  )}
                </div>

                {/* Completed Overlay */}
                {isCompleted && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/30 p-12 text-center backdrop-blur-xl">
          <div className="mb-4 rounded-full bg-[#8B5CF6]/10 p-6 ring-1 ring-[#8B5CF6]/30">
            <Target className="h-12 w-12 text-[#8B5CF6]" />
          </div>
          <h3 className="mb-2 font-display text-2xl font-black text-white">No missions here</h3>
          <p className="text-white/60">
            {activeTab === 'completed'
              ? 'Complete missions to see them here!'
              : 'Check back later for new quests!'}
          </p>
        </div>
      )}

      {/* Mission Detail Modal */}
      {selectedMission && (
        <MissionDetailModal
          mission={selectedMission}
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open)
            if (!open) setSelectedMission(null)
          }}
          hasTikTokLinked={hasTikTokLinked}
          userId={userId}
        />
      )}
    </>
  )
}
