'use client'

import { useState } from 'react'
import MissionCard from '@/components/dashboard/MissionCard'
import MissionDetailModal from '@/components/dashboard/missions/MissionDetailModal'
import StreakBar from '@/components/dashboard/StreakBar'

interface MissionsClientProps {
  followMissions: any[]
  mainMissions: any[]
  userMissions: Map<string, any>
  hasTikTokLinked: boolean
  userId: string
  streakCount?: number
}

export default function MissionsClient({
  followMissions,
  mainMissions,
  userMissions,
  hasTikTokLinked,
  userId,
  streakCount = 0,
}: MissionsClientProps) {
  const [selectedMission, setSelectedMission] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleViewDetail = (mission: any) => {
    setSelectedMission(mission)
    setModalOpen(true)
  }

  const getCompletionStatus = (missionId: string) => {
    const submission = userMissions.get(missionId)
    return submission
      ? submission.verified
        ? 'APPROVED'
        : submission.verificationStatus
      : 'NOT_STARTED'
  }

  // Group missions by recurrence type
  const dailyMissions = [...followMissions, ...mainMissions].filter(
    (m) => m.recurrence === 'DAILY'
  )
  const oneTimeMissions = [...followMissions, ...mainMissions].filter(
    (m) => m.recurrence !== 'DAILY'
  )

  return (
    <>
      {/* Streak Bar */}
      <div className="mb-8">
        <StreakBar currentStreak={streakCount} />
      </div>

      {/* Daily Hustle Section */}
      {dailyMissions.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              ⚡ Daily Hustle
            </h2>
            <span className="text-sm text-muted-foreground">
              Resets daily at 00:00 UTC
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dailyMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={{
                  ...mission,
                  completionStatus: getCompletionStatus(mission.id),
                }}
                hasTikTokLinked={hasTikTokLinked}
                onViewDetail={() => handleViewDetail(mission)}
              />
            ))}
          </div>
        </div>
      )}

      {/* One-Time Missions Section */}
      {oneTimeMissions.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
            🎯 One-Time Missions
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {oneTimeMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={{
                  ...mission,
                  completionStatus: getCompletionStatus(mission.id),
                }}
                hasTikTokLinked={hasTikTokLinked}
                onViewDetail={() => handleViewDetail(mission)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {dailyMissions.length === 0 && oneTimeMissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No missions available</h3>
          <p className="text-muted-foreground">Check back later for new missions!</p>
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
