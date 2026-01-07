'use client'

import { useState, useEffect } from 'react'
import FormField from './FormField'

export interface PremiumPackFormData {
  name: string
  description: string
  price: number
  currency: string
  guaranteedPrizeId: string | null
  bonusTickets: number
  bonusDiamonds: number
  imageUrl: string | null
  featured: boolean
  sortOrder: number
  isActive: boolean
}

interface Prize {
  id: string
  name: string
  rarity: string
  type: string
  image: string | null
}

interface PremiumPackFormProps {
  initialData?: Partial<PremiumPackFormData>
  onSubmit: (data: PremiumPackFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function PremiumPackForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Pack',
}: PremiumPackFormProps) {
  const [formData, setFormData] = useState<PremiumPackFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    currency: initialData?.currency || 'USD',
    guaranteedPrizeId: initialData?.guaranteedPrizeId || null,
    bonusTickets: initialData?.bonusTickets || 0,
    bonusDiamonds: initialData?.bonusDiamonds || 0,
    imageUrl: initialData?.imageUrl || null,
    featured: initialData?.featured ?? false,
    sortOrder: initialData?.sortOrder || 0,
    isActive: initialData?.isActive ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [loadingPrizes, setLoadingPrizes] = useState(true)

  useEffect(() => {
    fetchPrizes()
  }, [])

  const fetchPrizes = async () => {
    try {
      setLoadingPrizes(true)
      const response = await fetch('/api/prizes')
      const data = await response.json()

      if (data.success) {
        setPrizes(data.prizes || [])
      }
    } catch (error) {
      console.error('Failed to fetch prizes:', error)
    } finally {
      setLoadingPrizes(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Pack name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (formData.bonusTickets < 0) {
      newErrors.bonusTickets = 'Bonus tickets cannot be negative'
    }

    if (formData.bonusDiamonds < 0) {
      newErrors.bonusDiamonds = 'Bonus diamonds cannot be negative'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)
      await onSubmit(formData)
    } catch (error: any) {
      setErrors({ submit: error.message || 'An unexpected error occurred' })
    } finally {
      setSubmitting(false)
    }
  }

  const selectedPrize = prizes.find((p) => p.id === formData.guaranteedPrizeId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
        <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">Basic Information</h2>

        <FormField
          label="Pack Name"
          type="text"
          value={formData.name}
          onChange={(value) => {
            setFormData({ ...formData, name: value })
            setErrors({ ...errors, name: '' })
          }}
          error={errors.name}
          required
          placeholder="e.g., Starter Pack, VIP Bundle"
        />

        <FormField
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(value) => {
            setFormData({ ...formData, description: value })
            setErrors({ ...errors, description: '' })
          }}
          error={errors.description}
          required
          placeholder="Detailed pack description..."
          rows={4}
        />
      </div>

      {/* Pricing */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
        <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">Pricing</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Price"
            type="number"
            value={formData.price}
            onChange={(value) => {
              setFormData({ ...formData, price: parseFloat(value) || 0 })
              setErrors({ ...errors, price: '' })
            }}
            error={errors.price}
            required
            min={0}
            step={0.01}
            placeholder="29.99"
          />

          <FormField
            label="Currency"
            type="select"
            value={formData.currency}
            onChange={(value) => setFormData({ ...formData, currency: value })}
            required
            options={[
              { label: 'USD', value: 'USD' },
              { label: 'EUR', value: 'EUR' },
              { label: 'GBP', value: 'GBP' },
            ]}
          />
        </div>
      </div>

      {/* Pack Contents */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
        <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">Pack Contents</h2>

        <FormField
          label="Guaranteed Prize"
          type="select"
          value={formData.guaranteedPrizeId || ''}
          onChange={(value) =>
            setFormData({ ...formData, guaranteedPrizeId: value || null })
          }
          options={[
            { label: 'None', value: '' },
            ...prizes.map((prize) => ({
              label: `${prize.name} (${prize.rarity})`,
              value: prize.id,
            })),
          ]}
          helpText="Optional: Select a guaranteed prize for this pack"
        />

        {selectedPrize && (
          <div className="p-4 bg-[#8B5CF6]/10 border-2 border-[#8B5CF6]/30 rounded-lg">
            <div className="flex items-center gap-3">
              {selectedPrize.image && (
                <img
                  src={selectedPrize.image}
                  alt={selectedPrize.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <div className="font-medium text-white">{selectedPrize.name}</div>
                <div className="text-sm text-white/60">
                  {selectedPrize.rarity} • {selectedPrize.type}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Bonus Draw Tickets"
            type="number"
            value={formData.bonusTickets}
            onChange={(value) => {
              setFormData({ ...formData, bonusTickets: parseInt(value) || 0 })
              setErrors({ ...errors, bonusTickets: '' })
            }}
            error={errors.bonusTickets}
            min={0}
            placeholder="0"
            helpText="Number of free gacha draw tickets"
          />

          <FormField
            label="Bonus Diamonds"
            type="number"
            value={formData.bonusDiamonds}
            onChange={(value) => {
              setFormData({ ...formData, bonusDiamonds: parseInt(value) || 0 })
              setErrors({ ...errors, bonusDiamonds: '' })
            }}
            error={errors.bonusDiamonds}
            min={0}
            placeholder="0"
            helpText="Bonus diamonds included in pack"
          />
        </div>
      </div>

      {/* Display Settings */}
      <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm space-y-6">
        <h2 className="font-display text-xl font-black uppercase tracking-wider text-white">Display Settings</h2>

        <FormField
          label="Image URL"
          type="text"
          value={formData.imageUrl || ''}
          onChange={(value) => setFormData({ ...formData, imageUrl: value || null })}
          placeholder="https://example.com/pack-image.jpg"
          helpText="Optional: Pack image URL"
        />

        {formData.imageUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Image Preview
            </label>
            <img
              src={formData.imageUrl}
              alt="Pack preview"
              className="w-48 h-48 object-cover rounded-lg border-2 border-white/10"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Featured"
            type="select"
            value={formData.featured ? 'true' : 'false'}
            onChange={(value) =>
              setFormData({ ...formData, featured: value === 'true' })
            }
            options={[
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ]}
            helpText="Show in featured section"
          />

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
            helpText="Available for purchase"
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
        <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-lg text-red-400 text-sm">
          {errors.submit}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || loadingPrizes}
          className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="text-[#FF1F7D]">{submitting ? 'Saving...' : submitLabel}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-2xl border-2 border-white/10 bg-white/5 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

