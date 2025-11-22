'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import MissionForm, { MissionFormData } from '@/components/admin/MissionForm'

export default function NewMissionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: MissionFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          type: data.type,
          difficulty: data.difficulty,
          missionType: data.missionType || undefined,
          targetTikTokAccount: data.targetTikTokAccount || undefined,
          targetVideoUrl: data.targetVideoUrl || undefined,
          targetAudioId: data.targetAudioId || undefined,
          autoVerify: data.autoVerify,
          points: data.points,
          diamonds: data.diamonds,
          isActive: data.isActive,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
          maxCompletions: data.maxCompletions || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create mission')
      }

      // Show success message (you can add a toast notification here)
      console.log('✅ Mission created successfully:', result.mission)

      // Redirect to missions list
      router.push('/admin/missions')
    } catch (err: any) {
      console.error('Failed to create mission:', err)
      setError(err.message || 'Failed to create mission')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/missions')
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Create New Mission"
        description="Create a new mission for users to complete"
      />

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-400">Error</h4>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-6 dark:shadow-lg dark:shadow-red-500/10">
        <MissionForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

