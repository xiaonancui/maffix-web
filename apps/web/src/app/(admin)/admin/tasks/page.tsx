import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TaskVerificationList from '@/components/admin/TaskVerificationList'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

export default async function AdminTasksPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Use mock data for all users (database not connected)
  const pendingTasks = [
    {
      id: 'user-task-1',
      userId: 'user-1',
      taskId: 'task-1',
      verified: false,
      verificationStatus: 'PENDING',
      submittedAt: new Date('2024-01-20T10:30:00'),
      completedAt: new Date('2024-01-20T10:30:00'),
      verifiedAt: null,
      pointsEarned: 50,
      diamondsEarned: 100,
      proofUrl: 'https://www.tiktok.com/@user/video/1234567890',
      user: {
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
      },
      task: {
        id: 'task-1',
        title: 'Follow Official TikTok Account',
        description: 'Follow @maffix_official on TikTok',
        type: 'FOLLOW',
        difficulty: 'EASY',
        points: 50,
        diamonds: 100,
      },
    },
    {
      id: 'user-task-2',
      userId: 'user-2',
      taskId: 'task-2',
      verified: false,
      verificationStatus: 'PENDING',
      submittedAt: new Date('2024-01-20T09:15:00'),
      completedAt: new Date('2024-01-20T09:15:00'),
      verifiedAt: null,
      pointsEarned: 30,
      diamondsEarned: 60,
      proofUrl: 'https://www.tiktok.com/@user2/video/9876543210',
      user: {
        id: 'user-2',
        name: 'Mike Chen',
        email: 'mike@example.com',
      },
      task: {
        id: 'task-2',
        title: 'Like New Single Release',
        description: 'Like the latest music video on TikTok',
        type: 'LIKE',
        difficulty: 'EASY',
        points: 30,
        diamonds: 60,
      },
    },
    {
      id: 'user-task-3',
      userId: 'user-3',
      taskId: 'task-3',
      verified: false,
      verificationStatus: 'PENDING',
      submittedAt: new Date('2024-01-19T18:45:00'),
      completedAt: new Date('2024-01-19T18:45:00'),
      verifiedAt: null,
      pointsEarned: 200,
      diamondsEarned: 400,
      proofUrl: 'https://www.tiktok.com/@user3/video/5555555555',
      user: {
        id: 'user-3',
        name: 'Emma Davis',
        email: 'emma@example.com',
      },
      task: {
        id: 'task-3',
        title: 'Create Video with "Midnight Dreams"',
        description: 'Create a TikTok video using the song "Midnight Dreams"',
        type: 'USE_AUDIO',
        difficulty: 'HARD',
        points: 200,
        diamonds: 400,
      },
    },
  ]

  const verifiedTasks = [
    {
      id: 'user-task-4',
      userId: 'user-4',
      taskId: 'task-4',
      verified: true,
      verificationStatus: 'APPROVED',
      submittedAt: new Date('2024-01-19T14:20:00'),
      completedAt: new Date('2024-01-19T14:20:00'),
      verifiedAt: new Date('2024-01-19T15:00:00'),
      pointsEarned: 100,
      diamondsEarned: 150,
      proofUrl: 'https://www.tiktok.com/@user4/video/1111111111',
      user: {
        id: 'user-4',
        name: 'Alex Martinez',
        email: 'alex@example.com',
      },
      task: {
        id: 'task-4',
        title: 'Repost New Music Video',
        description: 'Repost the latest music video to your TikTok',
        type: 'REPOST',
        difficulty: 'MEDIUM',
        points: 100,
        diamonds: 150,
      },
    },
    {
      id: 'user-task-5',
      userId: 'user-5',
      taskId: 'task-5',
      verified: true,
      verificationStatus: 'APPROVED',
      submittedAt: new Date('2024-01-19T12:00:00'),
      completedAt: new Date('2024-01-19T12:00:00'),
      verifiedAt: new Date('2024-01-19T13:30:00'),
      pointsEarned: 50,
      diamondsEarned: 100,
      proofUrl: 'https://www.tiktok.com/@user5/video/2222222222',
      user: {
        id: 'user-5',
        name: 'Lisa Wang',
        email: 'lisa@example.com',
      },
      task: {
        id: 'task-5',
        title: 'Follow Official TikTok Account',
        description: 'Follow @maffix_official on TikTok',
        type: 'FOLLOW',
        difficulty: 'EASY',
        points: 50,
        diamonds: 100,
      },
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Task Verification"
        description="Review and approve user task completions"
        badge={
          <span className="rounded-full bg-red-500/20 px-4 py-2 text-xs font-bold text-red-400 backdrop-blur-sm border border-red-500/30 dark:shadow-lg dark:shadow-red-500/20">
            {pendingTasks.length} Pending
          </span>
        }
      />

      {/* Pending Tasks */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
          Pending Verification ({pendingTasks.length})
        </h2>
        {pendingTasks.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-12 text-center dark:shadow-lg dark:shadow-red-500/20">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-muted-foreground">No pending tasks to verify</p>
          </div>
        ) : (
          <TaskVerificationList tasks={pendingTasks} isPending={true} />
        )}
      </div>

      {/* Recently Verified */}
      <div>
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
          Recently Verified
        </h2>
        {verifiedTasks.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-12 text-center dark:shadow-lg dark:shadow-red-500/20">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-muted-foreground">No verified tasks yet</p>
          </div>
        ) : (
          <TaskVerificationList tasks={verifiedTasks} isPending={false} />
        )}
      </div>
    </div>
  )
}

