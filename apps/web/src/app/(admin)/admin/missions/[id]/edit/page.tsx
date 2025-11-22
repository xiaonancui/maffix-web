'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import MissionForm, { MissionFormData } from '@/components/admin/MissionForm'

interface Mission {
  id: string
  title: string
  description: string
  type: string
  difficulty: string
  missionType?: string | null
  targetTikTokAccount?: string | null
  targetVideoUrl?: string | null
  targetAudioId?: string | null
  autoVerify: boolean
  points: number
  diamonds: number
  isActive: boolean
  startDate?: string | null
  endDate?: string | null
  maxCompletions?: number | null
}

export default function EditMissionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [mission, setMission] = useState<Mission | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch mission data
  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await fetch(`/api/admin/missions/${params.id}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch mission')
        }

        setMission(result.mission)
      } catch (err: any) {
        console.error('Failed to fetch mission:', err)
        setError(err.message || 'Failed to fetch mission')
      } finally {
        setIsFetching(false)
      }
    }

    fetchMission()
  }, [params.id])

  const handleSubmit = async (data: MissionFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/missions/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          type: data.type,
          difficulty: data.difficulty,
          missionType: data.missionType || null,
          targetTikTokAccount: data.targetTikTokAccount || null,
          targetVideoUrl: data.targetVideoUrl || null,
          targetAudioId: data.targetAudioId || null,
          autoVerify: data.autoVerify,
          points: data.points,
          diamonds: data.diamonds,
          isActive: data.isActive,
          startDate: data.startDate || null,
          endDate: data.endDate || null,
          maxCompletions: data.maxCompletions || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update mission')
      }

      // Show success message
      console.log('✅ Mission updated successfully:', result.mission)

      // Redirect to missions list
      router.push('/admin/missions')
    } catch (err: any) {
      console.error('Failed to update mission:', err)
      setError(err.message || 'Failed to update mission')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/missions')
  }

  // Convert mission data to form data format
  const getInitialData = (): Partial<MissionFormData> | undefined => {
    if (!mission) return undefined

    return {
      title: mission.title,
      description: mission.description,
      type: mission.type as any,
      difficulty: mission.difficulty as any,
      missionType: mission.missionType as any,
      targetTikTokAccount: mission.targetTikTokAccount || '',
      targetVideoUrl: mission.targetVideoUrl || '',
      targetAudioId: mission.targetAudioId || '',
      autoVerify: mission.autoVerify,
      points: mission.points,
      diamonds: mission.diamonds,
      isActive: mission.isActive,
      startDate: mission.startDate ? new Date(mission.startDate).toISOString().slice(0, 16) : '',
      endDate: mission.endDate ? new Date(mission.endDate).toISOString().slice(0, 16) : '',
      maxCompletions: mission.maxCompletions || undefined,
    }
  }

  if (isFetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-muted-foreground">Loading mission...</p>
        </div>
      </div>
    )
  }

  if (error && !mission) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Edit Mission" description="Mission not found" />
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-400">Error</h4>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Mission"
        description={`Editing: ${mission?.title || 'Loading...'}`}
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
          mode="edit"
          initialData={getInitialData()}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

