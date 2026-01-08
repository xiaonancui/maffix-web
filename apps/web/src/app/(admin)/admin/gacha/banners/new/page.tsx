'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import FormField from '@/components/admin/FormField'
import { ArrowLeft, Music, Save, Loader2 } from 'lucide-react'

interface BannerFormData {
  name: string
  slug: string
  description: string
  backgroundVideoUrl: string
  currencyType: 'DIAMONDS' | 'TICKETS'
  costPerPull: number
  startDate: string
  endDate: string
  isActive: boolean
  sortOrder: number
}

export default function NewBannerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<BannerFormData>({
    name: '',
    slug: '',
    description: '',
    backgroundVideoUrl: '',
    currencyType: 'DIAMONDS',
    costPerPull: 300,
    startDate: '',
    endDate: '',
    isActive: true,
    sortOrder: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    setFormData({ ...formData, name, slug })
    setErrors({ ...errors, name: '', slug: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Banner name is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    }

    if (!formData.backgroundVideoUrl.trim()) {
      newErrors.backgroundVideoUrl = 'Video URL is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    if (formData.costPerPull <= 0) {
      newErrors.costPerPull = 'Cost must be greater than 0'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/admin/gacha/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/admin/gacha/banners')
      } else {
        setErrors({ submit: data.error || 'Failed to create banner' })
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'An unexpected error occurred' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="space-y-6">
        {/* Header */}
        <AdminPageHeader
          title="New Banner"
          description="Create a new gacha banner with schedule"
          actions={
            <Link
              href="/admin/gacha/banners"
              className="flex items-center gap-2 rounded-2xl border-2 border-white/10 bg-white/5 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Banners
            </Link>
          }
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#8B5CF6]/20 p-3 ring-2 ring-[#8B5CF6]/30">
                <Music className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">
                Banner Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Banner Name"
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                error={errors.name}
                required
                placeholder="e.g., Beat Like Dat, SYBAU"
              />

              <FormField
                label="Slug"
                type="text"
                value={formData.slug}
                onChange={(value) => {
                  setFormData({ ...formData, slug: value })
                  setErrors({ ...errors, slug: '' })
                }}
                error={errors.slug}
                required
                placeholder="e.g., beat-like-dat"
                helpText="URL-friendly identifier (auto-generated)"
              />
            </div>

            <FormField
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Optional description for the banner..."
              rows={3}
            />

            <FormField
              label="Background Video URL"
              type="text"
              value={formData.backgroundVideoUrl}
              onChange={(value) => {
                setFormData({ ...formData, backgroundVideoUrl: value })
                setErrors({ ...errors, backgroundVideoUrl: '' })
              }}
              error={errors.backgroundVideoUrl}
              required
              placeholder="e.g., /banners/beat-like-dat.mp4 or https://..."
              helpText="MP4 video URL for the banner background"
            />
          </div>

          {/* Pricing */}
          <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
            <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">
              Pricing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Currency Type"
                type="select"
                value={formData.currencyType}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    currencyType: value as 'DIAMONDS' | 'TICKETS',
                    costPerPull: value === 'DIAMONDS' ? 300 : 1,
                  })
                }
                required
                options={[
                  { label: 'Diamonds', value: 'DIAMONDS' },
                  { label: 'Tickets', value: 'TICKETS' },
                ]}
              />

              <FormField
                label="Cost Per Single Pull"
                type="number"
                value={formData.costPerPull}
                onChange={(value) => {
                  setFormData({ ...formData, costPerPull: parseInt(value) || 0 })
                  setErrors({ ...errors, costPerPull: '' })
                }}
                error={errors.costPerPull}
                required
                min={1}
                helpText={
                  formData.currencyType === 'DIAMONDS'
                    ? '10x pull will cost 10x this amount (e.g., 3000 for 10x)'
                    : 'Tickets for single pull'
                }
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
            <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">
              Schedule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Start Date"
                type="datetime-local"
                value={formData.startDate}
                onChange={(value) => {
                  setFormData({ ...formData, startDate: value })
                  setErrors({ ...errors, startDate: '' })
                }}
                error={errors.startDate}
                required
              />

              <FormField
                label="End Date"
                type="datetime-local"
                value={formData.endDate}
                onChange={(value) => {
                  setFormData({ ...formData, endDate: value })
                  setErrors({ ...errors, endDate: '' })
                }}
                error={errors.endDate}
                required
              />
            </div>
          </div>

          {/* Display Settings */}
          <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
            <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">
              Display Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Active"
                type="select"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(value) =>
                  setFormData({ ...formData, isActive: value === 'true' })
                }
                options={[
                  { label: 'Yes', value: 'true' },
                  { label: 'No', value: 'false' },
                ]}
                helpText="Banner must be active AND within schedule to be shown"
              />

              <FormField
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(value) =>
                  setFormData({ ...formData, sortOrder: parseInt(value) || 0 })
                }
                min={0}
                placeholder="0"
                helpText="Lower numbers appear first"
              />
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#FF1F7D]" />
              ) : (
                <Save className="h-5 w-5 text-[#FF1F7D]" />
              )}
              <span className="text-[#FF1F7D]">
                {submitting ? 'Creating...' : 'Create Banner'}
              </span>
            </button>
            <Link
              href="/admin/gacha/banners"
              className="rounded-2xl border-2 border-white/10 bg-white/5 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white hover:scale-105 transition-all duration-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
