'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type TaskVerification = {
  id: string
  submittedAt: Date
  completedAt: Date | null
  verifiedAt: Date | null
  pointsEarned: number
  diamondsEarned: number
  user: {
    id: string
    name: string
    email: string
  }
  task: {
    id: string
    title: string
    description: string
    type: string
    difficulty: string
    points: number
    diamonds: number
  }
}

export default function TaskVerificationList({
  tasks,
  isPending,
}: {
  tasks: TaskVerification[]
  isPending: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleVerify = async (userTaskId: string, approved: boolean) => {
    setLoading(userTaskId)

    try {
      const response = await fetch(`/api/admin/tasks/${userTaskId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to verify task')
        return
      }

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Verification error:', error)
      alert('An error occurred')
    } finally {
      setLoading(null)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-background text-green-600 border border-green-600 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30 dark:shadow-sm dark:shadow-green-500/20'
      case 'MEDIUM':
        return 'bg-background text-yellow-600 border border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/30 dark:shadow-sm dark:shadow-yellow-500/20'
      case 'HARD':
        return 'bg-background text-red-600 border border-red-600 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30 dark:shadow-sm dark:shadow-red-500/20'
      default:
        return 'bg-background text-gray-600 border border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
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
    <div className="space-y-4">
      {tasks.map((item) => (
        <div
          key={item.id}
          className="rounded-lg bg-card border border-red-500/20 p-6 dark:shadow-lg shadow-red-500/20 transition-all hover:border-red-500/40 hover:shadow-red-500/30 hover:scale-[1.01]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(item.task.type)}</span>
                <h3 className="text-lg font-bold text-foreground">
                  {item.task.title}
                </h3>
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${getDifficultyColor(
                    item.task.difficulty
                  )}`}
                >
                  {item.task.difficulty}
                </span>
              </div>

              <p className="mb-3 text-sm text-gray-300">
                {item.task.description}
              </p>

              <div className="mb-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-300">User:</span>
                  <span className="text-gray-400">{item.user.name}</span>
                  <span className="text-gray-500">({item.user.email})</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-300">Rewards:</span>
                  <span className="text-gray-400">
                    💎 {item.diamondsEarned} | ⭐ {item.pointsEarned}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-300">Submitted:</span>
                  <span className="text-gray-400">
                    {new Date(item.submittedAt).toLocaleString()}
                  </span>
                </div>
                {item.verifiedAt && (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-300">Verified:</span>
                    <span className="text-gray-400">
                      {new Date(item.verifiedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isPending && (
              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => handleVerify(item.id, true)}
                  disabled={loading === item.id}
                  className="rounded-md border-2 border-green-600 bg-background px-4 py-2 text-sm font-bold text-green-600 hover:bg-green-600/10 disabled:opacity-50 transition-all hover:scale-105 dark:bg-green-600 dark:text-primary-foreground dark:border-transparent dark:shadow-lg dark:shadow-green-500/30 dark:hover:bg-green-500 dark:hover:shadow-green-500/50"
                >
                  {loading === item.id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : '✓ Approve'}
                </button>
                <button
                  onClick={() => handleVerify(item.id, false)}
                  disabled={loading === item.id}
                  className="rounded-md border-2 border-primary bg-background px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 disabled:opacity-50 transition-all hover:scale-105 dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:shadow-lg dark:shadow-red-500/30 dark:hover:shadow-red-500/50"
                >
                  {loading === item.id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : '✗ Reject'}
                </button>
              </div>
            )}

            {!isPending && (
              <div className="ml-4">
                <span className="inline-flex items-center gap-1 rounded-md bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400 border border-green-500/30 dark:shadow-sm shadow-green-500/20">
                  ● Verified
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

