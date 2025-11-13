'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

export default function ReleasesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null)

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Mock data for music releases (popular rap songs)
  const releases: Release[] = [
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
      title: 'SICKO MODE',
      artist: 'Travis Scott ft. Drake',
      thumbnailUrl: 'https://i.ytimg.com/vi/6ONRf7h3Mdk/maxresdefault.jpg',
      views: '890M',
      releaseDate: '2018-08-21',
      duration: '5:12',
      videoUrl: 'https://www.youtube.com/watch?v=6ONRf7h3Mdk',
      videoId: '6ONRf7h3Mdk',
    },
    {
      id: 'release-4',
      title: 'Rockstar',
      artist: 'Post Malone ft. 21 Savage',
      thumbnailUrl: 'https://i.ytimg.com/vi/UceaB4D0jpo/maxresdefault.jpg',
      views: '1.5B',
      releaseDate: '2017-09-15',
      duration: '3:38',
      videoUrl: 'https://www.youtube.com/watch?v=UceaB4D0jpo',
      videoId: 'UceaB4D0jpo',
    },
    {
      id: 'release-5',
      title: 'Lucid Dreams',
      artist: 'Juice WRLD',
      thumbnailUrl: 'https://i.ytimg.com/vi/mzB1VGEGcSU/maxresdefault.jpg',
      views: '780M',
      releaseDate: '2018-05-04',
      duration: '3:59',
      videoUrl: 'https://www.youtube.com/watch?v=mzB1VGEGcSU',
      videoId: 'mzB1VGEGcSU',
    },
    {
      id: 'release-6',
      title: 'Congratulations',
      artist: 'Post Malone ft. Quavo',
      thumbnailUrl: 'https://i.ytimg.com/vi/SC4xMk98Pdc/maxresdefault.jpg',
      views: '1.1B',
      releaseDate: '2016-11-04',
      duration: '3:40',
      videoUrl: 'https://www.youtube.com/watch?v=SC4xMk98Pdc',
      videoId: 'SC4xMk98Pdc',
    },
    {
      id: 'release-7',
      title: 'Sunflower',
      artist: 'Post Malone & Swae Lee',
      thumbnailUrl: 'https://i.ytimg.com/vi/ApXoWvfEYVU/maxresdefault.jpg',
      views: '1.3B',
      releaseDate: '2018-10-18',
      duration: '2:38',
      videoUrl: 'https://www.youtube.com/watch?v=ApXoWvfEYVU',
      videoId: 'ApXoWvfEYVU',
    },
    {
      id: 'release-8',
      title: 'The Box',
      artist: 'Roddy Ricch',
      thumbnailUrl: 'https://i.ytimg.com/vi/uLHqpjW3aDs/maxresdefault.jpg',
      views: '650M',
      releaseDate: '2019-12-06',
      duration: '3:16',
      videoUrl: 'https://www.youtube.com/watch?v=uLHqpjW3aDs',
      videoId: 'uLHqpjW3aDs',
    },
    {
      id: 'release-9',
      title: 'Mask Off',
      artist: 'Future',
      thumbnailUrl: 'https://i.ytimg.com/vi/xvZqHgFz51I/maxresdefault.jpg',
      views: '520M',
      releaseDate: '2017-03-05',
      duration: '3:24',
      videoUrl: 'https://www.youtube.com/watch?v=xvZqHgFz51I',
      videoId: 'xvZqHgFz51I',
    },
    {
      id: 'release-10',
      title: 'Laugh Now Cry Later',
      artist: 'Drake ft. Lil Durk',
      thumbnailUrl: 'https://i.ytimg.com/vi/JFm7YDVlqnI/maxresdefault.jpg',
      views: '390M',
      releaseDate: '2020-08-14',
      duration: '5:21',
      videoUrl: 'https://www.youtube.com/watch?v=JFm7YDVlqnI',
      videoId: 'JFm7YDVlqnI',
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `${diffDays} days ago`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} ${months === 1 ? 'month' : 'months'} ago`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} ${years === 1 ? 'year' : 'years'} ago`
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Latest Releases</h1>
          <p className="mt-2 text-gray-600">Discover the hottest tracks from your favorite artists</p>
        </div>

        {/* Releases Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {releases.map((release, index) => (
            <button
              key={release.id}
              type="button"
              onClick={() => setSelectedRelease(release)}
              className="group w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {/* Thumbnail */}
              <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-gray-200 shadow-md">
                <Image
                  src={release.thumbnailUrl}
                  alt={release.title}
                  fill
                  priority={index < 2}
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-80 px-2 py-1 text-xs font-semibold text-white">
                  {release.duration}
                </div>
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                  <div className="scale-0 rounded-full bg-red-600 p-3 transition-transform group-hover:scale-100">
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
              <div className="flex gap-3">
                {/* Artist Avatar Placeholder */}
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 font-semibold text-gray-900 line-clamp-2 group-hover:text-[#FF5656]">
                    {release.title}
                  </h3>
                  <p className="text-sm text-gray-600">{release.artist}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span>{release.views} views</span>
                    <span>•</span>
                    <span>{formatDate(release.releaseDate)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => alert('More releases coming soon!\n更多音乐即将上线')}
            className="rounded-lg border-2 border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
          >
            Load More Releases
          </button>
        </div>
      </div>
    </div>

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
          <button
            type="button"
            onClick={() => setSelectedRelease(null)}
            className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-gray-100"
            aria-label="Close video player"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="aspect-video overflow-hidden rounded-lg bg-black shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${selectedRelease.videoId}?autoplay=1&rel=0`}
              title={selectedRelease.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4 rounded-lg bg-gray-900/90 p-4 text-white shadow-lg">
            <div>
              <h3 className="text-lg font-semibold">{selectedRelease.title}</h3>
              <p className="text-sm text-gray-300">{selectedRelease.artist}</p>
            </div>
            <a
              href={selectedRelease.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 15l5.19-3L10 9v6zm10-3c0-1.77-.23-3.54-.23-3.54s-.23-1.5-.95-2.16c-.91-.94-1.93-.95-2.4-1C14.07 5 12 5 12 5h-.02s-2.07 0-4.4.3c-.47.05-1.49.06-2.4 1-.72.66-.95 2.16-.95 2.16S4 10.23 4 12c0 1.77.23 3.54.23 3.54s.23 1.5.95 2.16c.91.94 2.1.91 2.63 1.01 1.9.18 4.19.29 4.19.29s2.07 0 4.4-.3c.47-.05 1.49-.06 2.4-1 .72-.66.95-2.16.95-2.16S20 13.77 20 12z" />
              </svg>
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
