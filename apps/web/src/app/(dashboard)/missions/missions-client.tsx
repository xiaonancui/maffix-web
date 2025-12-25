'use client'

import { useState } from 'react'
import MissionCard from '@/components/dashboard/MissionCard'
import MissionDetailModal from '@/components/dashboard/missions/MissionDetailModal'

interface MissionsClientProps {
  followMissions: any[]
  mainMissions: any[]
  userMissions: Map<string, any>
  hasTikTokLinked: boolean
  userId: string
}

export default function MissionsClient({
  followMissions,
  mainMissions,
  userMissions,
  hasTikTokLinked,
  userId,
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

  return (
    <>
      {/* Follow Missions Section */}
      {followMissions.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
            👥 Follow Missions
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {followMissions.map((mission) => (
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

      {/* Main Missions Section */}
      {mainMissions.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
            🎯 Main Missions
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mainMissions.map((mission) => (
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
