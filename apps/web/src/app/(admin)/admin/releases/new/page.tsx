'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
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
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 sm:px-6 lg:px-8">
      <AdminPageHeader
        title="Create New Release"
        description="Add a new video release to the platform"
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

