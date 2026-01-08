'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Clock, ExternalLink, CheckCircle, Music, Headphones, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MissionDetailModalProps {
  mission: {
    id: string
    title: string
    description: string
    missionType?: string
    targetTikTokAccount?: string | null
    targetVideoUrl?: string | null
    targetAudioId?: string | null
    diamonds: number
    points: number
    xpReward?: number
    difficulty: string
    estimatedTime?: string
    isActive: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  hasTikTokLinked: boolean
  userId: string
}

export default function MissionDetailModal({
  mission,
  open,
  onOpenChange,
  hasTikTokLinked,
  userId,
}: MissionDetailModalProps) {
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const router = useRouter()

  // Check if this is an audio detection mission
  const isAudioMission = mission.missionType === 'USE_AUDIO'

  const getMissionIcon = (type?: string) => {
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
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'HARD':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setScreenshot(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearScreenshot = () => {
    setScreenshot(null)
    setPreview(null)
  }

  const handleSubmitTask = async () => {
    if (!screenshot) {
      alert('Please upload a screenshot to complete the task')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('submitting')

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', screenshot)
      formData.append('missionId', mission.id)
      formData.append('userId', userId)

      // Upload screenshot first
      const uploadResponse = await fetch('/api/missions/upload-screenshot', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload screenshot')
      }

      const { screenshotUrl } = await uploadResponse.json()

      // Submit task with screenshot URL
      const submitResponse = await fetch('/api/missions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: mission.id,
          screenshotUrl,
        }),
      })

      if (!submitResponse.ok) {
        throw new Error('Failed to submit task')
      }

      setSubmitStatus('success')

      // Close modal and refresh after a short delay
      setTimeout(() => {
        onOpenChange(false)
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getMissionIcon(mission.missionType)}</span>
              <div>
                <DialogTitle className="text-xl">{mission.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getDifficultyColor(mission.difficulty)}>
                    {mission.difficulty}
                  </Badge>
                  {mission.estimatedTime && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {mission.estimatedTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogDescription className="text-base mt-4">
            {mission.description}
          </DialogDescription>
        </DialogHeader>

        {/* Mission Details */}
        <div className="space-y-4 py-4">
          {/* Target Info */}
          {mission.targetTikTokAccount && (
            <div className="rounded-lg bg-secondary p-4">
              <Label className="text-sm text-muted-foreground">Target Account</Label>
              <p className="font-semibold text-foreground mt-1">{mission.targetTikTokAccount}</p>
            </div>
          )}

          {mission.targetVideoUrl && (
            <div className="rounded-lg bg-secondary p-4">
              <Label className="text-sm text-muted-foreground">Target Video</Label>
              <a
                href={mission.targetVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline mt-1"
              >
                <span className="font-semibold truncate">{mission.targetVideoUrl}</span>
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </a>
            </div>
          )}

          {mission.targetAudioId && (
            <div className="rounded-lg bg-secondary p-4">
              <Label className="text-sm text-muted-foreground">Audio ID</Label>
              <p className="font-mono text-sm text-foreground mt-1">{mission.targetAudioId}</p>
            </div>
          )}

          {/* Rewards */}
          <div className="rounded-lg bg-secondary p-4">
            <Label className="text-sm text-muted-foreground mb-2 block">Rewards</Label>
            <div className="flex flex-wrap gap-3">
              {mission.diamonds > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">💎</span>
                  <span className="font-semibold text-foreground">{mission.diamonds}</span>
                </div>
              )}
              {mission.points > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">⭐</span>
                  <span className="font-semibold text-foreground">{mission.points}</span>
                </div>
              )}
              {mission.xpReward && mission.xpReward > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">✨</span>
                  <span className="font-semibold text-foreground">{mission.xpReward} XP</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Steps */}
          <div className="rounded-lg bg-secondary p-4">
            <Label className="text-sm text-muted-foreground mb-2 block">How to Complete</Label>
            {isAudioMission ? (
              <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
                <li>Click "Start Listening" to open the Music Detection page</li>
                <li>Play the required audio track on your device or surroundings</li>
                <li>Use the audio detector to identify the track</li>
                <li>The mission will be verified automatically when detected</li>
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
                <li>Navigate to the target account/video on TikTok</li>
                <li>Complete the required action (follow, like, repost, or use audio)</li>
                <li>Take a screenshot of your completed action</li>
                <li>Upload the screenshot below for verification</li>
              </ol>
            )}
          </div>

          {/* Audio Mission - Start Listening CTA */}
          {isAudioMission && (
            <div className="rounded-2xl border-2 border-[#FFC700]/30 bg-gradient-to-br from-[#FFC700]/10 to-[#FFC700]/5 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC700]/20 ring-2 ring-[#FFC700]/40">
                  <Headphones className="h-8 w-8 text-[#FFC700]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Music Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Use our audio detection to verify this mission
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-background/50 p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-4 w-4 text-[#FFC700]" />
                  <span className="text-sm font-medium text-foreground">Required Track</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  {mission.targetAudioId || 'Official audio track'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Sparkles className="h-4 w-4 text-[#FFC700]" />
                <span>Automatic verification when audio is detected</span>
              </div>
            </div>
          )}

          {/* Screenshot Upload - Only for non-audio missions */}
          {!isAudioMission && (
            <div className="rounded-lg bg-secondary p-4">
              <Label className="text-sm text-muted-foreground mb-2 block">
                Proof Screenshot
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Upload a screenshot showing you completed the task (Max 5MB)
              </p>

              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Screenshot preview"
                    className="w-full rounded-lg border border-border"
                  />
                  <button
                    onClick={clearScreenshot}
                    className="absolute top-2 right-2 rounded-full bg-background p-1 shadow-md hover:bg-secondary"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="sr-only"
                    id="screenshot-upload"
                  />
                  <Label
                    htmlFor="screenshot-upload"
                    className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload screenshot
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </Label>
                </div>
              )}
            </div>
          )}

          {/* Warning for unlinked TikTok */}
          {!hasTikTokLinked && (
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
              <p className="text-sm text-yellow-500">
                ⚠️ For faster verification, link your TikTok account in your profile.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {isAudioMission ? (
            <Link
              href={`/music-detection?missionId=${mission.id}`}
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              <Button className="w-full bg-gradient-to-r from-[#FFC700] to-[#FF8C00] hover:from-[#FFD700] hover:to-[#FFA500] text-black font-bold">
                <Headphones className="h-4 w-4 mr-2" />
                Start Listening
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleSubmitTask}
              disabled={!screenshot || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : submitStatus === 'success' ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Submitted!
                </span>
              ) : (
                'Submit Task'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
