'use client'

import { useState, useEffect } from 'react'
import FormField from './FormField'
import StatusBadge from './StatusBadge'

export interface ReleaseFormData {
  title: string
  artist: string
  description?: string
  videoUrl: string
  videoId?: string
  thumbnailUrl?: string
  duration?: string
  views?: string
  releaseDate: string
  genre?: string
  tags: string[]
  spotifyUrl?: string
  appleMusicUrl?: string
  tidalUrl?: string
  soundcloudUrl?: string
  featured: boolean
  sortOrder: number
  isActive: boolean
}

interface ReleaseFormProps {
  initialData?: Partial<ReleaseFormData>
  onSubmit: (data: ReleaseFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export default function ReleaseForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: ReleaseFormProps) {
  const [formData, setFormData] = useState<ReleaseFormData>({
    title: '',
    artist: '',
    description: '',
    videoUrl: '',
    videoId: '',
    thumbnailUrl: '',
    duration: '',
    views: '',
    releaseDate: '',
    genre: '',
    tags: [],
    spotifyUrl: '',
    appleMusicUrl: '',
    tidalUrl: '',
    soundcloudUrl: '',
    featured: false,
    sortOrder: 0,
    isActive: true,
    ...initialData,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tagsInput, setTagsInput] = useState('')

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
      if (initialData.tags) {
        setTagsInput(initialData.tags.join(', '))
      }
    }
  }, [initialData])

  const handleChange = (field: keyof ReleaseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleTagsChange = (value: string) => {
    setTagsInput(value)
    // Convert comma-separated string to array
    const tagsArray = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    handleChange('tags', tagsArray)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required'
    }
    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required'
    }
    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Release date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-lg border border-red-500/20 bg-card p-6 dark:shadow-lg dark:shadow-red-500/10">
        <h3 className="mb-4 text-lg font-bold text-foreground">Basic Information</h3>
        
        <div className="space-y-4">
          <FormField
            label="Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            placeholder="e.g., God's Plan"
            required
            error={errors.title}
            disabled={isLoading}
          />

          <FormField
            label="Artist"
            name="artist"
            type="text"
            value={formData.artist}
            onChange={(value) => handleChange('artist', value)}
            placeholder="e.g., Drake"
            required
            error={errors.artist}
            disabled={isLoading}
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description || ''}
            onChange={(value) => handleChange('description', value)}
            placeholder="Optional description of the release..."
            disabled={isLoading}
            rows={3}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Genre"
              name="genre"
              type="text"
              value={formData.genre || ''}
              onChange={(value) => handleChange('genre', value)}
              placeholder="e.g., Hip Hop, Pop, R&B"
              disabled={isLoading}
            />

            <FormField
              label="Release Date"
              name="releaseDate"
              type="datetime-local"
              value={formData.releaseDate}
              onChange={(value) => handleChange('releaseDate', value)}
              required
              error={errors.releaseDate}
              disabled={isLoading}
            />
          </div>

          <FormField
            label="Tags"
            name="tags"
            type="text"
            value={tagsInput}
            onChange={(value) => handleTagsChange(value)}
            placeholder="e.g., rap, hip-hop, trending (comma-separated)"
            disabled={isLoading}
            help="Separate tags with commas"
          />
        </div>
      </div>

      {/* Video Details */}
      <div className="rounded-lg border border-red-500/20 bg-card p-6 dark:shadow-lg dark:shadow-red-500/10">
        <h3 className="mb-4 text-lg font-bold text-foreground">Video Details</h3>

        <div className="space-y-4">
          <FormField
            label="Video URL"
            name="videoUrl"
            type="text"
            value={formData.videoUrl}
            onChange={(value) => handleChange('videoUrl', value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            error={errors.videoUrl}
            disabled={isLoading}
            help="YouTube, TikTok, or other video platform URL"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Video ID"
              name="videoId"
              type="text"
              value={formData.videoId || ''}
              onChange={(value) => handleChange('videoId', value)}
              placeholder="e.g., xpVfcZ0ZcFM"
              disabled={isLoading}
              help="Platform-specific video ID (optional)"
            />

            <FormField
              label="Duration"
              name="duration"
              type="text"
              value={formData.duration || ''}
              onChange={(value) => handleChange('duration', value)}
              placeholder="e.g., 3:45"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Thumbnail URL"
              name="thumbnailUrl"
              type="text"
              value={formData.thumbnailUrl || ''}
              onChange={(value) => handleChange('thumbnailUrl', value)}
              placeholder="https://..."
              disabled={isLoading}
            />

            <FormField
              label="Views"
              name="views"
              type="text"
              value={formData.views || ''}
              onChange={(value) => handleChange('views', value)}
              placeholder="e.g., 1.2M, 500K"
              disabled={isLoading}
              help="View count (e.g., '1.2M')"
            />
          </div>
        </div>
      </div>

      {/* Streaming Links */}
      <div className="rounded-lg border border-red-500/20 bg-card p-6 dark:shadow-lg dark:shadow-red-500/10">
        <h3 className="mb-4 text-lg font-bold text-foreground">Streaming Links</h3>

        <div className="space-y-4">
          <FormField
            label="Spotify URL"
            name="spotifyUrl"
            type="text"
            value={formData.spotifyUrl || ''}
            onChange={(value) => handleChange('spotifyUrl', value)}
            placeholder="https://open.spotify.com/..."
            disabled={isLoading}
            icon="🎵"
          />

          <FormField
            label="Apple Music URL"
            name="appleMusicUrl"
            type="text"
            value={formData.appleMusicUrl || ''}
            onChange={(value) => handleChange('appleMusicUrl', value)}
            placeholder="https://music.apple.com/..."
            disabled={isLoading}
            icon="🍎"
          />

          <FormField
            label="Tidal URL"
            name="tidalUrl"
            type="text"
            value={formData.tidalUrl || ''}
            onChange={(value) => handleChange('tidalUrl', value)}
            placeholder="https://tidal.com/..."
            disabled={isLoading}
            icon="🌊"
          />

          <FormField
            label="SoundCloud URL"
            name="soundcloudUrl"
            type="text"
            value={formData.soundcloudUrl || ''}
            onChange={(value) => handleChange('soundcloudUrl', value)}
            placeholder="https://soundcloud.com/..."
            disabled={isLoading}
            icon="☁️"
          />
        </div>
      </div>

      {/* Display Settings */}
      <div className="rounded-lg border border-red-500/20 bg-card p-6 dark:shadow-lg dark:shadow-red-500/10">
        <h3 className="mb-4 text-lg font-bold text-foreground">Display Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-red-500/30 bg-[#0a0a0a] text-red-500 focus:ring-2 focus:ring-red-500/20"
            />
            <label htmlFor="featured" className="text-sm text-gray-300">
              Featured release (show prominently)
            </label>
            {formData.featured && <StatusBadge variant="warning">Featured</StatusBadge>}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-red-500/30 bg-[#0a0a0a] text-red-500 focus:ring-2 focus:ring-red-500/20"
            />
            <label htmlFor="isActive" className="text-sm text-gray-300">
              Release is active
            </label>
            {formData.isActive ? (
              <StatusBadge variant="success">Active</StatusBadge>
            ) : (
              <StatusBadge variant="neutral">Inactive</StatusBadge>
            )}
          </div>

          <FormField
            label="Sort Order"
            name="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(value) => handleChange('sortOrder', Number(value) || 0)}
            min={0}
            disabled={isLoading}
            help="Lower numbers appear first (0 = highest priority)"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-lg border border-red-500/30 bg-gray-800 px-6 py-2 text-sm font-semibold text-foreground hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg border-2 border-primary bg-transparent px-6 py-2 text-sm font-semibold text-primary dark:shadow-lg dark:shadow-red-500/30 hover:dark:shadow-red-500/50 hover:bg-primary/10 disabled:opacity-50 dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            <>
              <span>{mode === 'create' ? '➕' : '💾'}</span>
              {mode === 'create' ? 'Create Release' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
