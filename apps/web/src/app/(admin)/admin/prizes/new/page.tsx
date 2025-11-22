'use client'

import { useRouter } from 'next/navigation'
import { PrizeForm } from '@/components/admin/PrizeForm'

export default function NewPrizePage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    const response = await fetch('/api/admin/prizes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to create prize')
    }

    router.push('/admin/prizes')
  }

  const handleCancel = () => {
    router.push('/admin/prizes')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={handleCancel}
          className="text-muted-foreground hover:text-foreground mb-2 flex items-center gap-2"
        >
          ← Back to Prizes
        </button>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Create New Prize</h1>
        <p className="text-muted-foreground mt-1">Add a new prize to the catalog</p>
      </div>

      {/* Form */}
      <PrizeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Create Prize"
      />
    </div>
  )
}

