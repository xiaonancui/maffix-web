'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  FileText,
  Calendar,
  UserCircle,
  Link,
  CreditCard,
  Sparkles,
  ClipboardList,
  Heart,
  Music,
  Repeat
} from 'lucide-react'

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
        return 'border-2 border-[#10B981]/40 bg-[#10B981]/20 text-[#10B981] shadow-lg shadow-[#10B981]/20'
      case 'MEDIUM':
        return 'border-2 border-[#FFC700]/40 bg-[#FFC700]/20 text-[#FFC700] shadow-lg shadow-[#FFC700]/20'
      case 'HARD':
        return 'border-2 border-[#FF1F7D]/40 bg-[#FF1F7D]/20 text-[#FF1F7D] shadow-lg shadow-[#FF1F7D]/20'
      default:
        return 'border-2 border-white/20 bg-white/10 text-white/60 shadow-lg shadow-white/10'
    }
  }

  const getTypeIcon = (type: string) => {
    const iconProps = { className: "h-5 w-5" }

    switch (type) {
      case 'SOCIAL':
      case 'FOLLOW':
        return <Users {...iconProps} />
      case 'CONTENT':
        return <FileText {...iconProps} />
      case 'DAILY':
        return <Calendar {...iconProps} />
      case 'PROFILE':
        return <UserCircle {...iconProps} />
      case 'REFERRAL':
        return <Link {...iconProps} />
      case 'PURCHASE':
        return <CreditCard {...iconProps} />
      case 'EVENT':
        return <Sparkles {...iconProps} />
      case 'LIKE':
        return <Heart {...iconProps} />
      case 'USE_AUDIO':
        return <Music {...iconProps} />
      case 'REPOST':
        return <Repeat {...iconProps} />
      default:
        return <ClipboardList {...iconProps} />
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((item, index) => (
        <div
          key={item.id}
          className={`group relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.01] ${
            isPending
              ? 'border-[#FF1F7D]/30 hover:border-[#FF1F7D]/60 hover:shadow-[0_0_40px_rgba(255,31,125,0.3)]'
              : 'border-[#10B981]/30 hover:border-[#10B981]/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]'
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Ambient glow */}
          <div
            className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br to-transparent blur-3xl opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-150 ${
              isPending ? 'from-[#FF1F7D]/20' : 'from-[#10B981]/20'
            }`}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Title row */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex-shrink-0 rounded-2xl bg-white/10 p-3 text-white ring-2 ring-white/20 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
                  {getTypeIcon(item.task.type)}
                </div>
                <h3 className="font-display text-lg font-black text-white">
                  {item.task.title}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 font-display text-xs font-black uppercase tracking-wider ${getDifficultyColor(
                    item.task.difficulty
                  )}`}
                >
                  {item.task.difficulty}
                </span>
              </div>

              {/* Submitted Date Tag - Key Element */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-2xl border-2 border-[#8B5CF6]/40 bg-gradient-to-r from-[#8B5CF6]/20 to-[#8B5CF6]/10 px-4 py-2 font-display text-xs font-black uppercase tracking-wider text-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20 backdrop-blur-sm">
                <Calendar className="h-4 w-4" />
                <span>{new Date(item.submittedAt).toLocaleDateString()} {new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* User info */}
              <div className="mb-3 flex items-center gap-2 text-sm">
                <span className="font-display font-bold uppercase tracking-wider text-white/70">User:</span>
                <span className="font-bold text-white">{item.user.name}</span>
              </div>

              {/* Rewards & Verified timestamp */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {/* Rewards */}
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold uppercase tracking-wider text-white/70">Rewards:</span>
                  <span className="font-bold tabular-nums text-[#00F5FF]">
                    💎 {item.diamondsEarned}
                  </span>
                  <span className="text-white/30">|</span>
                  <span className="font-bold tabular-nums text-[#FFC700]">
                    ⭐ {item.pointsEarned}
                  </span>
                </div>

                {/* Verified timestamp */}
                {item.verifiedAt && (
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold uppercase tracking-wider text-white/70">Verified:</span>
                    <span className="font-medium text-white/60">
                      {new Date(item.verifiedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {isPending && (
              <div className="flex flex-shrink-0 gap-3">
                <button
                  onClick={() => handleVerify(item.id, true)}
                  disabled={loading === item.id}
                  className="group/btn relative overflow-hidden rounded-2xl border-2 border-[#10B981]/40 bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#10B981]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#10B981]/60 hover:shadow-[#10B981]/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading === item.id ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="text-[#10B981]">✓ Approve</span>
                  )}
                </button>
                <button
                  onClick={() => handleVerify(item.id, false)}
                  disabled={loading === item.id}
                  className="group/btn relative overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading === item.id ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="text-[#FF1F7D]">✗ Reject</span>
                  )}
                </button>
              </div>
            )}

            {/* Verified badge */}
            {!isPending && (
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#10B981]/40 bg-[#10B981]/20 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-[#10B981] shadow-lg shadow-[#10B981]/20">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]" />
                  Verified
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

