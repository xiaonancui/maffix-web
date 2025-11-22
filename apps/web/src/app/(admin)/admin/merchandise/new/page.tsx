'use client'

import { useRouter } from 'next/navigation'
import { MerchandiseForm, MerchandiseFormData } from '@/components/admin/MerchandiseForm'

export default function NewMerchandisePage() {
  const router = useRouter()

  const handleSubmit = async (data: MerchandiseFormData) => {
    const response = await fetch('/api/admin/merchandise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to create merchandise')
    }

    router.push('/admin/merchandise')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Add Product</h1>
        <p className="text-gray-400 mt-1">Create a new merchandise product</p>
      </div>

      {/* Form */}
      <MerchandiseForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/merchandise')}
        submitLabel="Create Product"
      />
    </div>
  )
}

