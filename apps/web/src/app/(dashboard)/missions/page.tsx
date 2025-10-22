import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MissionCard from '@/components/dashboard/MissionCard'

export default async function MissionsPage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user's TikTok connection status
  let user
  let missions: any[] = []
  let userMissions = new Map<string, any>()

  const isTestAccount =
    process.env.NODE_ENV === 'development' &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
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
  } else {
    try {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          tiktokUsername: true,
          diamondBalance: true,
        },
      })

      // Fetch active missions
      missions = await db.task.findMany({
        where: {
          isActive: true,
          missionType: { not: null },
        },
        orderBy: {
          diamonds: 'desc',
        },
      })

      // Fetch user's mission submissions
      const submissions = await db.userTask.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          taskId: true,
          verified: true,
          verificationStatus: true,
          submittedAt: true,
        },
      })

      submissions.forEach((sub) => {
        userMissions.set(sub.taskId, sub)
      })
    } catch (error) {
      console.error('Database fetch failed:', error)
      user = { id: session.user.id, tiktokUsername: null, diamondBalance: 0 }
      missions = []
    }
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
        return 'bg-gray-100 text-gray-800 border-gray-300'
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">TikTok Missions</h1>
        <p className="mt-2 text-sm text-gray-600">
          Complete TikTok promotional missions to earn diamonds and support your favorite artists
        </p>
      </div>

      {/* TikTok Connection Status */}
      {!user?.tiktokUsername && (
        <div className="mb-8 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                TikTok Account Not Linked
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You need to link your TikTok account to complete missions and earn rewards.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href="/profile/link-tiktok"
                  className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
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
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">💎</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Your Diamonds</p>
              <p className="text-xl font-semibold text-gray-900">
                {user?.diamondBalance.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-xl font-semibold text-gray-900">
                {userMissions.size}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-xl font-semibold text-gray-900">
                {missions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Missions by Type */}
      {missions.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="text-gray-500">No missions available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(missionsByType).map(([type, typeMissions]) => (
            <div key={type}>
              <h2 className="mb-4 text-xl font-bold text-gray-900">
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

