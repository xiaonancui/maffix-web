import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TaskVerificationList from '@/components/admin/TaskVerificationList'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

export default async function AdminTasksPage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Fetch pending task completions
  const pendingTasks = await db.userTask.findMany({
    where: {
      verified: false,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          difficulty: true,
          points: true,
          diamonds: true,
        },
      },
    },
    orderBy: {
      submittedAt: 'desc',
    },
  })

  // Fetch recently verified tasks
  const verifiedTasks = await db.userTask.findMany({
    where: {
      verified: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          difficulty: true,
          points: true,
          diamonds: true,
        },
      },
    },
    orderBy: {
      verifiedAt: 'desc',
    },
    take: 20,
  })

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Task Verification"
        description="Review and approve user task completions"
        badge={
          <span className="rounded-full bg-red-500/20 px-4 py-2 text-xs font-bold text-red-400 backdrop-blur-sm border border-red-500/30 shadow-lg shadow-red-500/20">
            {pendingTasks.length} Pending
          </span>
        }
      />

      {/* Pending Tasks */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-white">
          Pending Verification ({pendingTasks.length})
        </h2>
        {pendingTasks.length === 0 ? (
          <div className="rounded-lg bg-[#1a1a1a] border border-red-500/20 p-12 text-center shadow-lg shadow-red-500/20">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-gray-400">No pending tasks to verify</p>
          </div>
        ) : (
          <TaskVerificationList tasks={pendingTasks} isPending={true} />
        )}
      </div>

      {/* Recently Verified */}
      <div>
        <h2 className="mb-4 text-xl font-bold tracking-tight text-white">
          Recently Verified
        </h2>
        {verifiedTasks.length === 0 ? (
          <div className="rounded-lg bg-[#1a1a1a] border border-red-500/20 p-12 text-center shadow-lg shadow-red-500/20">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-400">No verified tasks yet</p>
          </div>
        ) : (
          <TaskVerificationList tasks={verifiedTasks} isPending={false} />
        )}
      </div>
    </div>
  )
}

