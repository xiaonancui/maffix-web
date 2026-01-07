import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MissionCard from '@/components/dashboard/MissionCard'
import MissionsHeader from '@/components/dashboard/MissionsHeader'
import MissionDetailModal from '@/components/dashboard/missions/MissionDetailModal'
import MissionsClient from './missions-client'
import { Gem, CheckCircle, Target, Flame, Trophy } from 'lucide-react'

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
        description:
          'Follow our main account to stay updated with latest releases and exclusive content',
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

  // Add TikTok linking mission if not linked
  if (!user?.tiktokUsername) {
    missions.unshift({
      id: 'mission-tiktok-link',
      title: 'Link Your TikTok Account',
      description: 'Connect your TikTok account to unlock all missions and start earning diamonds',
      missionType: 'SETUP',
      targetUrl: '/profile/link-tiktok',
      diamonds: 100,
      points: 50,
      xpReward: 20,
      difficulty: 'EASY',
      isActive: true,
      estimatedTime: '2 minutes',
      recurrence: 'ONCE',
    })
  }

  // Calculate stats
  const completedCount = Array.from(userMissions.values()).filter((m) => m.verified).length
  const pendingCount = Array.from(userMissions.values()).filter(
    (m) => !m.verified && m.verificationStatus === 'PENDING'
  ).length
  const availableCount = missions.length
  const completionPercentage = Math.round((completedCount / availableCount) * 100)

  // Calculate total potential rewards
  const totalDiamonds = missions.reduce((sum, m) => sum + m.diamonds, 0)
  const earnedDiamonds = missions
    .filter((m) => {
      const status = userMissions.get(m.id)
      return status?.verified
    })
    .reduce((sum, m) => sum + m.diamonds, 0)

  return (
    <div className="relative min-h-screen">
      {/* Animated background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-[#FF1F7D]/10 blur-3xl" />
        <div
          className="absolute -right-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-[#8B5CF6]/10 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-[#00F5FF]/10 blur-3xl"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Progress */}
        <div className="mb-8 animate-fade-in-up">
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-4xl font-black text-white md:text-5xl">
                    Missions
                  </h1>
                  {user?.streakCount > 0 && (
                    <div className="flex items-center gap-2 rounded-full border border-[#FF1F7D]/30 bg-[#FF1F7D]/10 px-4 py-2 backdrop-blur-sm">
                      <Flame className="h-5 w-5 text-[#FF1F7D]" />
                      <span className="font-display text-lg font-black tabular-nums text-white">
                        {user.streakCount}
                      </span>
                      <span className="text-sm font-bold text-white/70">Day Streak</span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-white/60">
                  Complete missions. Earn diamonds. Unlock legendary rewards.
                </p>
              </div>

              {/* Mini Stats */}
              <div className="hidden items-center gap-4 lg:flex">
                <div className="text-center">
                  <div className="font-display text-2xl font-black tabular-nums text-[#FFC700]">
                    {earnedDiamonds}
                  </div>
                  <div className="text-xs text-white/50">Earned</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <div className="font-display text-2xl font-black tabular-nums text-[#8B5CF6]">
                    {totalDiamonds}
                  </div>
                  <div className="text-xs text-white/50">Total</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <section
          className="mb-12 animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Diamonds Stat */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#FF1F7D]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FF1F7D]/60 hover:shadow-[0_0_40px_rgba(255,31,125,0.4)]">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF1F7D]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-center gap-4">
                <div className="rounded-xl bg-[#FF1F7D]/20 p-3 ring-1 ring-[#FF1F7D]/30 transition-transform duration-300 group-hover:scale-110">
                  <Gem className="h-8 w-8 text-[#FF1F7D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#FF1F7D]">Your Diamonds</p>
                  <p className="font-display text-3xl font-black tabular-nums text-white">
                    {user?.diamonds.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Stat */}
            <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-emerald-500/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-center gap-4">
                <div className="rounded-xl bg-emerald-500/20 p-3 ring-1 ring-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Completed</p>
                  <p className="font-display text-3xl font-black tabular-nums text-white">
                    {completedCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Available Stat */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#8B5CF6]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-center gap-4">
                <div className="rounded-xl bg-[#8B5CF6]/20 p-3 ring-1 ring-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-110">
                  <Target className="h-8 w-8 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#8B5CF6]">Available</p>
                  <p className="font-display text-3xl font-black tabular-nums text-white">
                    {availableCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Stat */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#FFC700]/30 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-[#FFC700]/60 hover:shadow-[0_0_40px_rgba(255,199,0,0.4)]">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#FFC700]/20 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150" />

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFC700]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-center gap-4">
                <div className="rounded-xl bg-[#FFC700]/20 p-3 ring-1 ring-[#FFC700]/30 transition-transform duration-300 group-hover:scale-110">
                  <Trophy className="h-8 w-8 text-[#FFC700]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#FFC700]">Progress</p>
                  <p className="font-display text-3xl font-black tabular-nums text-white">
                    {completionPercentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Grid - Pass data to Client Component */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <MissionsClient
            missions={missions}
            userMissions={userMissions}
            hasTikTokLinked={!!user?.tiktokUsername}
            userId={user.id}
            streakCount={user?.streakCount || 0}
          />
        </div>
      </div>
    </div>
  )
}
