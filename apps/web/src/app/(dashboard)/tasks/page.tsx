import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TaskSubmitButton from '@/components/dashboard/TaskSubmitButton'

export default async function TasksPage() {
  // Dynamic import to avoid build-time database connection
  const { db } = await import('@/lib/db')

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch active tasks
  let tasks: any[] = []
  let completedTaskIds = new Set<string>()

  const allowTestAccounts =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_ACCOUNTS === 'true'

  const isTestAccount =
    allowTestAccounts &&
    (session.user.id?.includes('test-') ||
      session.user.id?.includes('demo-') ||
      session.user.id?.includes('admin-'))

  if (isTestAccount) {
    // Mock tasks for test accounts
    tasks = [
      {
        id: 'task-1',
        title: 'Follow on Social Media',
        description: 'Follow our official account on social media',
        type: 'SOCIAL',
        difficulty: 'EASY',
        points: 10,
        diamonds: 5,
        isActive: true,
        completionCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'Write a Review',
        description: 'Write a review about our music',
        type: 'CONTENT',
        difficulty: 'MEDIUM',
        points: 50,
        diamonds: 25,
        isActive: true,
        completionCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-3',
        title: 'Daily Check-in',
        description: 'Check in daily to earn rewards',
        type: 'DAILY',
        difficulty: 'EASY',
        points: 5,
        diamonds: 2,
        isActive: true,
        completionCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  } else {
    try {
      tasks = await db.task.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // Fetch user's completed tasks
      const completedTasks = await db.userTask.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          taskId: true,
        },
      })

      completedTaskIds = new Set(completedTasks.map((t) => t.taskId))
    } catch (error) {
      console.error('Database fetch failed:', error)
      tasks = []
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HARD':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SOCIAL':
        return '👥'
      case 'CONTENT':
        return '✍️'
      case 'DAILY':
        return '📅'
      case 'PROFILE':
        return '👤'
      case 'REFERRAL':
        return '🔗'
      case 'PURCHASE':
        return '💳'
      case 'EVENT':
        return '🎉'
      default:
        return '📋'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Tasks</h1>
        <p className="mt-2 text-sm text-gray-600">
          Complete tasks to earn diamonds and points
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="text-gray-500">No tasks available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            const isCompleted = completedTaskIds.has(task.id)

            return (
              <div
                key={task.id}
                className={`rounded-lg bg-white p-6 shadow transition-all hover:shadow-lg ${
                  isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl">{getTypeIcon(task.type)}</span>
                    <span
                      className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(
                        task.difficulty
                      )}`}
                    >
                      {task.difficulty}
                    </span>
                  </div>
                  {isCompleted && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      ✓ Completed
                    </span>
                  )}
                </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {task.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600">{task.description}</p>

                <div className="mb-4 flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="mr-3">💎 {task.diamonds}</span>
                    <span>⭐ {task.points}</span>
                  </div>
                </div>

                {!isCompleted && (
                  <TaskSubmitButton taskId={task.id} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

