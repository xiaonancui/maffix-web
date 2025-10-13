import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import TaskVerificationList from '@/components/admin/TaskVerificationList'

export default async function AdminTasksPage() {
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
      completedAt: 'desc',
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Verification</h1>
          <p className="mt-2 text-sm text-gray-600">
            Review and approve user task completions
          </p>
        </div>

        {/* Pending Tasks */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Pending Verification ({pendingTasks.length})
          </h2>
          {pendingTasks.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow">
              <p className="text-gray-500">No pending tasks to verify</p>
            </div>
          ) : (
            <TaskVerificationList tasks={pendingTasks} isPending={true} />
          )}
        </div>

        {/* Recently Verified */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Recently Verified
          </h2>
          {verifiedTasks.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow">
              <p className="text-gray-500">No verified tasks yet</p>
            </div>
          ) : (
            <TaskVerificationList tasks={verifiedTasks} isPending={false} />
          )}
        </div>
      </div>
    </div>
  )
}

