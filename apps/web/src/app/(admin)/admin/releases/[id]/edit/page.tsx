'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ReleaseForm, { ReleaseFormData } from '@/components/admin/ReleaseForm'

interface Release {
  id: string
  title: string
  artist: string
  description?: string | null
  videoUrl: string
  videoId?: string | null
  thumbnailUrl?: string | null
  duration?: string | null
  views?: string | null
  releaseDate: string
  genre?: string | null
  tags: string[]
  spotifyUrl?: string | null
  appleMusicUrl?: string | null
  tidalUrl?: string | null
  soundcloudUrl?: string | null
  featured: boolean
  sortOrder: number
  isActive: boolean
}

export default function EditReleasePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [release, setRelease] = useState<Release | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch release data
  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const response = await fetch(`/api/admin/releases/${params.id}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch release')
        }

        setRelease(result.release)
      } catch (err: any) {
        console.error('Failed to fetch release:', err)
        setError(err.message || 'Failed to fetch release')
      } finally {
        setIsFetching(false)
      }
    }

    fetchRelease()
  }, [params.id])

  const handleSubmit = async (data: ReleaseFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/releases/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          artist: data.artist,
          description: data.description || null,
          videoUrl: data.videoUrl,
          videoId: data.videoId || null,
          thumbnailUrl: data.thumbnailUrl || null,
          duration: data.duration || null,
          views: data.views || null,
          releaseDate: data.releaseDate,
          genre: data.genre || null,
          tags: data.tags,
          spotifyUrl: data.spotifyUrl || null,
          appleMusicUrl: data.appleMusicUrl || null,
          tidalUrl: data.tidalUrl || null,
          soundcloudUrl: data.soundcloudUrl || null,
          featured: data.featured,
          sortOrder: data.sortOrder,
          isActive: data.isActive,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update release')
      }

      // Show success message
      console.log('✅ Release updated successfully:', result.release)

      // Redirect to releases list
      router.push('/admin/releases')
    } catch (err: any) {
      console.error('Failed to update release:', err)
      setError(err.message || 'Failed to update release')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/releases')
  }

  // Convert release data to form data format
  const getInitialData = (): Partial<ReleaseFormData> | undefined => {
    if (!release) return undefined

    return {
      title: release.title,
      artist: release.artist,
      description: release.description || '',
      videoUrl: release.videoUrl,
      videoId: release.videoId || '',
      thumbnailUrl: release.thumbnailUrl || '',
      duration: release.duration || '',
      views: release.views || '',
      releaseDate: new Date(release.releaseDate).toISOString().slice(0, 16),
      genre: release.genre || '',
      tags: release.tags || [],
      spotifyUrl: release.spotifyUrl || '',
      appleMusicUrl: release.appleMusicUrl || '',
      tidalUrl: release.tidalUrl || '',
      soundcloudUrl: release.soundcloudUrl || '',
      featured: release.featured,
      sortOrder: release.sortOrder,
      isActive: release.isActive,
    }
  }

  if (isFetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-400">Loading release...</p>
        </div>
      </div>
    )
  }

  if (error && !release) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Edit Release" description="Release not found" />
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
        title="Edit Release"
        description={`Editing: ${release?.title || 'Loading...'}`}
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

      <div className="rounded-lg border border-red-500/20 bg-[#1a1a1a] p-6 shadow-lg shadow-red-500/10">
        <ReleaseForm
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

