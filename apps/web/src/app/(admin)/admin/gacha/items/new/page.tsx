'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FormField from '@/components/admin/FormField'
import StatusBadge from '@/components/admin/StatusBadge'

interface Prize {
  id: string
  name: string
  description: string
  rarity: string
  type: string
  image: string | null
  value: number
  isActive: boolean
}

export default function NewGachaItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [formData, setFormData] = useState({
    prizeId: '',
    probability: 0,
    isActive: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchPrizes()
  }, [])

  const fetchPrizes = async () => {
    try {
      setLoading(true)
      // Fetch all active prizes
      const response = await fetch('/api/prizes')
      const data = await response.json()

      if (data.success && data.data.prizes) {
        setPrizes(data.data.prizes.filter((p: Prize) => p.isActive))
      }
    } catch (error) {
      console.error('Failed to fetch prizes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.prizeId) {
      newErrors.prizeId = 'Please select a prize'
    }

    if (formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 0 and 100'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/admin/gacha/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/admin/gacha')
      } else {
        setErrors({ submit: data.error || 'Failed to create gacha item' })
      }
    } catch (error) {
      console.error('Failed to create gacha item:', error)
      setErrors({ submit: 'An unexpected error occurred' })
    } finally {
      setSubmitting(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      COMMON: 'gray',
      RARE: 'blue',
      EPIC: 'purple',
      SSR: 'yellow',
      LEGENDARY: 'red',
    }
    return colors[rarity] || 'gray'
  }

  const selectedPrize = prizes.find((p) => p.id === formData.prizeId)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Add Gacha Item</h1>
        <p className="text-gray-400 mt-1">Create a new gacha item from an existing prize</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a1a1a] border border-red-500/20 rounded-lg p-6 shadow-lg shadow-red-500/10 space-y-6">
          <h2 className="text-lg font-bold text-white">Gacha Item Details</h2>

          <FormField
            label="Prize"
            type="select"
            value={formData.prizeId}
            onChange={(value) => {
              setFormData({ ...formData, prizeId: value })
              setErrors({ ...errors, prizeId: '' })
            }}
            error={errors.prizeId}
            required
            options={[
              { label: 'Select a prize...', value: '' },
              ...prizes.map((prize) => ({
                label: `${prize.name} (${prize.rarity})`,
                value: prize.id,
              })),
            ]}
            helpText="Select the prize that this gacha item will award"
          />

          {selectedPrize && (
            <div className="p-4 bg-gray-900/50 border border-red-500/20 rounded-lg">
              <div className="flex items-start gap-4">
                {selectedPrize.image && (
                  <img
                    src={selectedPrize.image}
                    alt={selectedPrize.name}
                    className="w-20 h-20 rounded-lg object-cover border border-red-500/20"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{selectedPrize.name}</h3>
                    <StatusBadge variant={getRarityColor(selectedPrize.rarity)}>
                      {selectedPrize.rarity}
                    </StatusBadge>
                  </div>
                  <p className="text-gray-400 text-sm">{selectedPrize.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Type: {selectedPrize.type}</span>
                    <span className="text-yellow-400">
                      💎 {selectedPrize.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <FormField
            label="Probability (%)"
            type="number"
            value={formData.probability}
            onChange={(value) => {
              setFormData({ ...formData, probability: parseFloat(value) || 0 })
              setErrors({ ...errors, probability: '' })
            }}
            error={errors.probability}
            required
            min={0}
            max={100}
            step={0.01}
            helpText="Probability of this item being selected (0-100%). Make sure total probabilities add up correctly."
          />

          <FormField
            label="Status"
            type="select"
            value={formData.isActive ? 'true' : 'false'}
            onChange={(value) => {
              setFormData({ ...formData, isActive: value === 'true' })
            }}
            options={[
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
            helpText="Inactive items will not appear in gacha pulls"
          />

          {errors.submit && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting || loading}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all shadow-lg shadow-red-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Gacha Item'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/gacha')}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-red-500/30"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

