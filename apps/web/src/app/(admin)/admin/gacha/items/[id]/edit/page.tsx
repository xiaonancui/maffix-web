'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FormField from '@/components/admin/FormField'
import StatusBadge from '@/components/admin/StatusBadge'

interface GachaItem {
  id: string
  prizeId: string
  probability: number
  isActive: boolean
  prize: {
    id: string
    name: string
    description: string
    rarity: string
    type: string
    image: string | null
    value: number
  }
  _count: {
    pulls: number
  }
}

export default function EditGachaItemPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [gachaItem, setGachaItem] = useState<GachaItem | null>(null)
  const [formData, setFormData] = useState({
    probability: 0,
    isActive: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchGachaItem = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/gacha/items/${params.id}`)
        const data = await response.json()

        if (data.success && data.data.gachaItem) {
          const item = data.data.gachaItem
          setGachaItem(item)
          setFormData({
            probability: item.probability,
            isActive: item.isActive,
          })
        } else {
          console.error('Failed to fetch gacha item:', data.error)
          router.push('/admin/gacha')
        }
      } catch (error) {
        console.error('Failed to fetch gacha item:', error)
        router.push('/admin/gacha')
      } finally {
        setLoading(false)
      }
    }

    fetchGachaItem()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 0 and 100'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch(`/api/admin/gacha/items/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/admin/gacha')
      } else {
        setErrors({ submit: data.error || 'Failed to update gacha item' })
      }
    } catch (error) {
      console.error('Failed to update gacha item:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading gacha item...</div>
      </div>
    )
  }

  if (!gachaItem) {
    return null
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Edit Gacha Item</h1>
        <p className="text-muted-foreground mt-1">Update probability and status for this gacha item</p>
      </div>

      {/* Prize Information */}
      <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
        <h2 className="text-lg font-bold text-foreground mb-4">Prize Information</h2>
        <div className="flex items-start gap-4">
          {gachaItem.prize.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gachaItem.prize.image}
              alt={gachaItem.prize.name}
              className="w-24 h-24 rounded-lg object-cover border border-border"
            />
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-xl font-bold text-foreground">{gachaItem.prize.name}</h3>
              <StatusBadge variant={getRarityColor(gachaItem.prize.rarity)}>
                {gachaItem.prize.rarity}
              </StatusBadge>
            </div>
            <p className="text-muted-foreground">{gachaItem.prize.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Type: {gachaItem.prize.type}</span>
              <span className="text-yellow-400">💎 {gachaItem.prize.value.toLocaleString()}</span>
              <span className="text-muted-foreground">
                Total Pulls: {gachaItem._count.pulls.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10 space-y-6">
          <h2 className="text-lg font-bold text-foreground">Gacha Settings</h2>

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
            helpText="Probability of this item being selected (0-100%)"
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
              disabled={submitting}
              className="px-6 py-2 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/gacha')}
              className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-gray-700 transition-colors border border-red-500/30"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

