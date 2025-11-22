'use client'

import { useState, useEffect } from 'react'
import FormField from './FormField'
import StatusBadge from './StatusBadge'

export interface MissionFormData {
  title: string
  description: string
  type: 'SOCIAL' | 'CONTENT' | 'DAILY' | 'PROFILE' | 'REFERRAL' | 'PURCHASE' | 'EVENT'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  missionType?: 'FOLLOW' | 'LIKE' | 'REPOST' | 'USE_AUDIO' | null
  targetTikTokAccount?: string
  targetVideoUrl?: string
  targetAudioId?: string
  autoVerify: boolean
  points: number
  diamonds: number
  isActive: boolean
  startDate?: string
  endDate?: string
  maxCompletions?: number
}

interface MissionFormProps {
  initialData?: Partial<MissionFormData>
  onSubmit: (data: MissionFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export default function MissionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: MissionFormProps) {
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    type: 'SOCIAL',
    difficulty: 'EASY',
    missionType: null,
    targetTikTokAccount: '',
    targetVideoUrl: '',
    targetAudioId: '',
    autoVerify: true,
    points: 0,
    diamonds: 0,
    isActive: true,
    startDate: '',
    endDate: '',
    maxCompletions: undefined,
    ...initialData,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const handleChange = (field: keyof MissionFormData, value: any) => {
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (formData.points < 0) {
      newErrors.points = 'Points must be 0 or greater'
    }
    if (formData.diamonds < 0) {
      newErrors.diamonds = 'Diamonds must be 0 or greater'
    }

    // Validate mission type requirements
    if (formData.missionType) {
      switch (formData.missionType) {
        case 'FOLLOW':
          if (!formData.targetTikTokAccount?.trim()) {
            newErrors.targetTikTokAccount = 'TikTok account is required for FOLLOW missions'
          }
          break
        case 'LIKE':
        case 'REPOST':
          if (!formData.targetVideoUrl?.trim()) {
            newErrors.targetVideoUrl = 'Video URL is required for LIKE/REPOST missions'
          }
          break
        case 'USE_AUDIO':
          if (!formData.targetAudioId?.trim()) {
            newErrors.targetAudioId = 'Audio ID is required for USE_AUDIO missions'
          }
          break
      }
    }

    // Validate dates
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
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

  const typeOptions = [
    { label: 'Social', value: 'SOCIAL' },
    { label: 'Content', value: 'CONTENT' },
    { label: 'Daily', value: 'DAILY' },
    { label: 'Profile', value: 'PROFILE' },
    { label: 'Referral', value: 'REFERRAL' },
    { label: 'Purchase', value: 'PURCHASE' },
    { label: 'Event', value: 'EVENT' },
  ]

  const difficultyOptions = [
    { label: 'Easy', value: 'EASY' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Hard', value: 'HARD' },
  ]

  const missionTypeOptions = [
    { label: 'None', value: '' },
    { label: 'Follow', value: 'FOLLOW' },
    { label: 'Like', value: 'LIKE' },
    { label: 'Repost', value: 'REPOST' },
    { label: 'Use Audio', value: 'USE_AUDIO' },
  ]

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
            placeholder="e.g., Follow our TikTok account"
            required
            error={errors.title}
            disabled={isLoading}
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Describe what users need to do..."
            required
            error={errors.description}
            disabled={isLoading}
            rows={4}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
            label="Type"
            name="type"
            type="select"
            value={formData.type}
            onChange={(value) => handleChange('type', value)}
            options={typeOptions}
            required
            disabled={isLoading}
          />

            <FormField
            label="Difficulty"
            name="difficulty"
            type="select"
            value={formData.difficulty}
            onChange={(value) => handleChange('difficulty', value)}
            options={difficultyOptions}
            required
            disabled={isLoading}
          />
          </div>
        </div>
      </div>

      {/* TikTok Mission Settings */}
      <div className="rounded-lg border border-red-500/20 bg-card p-6 dark:shadow-lg dark:shadow-red-500/10">
        <h3 className="mb-4 text-lg font-bold text-foreground">TikTok Mission Settings</h3>

        <div className="space-y-4">
          <FormField
            label="Mission Type"
            name="missionType"
            type="select"
            value={formData.missionType || ''}
            onChange={(value) => handleChange('missionType', value || null)}
            options={missionTypeOptions}
            help="Select a TikTok-specific mission type (optional)"
            disabled={isLoading}
          />

          {formData.missionType === 'FOLLOW' && (
            <FormField
            label="Target TikTok Account"
            name="targetTikTokAccount"
            type="text"
            value={formData.targetTikTokAccount || ''}
            onChange={(value) => handleChange('targetTikTokAccount', value)}
            placeholder="@username"
            error={errors.targetTikTokAccount}
            disabled={isLoading}
            help="TikTok username to follow (with or without @)"
          />
          )}

          {(formData.missionType === 'LIKE' || formData.missionType === 'REPOST') && (
            <FormField
            label="Target Video URL"
            name="targetVideoUrl"
            type="text"
            value={formData.targetVideoUrl || ''}
            onChange={(value) => handleChange('targetVideoUrl', value)}
            placeholder="https://www.tiktok.com/@username/video/1234567890"
            error={errors.targetVideoUrl}
            disabled={isLoading}
            help="Full TikTok video URL"
          />
          )}

          {formData.missionType === 'USE_AUDIO' && (
            <FormField
            label="Target Audio ID"
            name="targetAudioId"
            type="text"
            value={formData.targetAudioId || ''}
            onChange={(value) => handleChange('targetAudioId', value)}
            placeholder="1234567890"
            error={errors.targetAudioId}
            disabled={isLoading}
            help="TikTok audio/sound ID"
            />
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoVerify"
              checked={formData.autoVerify}
              onChange={(e) => handleChange('autoVerify', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-red-500/30 bg-[#0a0a0a] text-red-500 focus:ring-2 focus:ring-red-500/20"
            />
            <label htmlFor="autoVerify" className="text-sm text-gray-300">
              Auto-verify via TikTok API
            </label>
          </div>
        </div>
      </div>

      {/* Rewards */}
      <div className="rounded-lg border border-red-500/20 bg-card p-6 dark:shadow-lg dark:shadow-red-500/10">
        <h3 className="mb-4 text-lg font-bold text-foreground">Rewards</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Points"
            name="points"
            type="number"
            value={formData.points}
            onChange={(value) => handleChange('points', Number(value) || 0)}
            min={0}
            error={errors.points}
            disabled={isLoading}
            icon="🎯"
          />

          <FormField
            label="Diamonds"
            name="diamonds"
            type="number"
            value={formData.diamonds}
            onChange={(value) => handleChange('diamonds', Number(value) || 0)}
            min={0}
            error={errors.diamonds}
            disabled={isLoading}
            icon="💎"
          />
        </div>
      </div>

      {/* Status & Schedule */}
      <div className="rounded-lg border border-red-500/20 bg-card p-6 dark:shadow-lg dark:shadow-red-500/10">
        <h3 className="mb-4 text-lg font-bold text-foreground">Status & Schedule</h3>

        <div className="space-y-4">
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
              Mission is active
            </label>
            {formData.isActive ? (
              <StatusBadge variant="success">Active</StatusBadge>
            ) : (
              <StatusBadge variant="neutral">Inactive</StatusBadge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Start Date"
              name="startDate"
              type="datetime-local"
              value={formData.startDate || ''}
              onChange={(value) => handleChange('startDate', value)}
              disabled={isLoading}
              help="Optional: When mission becomes available"
            />

            <FormField
              label="End Date"
              name="endDate"
              type="datetime-local"
              value={formData.endDate || ''}
              onChange={(value) => handleChange('endDate', value)}
              error={errors.endDate}
              disabled={isLoading}
              help="Optional: When mission expires"
            />
          </div>

          <FormField
            label="Max Completions"
            name="maxCompletions"
            type="number"
            value={formData.maxCompletions || ''}
            onChange={(value) =>
              handleChange(
                'maxCompletions',
                value ? Number(value) : undefined
              )
            }
            min={1}
            disabled={isLoading}
            help="Optional: Maximum number of times this mission can be completed globally"
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
              {mode === 'create' ? 'Create Mission' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
