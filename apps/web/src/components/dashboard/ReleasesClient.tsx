'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Play, X, ExternalLink, Loader2 } from 'lucide-react'

interface Release {
  id: string
  title: string
  artist: string
  thumbnailUrl?: string | null
  views?: string | null
  releaseDate: string
  duration?: string | null
  videoUrl: string
  videoId?: string | null
  description?: string | null
}

const extractYoutubeId = (url?: string | null) => {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.replace('/', '')
    }
    if (parsed.searchParams.get('v')) {
      return parsed.searchParams.get('v')
    }
    const pathParts = parsed.pathname.split('/')
    const embedIndex = pathParts.indexOf('embed')
    if (embedIndex !== -1 && pathParts[embedIndex + 1]) {
      return pathParts[embedIndex + 1]
    }
  } catch {
    // ignore invalid URLs
  }
  return null
}

const getThumbnailUrl = (release: Release) => {
  if (release.thumbnailUrl?.trim()) return release.thumbnailUrl
  const youtubeId = release.videoId || extractYoutubeId(release.videoUrl)
  return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null
}

const getEmbedVideoId = (release: Release | null) => {
  if (!release) return ''
  return release.videoId || extractYoutubeId(release.videoUrl) || ''
}

const mockReleases: Release[] = [
  {
    id: 'release-1',
    title: 'God\'s Plan',
    artist: 'Drake',
    thumbnailUrl: 'https://img.youtube.com/vi/xpVfcZ0ZcFM/hqdefault.jpg',
    views: '1.8B',
    releaseDate: '2018-01-19',
    duration: '3:18',
    videoUrl: 'https://www.youtube.com/watch?v=xpVfcZ0ZcFM',
    videoId: 'xpVfcZ0ZcFM',
  },
  {
    id: 'release-2',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    thumbnailUrl: 'https://img.youtube.com/vi/tvTRZJ-4EyI/hqdefault.jpg',
    views: '1.2B',
    releaseDate: '2017-03-30',
    duration: '2:57',
    videoUrl: 'https://www.youtube.com/watch?v=tvTRZJ-4EyI',
    videoId: 'tvTRZJ-4EyI',
  },
  {
    id: 'release-3',
    title: 'Sicko Mode',
    artist: 'Travis Scott ft. Drake',
    thumbnailUrl: 'https://img.youtube.com/vi/6ONRf7h3Mdk/hqdefault.jpg',
    views: '1.1B',
    releaseDate: '2018-08-21',
    duration: '5:12',
    videoUrl: 'https://www.youtube.com/watch?v=6ONRf7h3Mdk',
    videoId: '6ONRf7h3Mdk',
  },
  {
    id: 'release-4',
    title: 'Old Town Road',
    artist: 'Lil Nas X ft. Billy Ray Cyrus',
    thumbnailUrl: 'https://img.youtube.com/vi/w2Ov5jzm3j8/hqdefault.jpg',
    views: '900M',
    releaseDate: '2019-04-05',
    duration: '2:37',
    videoUrl: 'https://www.youtube.com/watch?v=w2Ov5jzm3j8',
    videoId: 'w2Ov5jzm3j8',
  }
]

export default function ReleasesClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null)
  const [releases, setReleases] = useState<Release[]>(mockReleases)
  const [isLoadingReleases, setIsLoadingReleases] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (!selectedRelease) {
      document.body.style.removeProperty('overflow')
      return
    }

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedRelease(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.removeProperty('overflow')
    }
  }, [selectedRelease])

  useEffect(() => {
    const fetchReleases = async () => {
      setIsLoadingReleases(true)
      try {
        const response = await fetch('/api/releases?limit=24')
        const data = await response.json()

        if (response.ok && data?.releases?.length) {
          setReleases(data.releases)
        }
      } catch (error) {
        console.error('Failed to fetch releases:', error)
      } finally {
        setIsLoadingReleases(false)
      }
    }

    fetchReleases()
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const selectedVideoId = getEmbedVideoId(selectedRelease)

  return (
    <>
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Latest Releases</h1>
            <p className="mt-2 text-muted-foreground">Discover the hottest tracks from your favorite artists</p>
            {isLoadingReleases && (
              <p className="mt-1 text-xs text-muted-foreground">Refreshing releases...</p>
            )}
          </div>

          {/* Releases Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {releases.map((release) => {
              const thumbnailSrc = getThumbnailUrl(release)
              const showFallback = imageErrors[release.id] || !thumbnailSrc

              return (
                <button
                  key={release.id}
                  type="button"
                  onClick={() => setSelectedRelease(release)}
                  className="group w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {/* Thumbnail */}
                  <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-secondary shadow-md border border-border group-hover:border-primary transition-colors">
                    {showFallback ? (
                      // Fallback display when image fails to load
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <Play className="h-16 w-16 text-primary mb-2" />
                        <p className="text-sm font-semibold text-foreground px-4 text-center">{release.title}</p>
                        <p className="text-xs text-muted-foreground mt-2">Image failed to load</p>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnailSrc}
                        alt={release.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => {
                          setImageErrors(prev => ({ ...prev, [release.id]: true }))
                        }}
                      />
                    )}
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 rounded bg-background bg-opacity-80 px-2 py-1 text-xs font-semibold text-foreground">
                      {release.duration || '—'}
                    </div>
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-background bg-opacity-0 transition-all group-hover:bg-opacity-30">
                      <div className="scale-0 rounded-full bg-primary p-3 transition-transform group-hover:scale-100">
                        <Play className="h-8 w-8 text-primary-foreground fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {release.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{release.artist}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{release.views?.trim() || '—'} views</span>
                      <span>{release.releaseDate ? new Date(release.releaseDate).toLocaleDateString() : '—'}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Load More Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => alert('More releases coming soon!')}
              className="rounded-full bg-secondary border border-border px-8 py-3 font-semibold text-foreground transition hover:bg-secondary/80"
            >
              Load More Releases
            </button>
          </div>
        </div>
      </div>



      {/* Video Modal */}
      {selectedRelease && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedRelease.title} video player`}
          onClick={() => setSelectedRelease(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Video Player */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-background shadow-2xl">
              {selectedVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
                  title={selectedRelease.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-secondary text-muted-foreground">
                  Video unavailable
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary border border-border p-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedRelease.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedRelease.artist}</p>
              </div>
              <a
                href={selectedRelease.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-transparent px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4" />
                Watch on YouTube
              </a>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedRelease(null)}
              className="absolute -top-12 right-0 rounded-full bg-secondary p-2 text-muted-foreground transition hover:bg-secondary/80 hover:text-foreground"
              aria-label="Close video"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
