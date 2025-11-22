'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ReleaseForm, { ReleaseFormData } from '@/components/admin/ReleaseForm'

export default function NewReleasePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ReleaseFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          artist: data.artist,
          description: data.description || undefined,
          videoUrl: data.videoUrl,
          videoId: data.videoId || undefined,
          thumbnailUrl: data.thumbnailUrl || undefined,
          duration: data.duration || undefined,
          views: data.views || undefined,
          releaseDate: data.releaseDate,
          genre: data.genre || undefined,
          tags: data.tags.length > 0 ? data.tags : undefined,
          spotifyUrl: data.spotifyUrl || undefined,
          appleMusicUrl: data.appleMusicUrl || undefined,
          tidalUrl: data.tidalUrl || undefined,
          soundcloudUrl: data.soundcloudUrl || undefined,
          featured: data.featured,
          sortOrder: data.sortOrder,
          isActive: data.isActive,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create release')
      }

      // Show success message
      console.log('✅ Release created successfully:', result.release)

      // Redirect to releases list
      router.push('/admin/releases')
    } catch (err: any) {
      console.error('Failed to create release:', err)
      setError(err.message || 'Failed to create release')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/releases')
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Create New Release"
        description="Add a new video release to the platform"
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
        <ReleaseForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

