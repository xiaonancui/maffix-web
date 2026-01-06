import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MissionCard from '@/components/dashboard/MissionCard'
import MissionsHeader from '@/components/dashboard/MissionsHeader'
import MissionDetailModal from '@/components/dashboard/missions/MissionDetailModal'
import MissionsClient from './missions-client'

export default async function MissionsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Use mock data for all users (database not connected)
  let user
  let missions: any[] = []
  let userMissions = new Map<string, any>()

  // Always use mock data
  if (true) {
    // Mock data for test accounts
    user = {
      id: session.user.id,
      tiktokUsername: null, // Not linked yet
      diamonds: session.user.role === 'ADMIN' ? 10000 : 500,
      streakCount: 3, // Mock streak for testing
    }

    missions = [
      // Follow Missions (simplified category)
      {
        id: 'mission-follow-1',
        title: 'Follow Official Artist Account',
        description: 'Follow our main account to stay updated with latest releases and exclusive content',
        missionType: 'FOLLOW',
        targetTikTokAccount: '@maffix_official',
        diamonds: 50,
        points: 25,
        xpReward: 10,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '30 seconds',
        recurrence: 'DAILY', // Daily mission
      },
      {
        id: 'mission-follow-2',
        title: 'Follow Record Label Account',
        description: 'Discover new artists and upcoming releases from our label',
        missionType: 'FOLLOW',
        targetTikTokAccount: '@maffix_records',
        diamonds: 50,
        points: 25,
        xpReward: 10,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '30 seconds',
        recurrence: 'DAILY', // Daily mission
      },

      // Main Missions (simplified category - LIKE, REPOST, USE_AUDIO all merged here)
      {
        id: 'mission-like-1',
        title: 'Like New Single Release',
        description: 'Show your support by liking the official music video',
        missionType: 'LIKE',
        targetVideoUrl: 'https://tiktok.com/@maffix_official/video/7234567890123',
        diamonds: 60,
        points: 30,
        xpReward: 10,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '1 minute',
        recurrence: 'ONCE', // One-time mission
      },
      {
        id: 'mission-like-2',
        title: 'Like Concert Announcement',
        description: 'Like the World Tour announcement video to show your excitement',
        missionType: 'LIKE',
        targetVideoUrl: 'https://tiktok.com/@maffix_tour/video/7234567890456',
        diamonds: 80,
        points: 40,
        xpReward: 10,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '1 minute',
        recurrence: 'DAILY', // Daily mission
      },
      {
        id: 'mission-repost-1',
        title: 'Share Music Video',
        description: 'Share the official music video to your profile and help spread the word',
        missionType: 'REPOST',
        targetVideoUrl: 'https://tiktok.com/@maffix_official/video/7234567890123',
        diamonds: 150,
        points: 75,
        xpReward: 25,
        difficulty: 'MEDIUM',
        isActive: true,
        estimatedTime: '2 minutes',
        recurrence: 'ONCE', // One-time mission
      },
      {
        id: 'mission-repost-2',
        title: 'Share Tour Announcement',
        description: 'Share the tour announcement to help your friends discover the dates',
        missionType: 'REPOST',
        targetVideoUrl: 'https://tiktok.com/@maffix_tour/video/7234567890456',
        diamonds: 200,
        points: 100,
        xpReward: 25,
        difficulty: 'MEDIUM',
        isActive: true,
        estimatedTime: '2 minutes',
        recurrence: 'ONCE', // One-time mission
      },
      {
        id: 'mission-audio-1',
        title: 'Create Video with Official Audio',
        description: 'Create your own video using our audio track. Show us your creativity!',
        missionType: 'USE_AUDIO',
        targetAudioId: 'audio-midnight-dreams-7234567890',
        diamonds: 400,
        points: 200,
        xpReward: 50,
        difficulty: 'HARD',
        isActive: true,
        estimatedTime: '15 minutes',
        recurrence: 'ONCE', // One-time mission
      },
      {
        id: 'mission-audio-2',
        title: 'Dance Challenge Video',
        description: 'Join the dance challenge by creating a video with the official audio',
        missionType: 'USE_AUDIO',
        targetAudioId: 'audio-electric-nights-7234567891',
        diamonds: 500,
        points: 250,
        xpReward: 50,
        difficulty: 'HARD',
        isActive: true,
        estimatedTime: '20 minutes',
        recurrence: 'ONCE', // One-time mission
      },
    ]

    // Mock user mission statuses to show different states
    userMissions.set('mission-follow-1', {
      taskId: 'mission-follow-1',
      verified: true,
      verificationStatus: 'APPROVED',
      submittedAt: new Date('2024-01-15'),
    })
    userMissions.set('mission-like-1', {
      taskId: 'mission-like-1',
      verified: true,
      verificationStatus: 'APPROVED',
      submittedAt: new Date('2024-01-16'),
    })
    userMissions.set('mission-follow-2', {
      taskId: 'mission-follow-2',
      verified: false,
      verificationStatus: 'PENDING',
      submittedAt: new Date(),
    })
    userMissions.set('mission-like-2', {
      taskId: 'mission-like-2',
      verified: false,
      verificationStatus: 'PENDING',
      submittedAt: new Date(),
    })
  }

  // Group missions by category (Follow vs Main)
  const followMissions = missions.filter((m) => m.missionType === 'FOLLOW')
  const mainMissions = missions.filter((m) => m.missionType !== 'FOLLOW')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <MissionsHeader streakCount={user?.streakCount || 0} />

      {/* User Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-card border border-border p-4 shadow hover:border-[#FF5656] transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">💎</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Your Diamonds</p>
              <p className="text-xl font-semibold text-foreground">
                {user?.diamonds.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card border border-border p-4 shadow hover:border-[#FF5656] transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-xl font-semibold text-foreground">
                {userMissions.size}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card border border-border p-4 shadow hover:border-[#FF5656] transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Available</p>
              <p className="text-xl font-semibold text-foreground">
                {missions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component for Interactive Elements */}
      <MissionsClient
        followMissions={followMissions}
        mainMissions={mainMissions}
        userMissions={userMissions}
        hasTikTokLinked={!!user?.tiktokUsername}
        userId={user.id}
        streakCount={user?.streakCount || 0}
      />
    </div>
  )
}

