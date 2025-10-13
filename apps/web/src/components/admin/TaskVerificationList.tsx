'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type TaskVerification = {
  id: string
  completedAt: Date
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
    <div className="space-y-4">
      {tasks.map((item) => (
        <div
          key={item.id}
          className="rounded-lg bg-white p-6 shadow transition-all hover:shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(item.task.type)}</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.task.title}
                </h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(
                    item.task.difficulty
                  )}`}
                >
                  {item.task.difficulty}
                </span>
              </div>

              <p className="mb-3 text-sm text-gray-600">
                {item.task.description}
              </p>

              <div className="mb-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">User:</span>
                  <span className="text-gray-600">{item.user.name}</span>
                  <span className="text-gray-400">({item.user.email})</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Rewards:</span>
                  <span className="text-gray-600">
                    💎 {item.diamondsEarned} | ⭐ {item.pointsEarned}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <span className="text-gray-600">
                    {new Date(item.completedAt).toLocaleString()}
                  </span>
                </div>
                {item.verifiedAt && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Verified:</span>
                    <span className="text-gray-600">
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
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
                >
                  {loading === item.id ? 'Processing...' : '✓ Approve'}
                </button>
                <button
                  onClick={() => handleVerify(item.id, false)}
                  disabled={loading === item.id}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {loading === item.id ? 'Processing...' : '✗ Reject'}
                </button>
              </div>
            )}

            {!isPending && (
              <div className="ml-4">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  ✓ Verified
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

