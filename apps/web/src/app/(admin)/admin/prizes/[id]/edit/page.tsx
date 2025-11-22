'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PrizeForm } from '@/components/admin/PrizeForm'

interface Prize {
  id: string
  name: string
  description: string
  rarity: string
  type: string
  image: string | null
  value: number
  stock: number | null
  isActive: boolean
}

export default function EditPrizePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [prize, setPrize] = useState<Prize | null>(null)

  useEffect(() => {
    fetchPrize()
  }, [params.id])

  const fetchPrize = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/prizes/${params.id}`)
      const data = await response.json()

      if (data.success && data.prize) {
        setPrize(data.prize)
      } else {
        console.error('Failed to fetch prize:', data.error)
        router.push('/admin/prizes')
      }
    } catch (error) {
      console.error('Failed to fetch prize:', error)
      router.push('/admin/prizes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    const response = await fetch(`/api/admin/prizes/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update prize')
    }

    router.push('/admin/prizes')
  }

  const handleCancel = () => {
    router.push('/admin/prizes')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading prize...</div>
      </div>
    )
  }

  if (!prize) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-white mb-2 flex items-center gap-2"
        >
          ← Back to Prizes
        </button>
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Prize</h1>
        <p className="text-gray-400 mt-1">{prize.name}</p>
      </div>

      {/* Form */}
      <PrizeForm
        initialData={prize}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Save Changes"
      />
    </div>
  )
}

