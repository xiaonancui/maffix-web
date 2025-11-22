import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MissionCard from '@/components/dashboard/MissionCard'
import MissionsHeader from '@/components/dashboard/MissionsHeader'
import { AlertTriangle } from 'lucide-react'

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
      diamondBalance: session.user.role === 'ADMIN' ? 10000 : 500,
    }

    missions = [
      // FOLLOW Missions
      {
        id: 'mission-follow-1',
        title: 'Follow Official Artist Account',
        description: 'Follow @maffix_official on TikTok to stay updated with latest releases and exclusive content',
        missionType: 'FOLLOW',
        targetTikTokAccount: '@maffix_official',
        diamonds: 50,
        points: 25,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '30 seconds',
      },
      {
        id: 'mission-follow-2',
        title: 'Follow Record Label Account',
        description: 'Follow @maffix_records on TikTok to discover new artists and upcoming releases',
        missionType: 'FOLLOW',
        targetTikTokAccount: '@maffix_records',
        diamonds: 50,
        points: 25,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '30 seconds',
      },
      {
        id: 'mission-follow-3',
        title: 'Follow Tour Updates Account',
        description: 'Follow @maffix_tour for exclusive behind-the-scenes content and tour announcements',
        missionType: 'FOLLOW',
        targetTikTokAccount: '@maffix_tour',
        diamonds: 75,
        points: 35,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '30 seconds',
      },

      // LIKE Missions
      {
        id: 'mission-like-1',
        title: 'Like New Single Release',
        description: 'Show your support by liking the official music video for "Midnight Dreams"',
        missionType: 'LIKE',
        targetVideoUrl: 'https://tiktok.com/@maffix_official/video/7234567890123',
        diamonds: 60,
        points: 30,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '1 minute',
      },
      {
        id: 'mission-like-2',
        title: 'Like Concert Announcement',
        description: 'Like the 2024 World Tour announcement video to show your excitement',
        missionType: 'LIKE',
        targetVideoUrl: 'https://tiktok.com/@maffix_tour/video/7234567890456',
        diamonds: 80,
        points: 40,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '1 minute',
      },
      {
        id: 'mission-like-3',
        title: 'Like Behind-the-Scenes Content',
        description: 'Like the exclusive studio session footage from the latest album recording',
        missionType: 'LIKE',
        targetVideoUrl: 'https://tiktok.com/@maffix_official/video/7234567890789',
        diamonds: 100,
        points: 50,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '1 minute',
      },
      {
        id: 'mission-like-4',
        title: 'Like Fan Appreciation Post',
        description: 'Like the special thank you message to fans for reaching 1M followers',
        missionType: 'LIKE',
        targetVideoUrl: 'https://tiktok.com/@maffix_official/video/7234567891012',
        diamonds: 50,
        points: 25,
        difficulty: 'EASY',
        isActive: true,
        estimatedTime: '30 seconds',
      },

      // REPOST Missions
      {
        id: 'mission-repost-1',
        title: 'Repost New Music Video',
        description: 'Share the official music video for "Midnight Dreams" to your profile and help spread the word',
        missionType: 'REPOST',
        targetVideoUrl: 'https://tiktok.com/@maffix_official/video/7234567890123',
        diamonds: 150,
        points: 75,
        difficulty: 'MEDIUM',
        isActive: true,
        estimatedTime: '2 minutes',
      },
      {
        id: 'mission-repost-2',
        title: 'Repost Concert Announcement',
        description: 'Repost the 2024 World Tour announcement to help your friends discover the tour dates',
        missionType: 'REPOST',
        targetVideoUrl: 'https://tiktok.com/@maffix_tour/video/7234567890456',
        diamonds: 200,
        points: 100,
        difficulty: 'MEDIUM',
        isActive: true,
        estimatedTime: '2 minutes',
      },
      {
        id: 'mission-repost-3',
        title: 'Repost Album Teaser',
        description: 'Share the exclusive album teaser to build hype for the upcoming release',
        missionType: 'REPOST',
        targetVideoUrl: 'https://tiktok.com/@maffix_official/video/7234567891345',
        diamonds: 250,
        points: 125,
        difficulty: 'MEDIUM',
        isActive: true,
        estimatedTime: '2 minutes',
      },
      {
        id: 'mission-repost-4',
        title: 'Repost Fan Challenge',
        description: 'Repost the #MaffixDanceChallenge video and encourage your followers to participate',
        missionType: 'REPOST',
        targetVideoUrl: 'https://tiktok.com/@maffix_official/video/7234567891678',
        diamonds: 300,
        points: 150,
        difficulty: 'MEDIUM',
        isActive: true,
        estimatedTime: '3 minutes',
      },

      // USE_AUDIO Missions
      {
        id: 'mission-audio-1',
        title: 'Create Video with "Midnight Dreams"',
        description: 'Create your own TikTok video using the "Midnight Dreams" audio track. Show us your creativity!',
        missionType: 'USE_AUDIO',
        targetAudioId: 'audio-midnight-dreams-7234567890',
        diamonds: 400,
        points: 200,
        difficulty: 'HARD',
        isActive: true,
        estimatedTime: '15 minutes',
      },
      {
        id: 'mission-audio-2',
        title: 'Dance Challenge with "Electric Nights"',
        description: 'Join the #ElectricNightsDance challenge by creating a video with the official audio',
        missionType: 'USE_AUDIO',
        targetAudioId: 'audio-electric-nights-7234567891',
        diamonds: 500,
        points: 250,
        difficulty: 'HARD',
        isActive: true,
        estimatedTime: '20 minutes',
      },
      {
        id: 'mission-audio-3',
        title: 'Lip Sync to "Heartbeat"',
        description: 'Create a lip sync video using the "Heartbeat" audio. Add your own style and effects!',
        missionType: 'USE_AUDIO',
        targetAudioId: 'audio-heartbeat-7234567892',
        diamonds: 350,
        points: 175,
        difficulty: 'MEDIUM',
        isActive: true,
        estimatedTime: '10 minutes',
      },
      {
        id: 'mission-audio-4',
        title: 'Cover "Acoustic Sessions"',
        description: 'Create your own cover or interpretation using the "Acoustic Sessions" audio track',
        missionType: 'USE_AUDIO',
        targetAudioId: 'audio-acoustic-sessions-7234567893',
        diamonds: 450,
        points: 225,
        difficulty: 'HARD',
        isActive: true,
        estimatedTime: '25 minutes',
      },
      {
        id: 'mission-audio-5',
        title: 'Remix Challenge with "Summer Vibes"',
        description: 'Create a creative video using the "Summer Vibes" remix. Show us your best summer moments!',
        missionType: 'USE_AUDIO',
        targetAudioId: 'audio-summer-vibes-7234567894',
        diamonds: 400,
        points: 200,
        difficulty: 'HARD',
        isActive: true,
        estimatedTime: '15 minutes',
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

  const getMissionTypeIcon = (type: string) => {
    switch (type) {
      case 'FOLLOW':
        return '👥'
      case 'LIKE':
        return '❤️'
      case 'REPOST':
        return '🔄'
      case 'USE_AUDIO':
        return '🎵'
      default:
        return '📋'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'HARD':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-border'
    }
  }

  const getStatusBadge = (missionId: string) => {
    const submission = userMissions.get(missionId)
    if (!submission) return null

    if (submission.verified) {
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
          ✓ Completed
        </span>
      )
    }

    if (submission.verificationStatus === 'PENDING') {
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
          ⏳ Verifying...
        </span>
      )
    }

    if (submission.verificationStatus === 'FAILED') {
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
          ✗ Failed
        </span>
      )
    }

    return null
  }

  // Group missions by type
  const missionsByType = missions.reduce((acc, mission) => {
    const type = mission.missionType || 'OTHER'
    if (!acc[type]) acc[type] = []
    acc[type].push(mission)
    return acc
  }, {} as Record<string, any[]>)

  const missionTypeNames = {
    FOLLOW: 'Follow Missions',
    LIKE: 'Like Missions',
    REPOST: 'Repost Missions',
    USE_AUDIO: 'Use Audio Missions',
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <MissionsHeader />

      {/* TikTok Connection Status */}
      {!user?.tiktokUsername && (
        <div className="mb-8 rounded-lg border-2 border-yellow-600 bg-transparent p-6 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-300">
                TikTok Account Not Linked
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                <p>
                  You need to link your TikTok account to complete missions and earn rewards.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href="/profile/link-tiktok"
                  className="inline-flex items-center rounded-md border-2 border-yellow-600 bg-transparent px-3 py-2 text-sm font-semibold text-yellow-600 hover:bg-yellow-600/10 transition-colors dark:bg-yellow-600 dark:text-primary-foreground dark:hover:bg-yellow-700"
                >
                  Link TikTok Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
                {user?.diamondBalance.toLocaleString() || 0}
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

      {/* Missions by Type */}
      {missions.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-12 text-center shadow">
          <p className="text-muted-foreground">No missions available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(missionsByType).map(([type, typeMissions]) => (
            <div key={type}>
              <h2 className="mb-4 text-xl font-bold text-foreground">
                {getMissionTypeIcon(type)} {missionTypeNames[type as keyof typeof missionTypeNames] || type}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(typeMissions as any[]).map((mission: any) => {
                  const submission = userMissions.get(mission.id)
                  const completionStatus = submission
                    ? submission.verified
                      ? 'APPROVED'
                      : submission.verificationStatus
                    : 'NOT_STARTED'

                  return (
                    <MissionCard
                      key={mission.id}
                      mission={{
                        ...mission,
                        completionStatus,
                      }}
                      hasTikTokLinked={!!user?.tiktokUsername}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

