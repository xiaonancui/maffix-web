'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Release {
  id: string
  title: string
  artist: string
  thumbnailUrl: string
  views: string
  releaseDate: string
  duration: string
  videoUrl: string
  videoId: string
}

const mockReleases: Release[] = [
  {
    id: 'release-1',
    title: 'God\'s Plan',
    artist: 'Drake',
    thumbnailUrl: 'https://i.ytimg.com/vi/xpVfcZ0ZcFM/maxresdefault.jpg',
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
    thumbnailUrl: 'https://i.ytimg.com/vi/tvTRZJ-4EyI/maxresdefault.jpg',
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
    thumbnailUrl: 'https://i.ytimg.com/vi/6ONRf7h3Mdk/maxresdefault.jpg',
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
    thumbnailUrl: 'https://i.ytimg.com/vi/w2Ov5jzm3j8/maxresdefault.jpg',
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

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Latest Releases</h1>
            <p className="mt-2 text-gray-400">Discover the hottest tracks from your favorite artists</p>
          </div>

          {/* Releases Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {releases.map((release, index) => (
              <button
                key={release.id}
                type="button"
                onClick={() => setSelectedRelease(release)}
                className="group w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5656] focus-visible:ring-offset-2"
              >
                {/* Thumbnail */}
                <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-gray-800 shadow-md border border-gray-700 group-hover:border-[#FF5656] transition-colors">
                  <Image
                    src={release.thumbnailUrl}
                    alt={release.title}
                    fill
                    priority={index < 2}
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-80 px-2 py-1 text-xs font-semibold text-white">
                    {release.duration}
                  </div>
                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                    <div className="scale-0 rounded-full bg-[#FF5656] p-3 transition-transform group-hover:scale-100">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-white group-hover:text-[#FF5656] transition-colors line-clamp-2">
                    {release.title}
                  </h3>
                  <p className="text-sm text-gray-400">{release.artist}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{release.views} views</span>
                    <span>{new Date(release.releaseDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => alert('More releases coming soon!')}
              className="rounded-full bg-gray-800 border border-gray-700 px-8 py-3 font-semibold text-gray-300 transition hover:bg-gray-700 hover:text-white"
            >
              Load More Releases
            </button>
          </div>
        </div>
      </div>



      {/* Video Modal */}
      {selectedRelease && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
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
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${selectedRelease.videoId}?autoplay=1&rel=0`}
                title={selectedRelease.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-900 border border-gray-800 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedRelease.title}</h3>
                <p className="text-sm text-gray-300">{selectedRelease.artist}</p>
              </div>
              <a
                href={selectedRelease.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5656] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff3333]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch on YouTube
              </a>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedRelease(null)}
              className="absolute -top-12 right-0 rounded-full bg-gray-800 p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
              aria-label="Close video"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
