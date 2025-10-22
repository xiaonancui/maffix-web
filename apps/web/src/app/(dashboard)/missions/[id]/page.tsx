import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import MissionSubmitButton from '@/components/dashboard/MissionSubmitButton'

export default async function MissionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const missionId = params.id

  // Fetch mission details and user's submission status
  let mission: any = null
  let user: any = null
  let submission: any = null

  const isTestAccount =
    process.env.NODE_ENV === 'development' &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock data for test accounts
    user = {
      id: session.user.id,
      tiktokUsername: '@testuser',
      diamondBalance: 500,
    }

    mission = {
      id: missionId,
      title: 'Follow Artist on TikTok',
      description: 'Follow @artistname on TikTok to earn diamonds and support the artist',
      missionType: 'FOLLOW',
      targetTikTokAccount: '@artistname',
      targetVideoUrl: null,
      targetAudioId: null,
      diamonds: 50,
      points: 25,
      difficulty: 'EASY',
      isActive: true,
      requirements: [
        'You must have a TikTok account linked',
        'Follow the target account',
        'Keep following for at least 24 hours',
      ],
      instructions: [
        'Click the "Open TikTok" button below',
        'Follow the @artistname account',
        'Return here and click "Submit for Verification"',
        'Wait for automatic verification (usually takes 1-2 minutes)',
      ],
      estimatedTime: '1 minute',
      verificationTime: '1-2 minutes',
    }

    submission = null // No submission yet
  } else {
    try {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          tiktokUsername: true,
          tiktokUserId: true,
          diamondBalance: true,
        },
      })

      mission = await db.task.findUnique({
        where: { id: missionId },
      })

      if (!mission) {
        notFound()
      }

      // Check if user has already submitted this mission
      submission = await db.userTask.findFirst({
        where: {
          userId: session.user.id,
          taskId: missionId,
        },
      })
    } catch (error) {
      console.error('Database fetch failed:', error)
      notFound()
    }
  }

  if (!mission) {
    notFound()
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

  const getMissionTypeDescription = (type: string) => {
    switch (type) {
      case 'FOLLOW':
        return 'Follow the specified TikTok account'
      case 'LIKE':
        return 'Like the specified TikTok video'
      case 'REPOST':
        return 'Repost the specified video to your profile'
      case 'USE_AUDIO':
        return 'Create a video using the specified audio'
      default:
        return 'Complete the mission requirements'
    }
  }

  const getTargetUrl = () => {
    if (mission.missionType === 'FOLLOW' && mission.targetTikTokAccount) {
      return `https://www.tiktok.com/${mission.targetTikTokAccount}`
    }
    if (mission.targetVideoUrl) {
      return mission.targetVideoUrl
    }
    return 'https://www.tiktok.com'
  }

  const isCompleted = submission?.verified
  const isPending = submission && !submission.verified
  const canSubmit = user?.tiktokUsername && !submission

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/missions"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Missions
        </Link>
      </div>

      {/* Mission Header */}
      <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{getMissionTypeIcon(mission.missionType)}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{mission.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {getMissionTypeDescription(mission.missionType)}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-sm font-medium ${getDifficultyColor(
              mission.difficulty
            )}`}
          >
            {mission.difficulty}
          </span>
        </div>

        <p className="mb-6 text-gray-700">{mission.description}</p>

        {/* Rewards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm text-gray-600">Reward</div>
            <div className="mt-1 text-2xl font-bold text-blue-600">
              💎 {mission.diamonds}
            </div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-sm text-gray-600">Points</div>
            <div className="mt-1 text-2xl font-bold text-purple-600">
              ⭐ {mission.points}
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-sm text-gray-600">Est. Time</div>
            <div className="mt-1 text-2xl font-bold text-green-600">
              {mission.estimatedTime || '5 min'}
            </div>
          </div>
        </div>
      </div>

      {/* TikTok Not Linked Warning */}
      {!user?.tiktokUsername && (
        <div className="mb-8 rounded-lg border-2 border-red-300 bg-red-50 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
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
              <h3 className="text-sm font-medium text-red-800">
                TikTok Account Required
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>You must link your TikTok account before you can complete this mission.</p>
              </div>
              <div className="mt-4">
                <Link
                  href="/profile/link-tiktok"
                  className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Link TikTok Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Status */}
      {submission && (
        <div
          className={`mb-8 rounded-lg border-2 p-6 ${
            isCompleted
              ? 'border-green-300 bg-green-50'
              : isPending
              ? 'border-yellow-300 bg-yellow-50'
              : 'border-red-300 bg-red-50'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {isCompleted ? (
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3
                className={`text-sm font-medium ${
                  isCompleted ? 'text-green-800' : 'text-yellow-800'
                }`}
              >
                {isCompleted ? 'Mission Completed!' : 'Verification in Progress'}
              </h3>
              <div
                className={`mt-2 text-sm ${
                  isCompleted ? 'text-green-700' : 'text-yellow-700'
                }`}
              >
                {isCompleted ? (
                  <p>
                    You&apos;ve successfully completed this mission and earned {mission.diamonds} diamonds!
                  </p>
                ) : (
                  <p>
                    Your submission is being verified. This usually takes {mission.verificationTime || '1-5 minutes'}.
                    You&apos;ll be notified once verification is complete.
                  </p>
                )}
              </div>
              {submission.submittedAt && (
                <p className="mt-2 text-xs text-gray-600">
                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mission Instructions */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-900">How to Complete</h2>
        <ol className="space-y-3">
          {(mission.instructions || [
            'Open TikTok using the button below',
            'Complete the required action',
            'Return here and submit for verification',
          ]).map((instruction: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span className="text-gray-700">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Requirements */}
      {mission.requirements && mission.requirements.length > 0 && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Requirements</h2>
          <ul className="space-y-2">
            {mission.requirements.map((req: string, index: number) => (
              <li key={index} className="flex items-start">
                <svg
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        {canSubmit && (
          <>
            <a
              href={getTargetUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-md bg-black px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800"
            >
              Open TikTok →
            </a>
            <MissionSubmitButton missionId={mission.id} />
          </>
        )}

        {isPending && (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-md bg-gray-300 px-4 py-3 text-sm font-semibold text-gray-500"
          >
            Verification in Progress...
          </button>
        )}

        {isCompleted && (
          <Link
            href="/missions"
            className="block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Browse More Missions
          </Link>
        )}
      </div>
    </div>
  )
}
