'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
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
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 sm:px-6 lg:px-8">
      <AdminPageHeader
        title="Create New Mission"
        description="Create a new mission for users to complete"
      />

      {error && (
        <div className="rounded-3xl border-2 border-[#FF1F7D]/40 bg-gradient-to-br from-[#FF1F7D]/20 to-[#FF1F7D]/10 p-6 shadow-xl shadow-[#FF1F7D]/20 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#FF1F7D]/20 p-3 ring-2 ring-[#FF1F7D]/30">
              <AlertTriangle className="h-6 w-6 text-[#FF1F7D]" />
            </div>
            <div>
              <h4 className="font-display text-lg font-black uppercase tracking-wider text-[#FF1F7D]">Error</h4>
              <p className="mt-1 text-sm font-medium text-white/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-8 shadow-xl backdrop-blur-xl">
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

