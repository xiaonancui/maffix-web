'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, X, Clock, Image as ImageIcon, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Submission {
  id: string
  submittedAt: Date
  screenshotUrl: string | null
  verificationStatus: string
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  task: {
    id: string
    title: string
    description: string
    missionType: string | null
    difficulty: string
    diamonds: number
    points: number
    xpReward: number | null
  }
}

interface VerificationClientProps {
  initialSubmissions: Submission[]
}

export default function VerificationClient({ initialSubmissions }: VerificationClientProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [processing, setProcessing] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const router = useRouter()

  const handleApprove = async (submissionId: string) => {
    setProcessing((prev) => new Set(prev).add(submissionId))

    try {
      const response = await fetch('/api/admin/missions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTaskId: submissionId,
          action: 'approve',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve submission')
      }

      // Remove from list
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
    } catch (error) {
      console.error('Approve error:', error)
      alert('Failed to approve submission')
    } finally {
      setProcessing((prev) => {
        const newSet = new Set(prev)
        newSet.delete(submissionId)
        return newSet
      })
    }
  }

  const handleReject = async (submissionId: string) => {
    const reason = prompt('Enter rejection reason (optional):')

    setProcessing((prev) => new Set(prev).add(submissionId))

    try {
      const response = await fetch('/api/admin/missions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTaskId: submissionId,
          action: 'reject',
          reason,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject submission')
      }

      // Remove from list
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
    } catch (error) {
      console.error('Reject error:', error)
      alert('Failed to reject submission')
    } finally {
      setProcessing((prev) => {
        const newSet = new Set(prev)
        newSet.delete(submissionId)
        return newSet
      })
    }
  }

  const handleBatchApprove = async () => {
    if (!confirm(`Approve all ${submissions.length} pending submissions?`)) return

    setProcessing((prev) => new Set([...prev, ...submissions.map((s) => s.id)]))

    try {
      for (const submission of submissions) {
        await fetch('/api/admin/missions/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userTaskId: submission.id,
            action: 'approve',
          }),
        })
      }

      setSubmissions([])
    } catch (error) {
      console.error('Batch approve error:', error)
      alert('Failed to approve some submissions')
      router.refresh()
    } finally {
      setProcessing(new Set())
    }
  }

  const getMissionIcon = (type: string | null) => {
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
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'HARD':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Mission Verification</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review and verify mission submissions from users
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {submissions.filter(
                (s) => new Date(s.submittedAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Button
              onClick={handleBatchApprove}
              disabled={submissions.length === 0 || processing.size > 0}
              variant="default"
              size="sm"
            >
              Approve All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No pending submissions</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Screenshot Preview */}
                  <div className="flex-shrink-0">
                    {submission.screenshotUrl ? (
                      <div
                        className="relative w-48 h-48 rounded-lg overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setSelectedImage(submission.screenshotUrl!)}
                      >
                        <Image
                          src={submission.screenshotUrl}
                          alt="Screenshot"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {submission.task.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl">{getMissionIcon(submission.task.missionType)}</span>
                          <Badge className={getDifficultyColor(submission.task.difficulty)}>
                            {submission.task.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleApprove(submission.id)}
                          disabled={processing.has(submission.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(submission.id)}
                          disabled={processing.has(submission.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {submission.task.description}
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-secondary">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        {submission.user.avatar || '👤'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{submission.user.name}</p>
                        <p className="text-xs text-muted-foreground">{submission.user.email}</p>
                      </div>
                      <div className="ml-auto text-xs text-muted-foreground">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center gap-4 text-sm">
                      {submission.task.diamonds > 0 && (
                        <span className="flex items-center gap-1">
                          💎 <span className="font-semibold">{submission.task.diamonds}</span>
                        </span>
                      )}
                      {submission.task.points > 0 && (
                        <span className="flex items-center gap-1">
                          ⭐ <span className="font-semibold">{submission.task.points}</span>
                        </span>
                      )}
                      {submission.task.xpReward && submission.task.xpReward > 0 && (
                        <span className="flex items-center gap-1">
                          ✨ <span className="font-semibold">{submission.task.xpReward} XP</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Screenshot"
              width={800}
              height={600}
              className="rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-4 -right-4 bg-background"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
