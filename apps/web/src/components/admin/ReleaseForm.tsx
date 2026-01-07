'use client'

import { useState, useEffect } from 'react'
import { Plus, Save, Loader2, Music, Music2, Waves, Cloud } from 'lucide-react'
import FormField from './FormField'

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
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
        <h3 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">Basic Information</h3>
        
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
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
        <h3 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">Video Details</h3>

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
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
        <h3 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">Streaming Links</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-display font-bold uppercase tracking-wider text-white/70">
              <Music className="h-4 w-4 text-[#10B981]" />
              Spotify URL
            </label>
            <FormField
              label=""
              name="spotifyUrl"
              type="text"
              value={formData.spotifyUrl || ''}
              onChange={(value) => handleChange('spotifyUrl', value)}
              placeholder="https://open.spotify.com/..."
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-display font-bold uppercase tracking-wider text-white/70">
              <Music2 className="h-4 w-4 text-[#8B5CF6]" />
              Apple Music URL
            </label>
            <FormField
              label=""
              name="appleMusicUrl"
              type="text"
              value={formData.appleMusicUrl || ''}
              onChange={(value) => handleChange('appleMusicUrl', value)}
              placeholder="https://music.apple.com/..."
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-display font-bold uppercase tracking-wider text-white/70">
              <Waves className="h-4 w-4 text-[#00F5FF]" />
              Tidal URL
            </label>
            <FormField
              label=""
              name="tidalUrl"
              type="text"
              value={formData.tidalUrl || ''}
              onChange={(value) => handleChange('tidalUrl', value)}
              placeholder="https://tidal.com/..."
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-display font-bold uppercase tracking-wider text-white/70">
              <Cloud className="h-4 w-4 text-[#FFC700]" />
              SoundCloud URL
            </label>
            <FormField
              label=""
              name="soundcloudUrl"
              type="text"
              value={formData.soundcloudUrl || ''}
              onChange={(value) => handleChange('soundcloudUrl', value)}
              placeholder="https://soundcloud.com/..."
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
        <h3 className="mb-6 font-display text-xl font-black uppercase tracking-wider text-white">Display Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-[#FFC700]/30 bg-surface-base text-[#FFC700] focus:ring-2 focus:ring-[#FFC700]/20"
            />
            <label htmlFor="featured" className="text-sm font-medium text-white/80">
              Featured release (show prominently)
            </label>
            {formData.featured && (
              <span className="inline-flex rounded-full border-2 border-[#FFC700]/40 bg-[#FFC700]/20 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-[#FFC700] shadow-lg shadow-[#FFC700]/20">
                Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-[#10B981]/30 bg-surface-base text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-white/80">
              Release is active
            </label>
            {formData.isActive ? (
              <span className="inline-flex rounded-full border-2 border-[#10B981]/40 bg-[#10B981]/20 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-[#10B981] shadow-lg shadow-[#10B981]/20">
                Active
              </span>
            ) : (
              <span className="inline-flex rounded-full border-2 border-white/20 bg-white/10 px-3 py-1 font-display text-xs font-black uppercase tracking-wider text-white/40">
                Inactive
              </span>
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
          className="group rounded-2xl border-2 border-white/10 bg-white/5 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#FF1F7D]" />
              <span className="text-[#FF1F7D]">{mode === 'create' ? 'Creating...' : 'Saving...'}</span>
            </>
          ) : (
            <>
              {mode === 'create' ? (
                <Plus className="h-4 w-4 text-[#FF1F7D]" />
              ) : (
                <Save className="h-4 w-4 text-[#FF1F7D]" />
              )}
              <span className="text-[#FF1F7D]">{mode === 'create' ? 'Create Release' : 'Save Changes'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
