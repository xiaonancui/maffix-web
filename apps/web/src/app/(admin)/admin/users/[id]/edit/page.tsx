'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FormField from '@/components/admin/FormField'

interface User {
  id: string
  email: string
  name: string
  role: string
  diamondBalance: number
  points: number
  level: number
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: 'USER',
    diamondBalance: 0,
    points: 0,
    level: 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${params.id}`)
      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        setFormData({
          name: data.user.name,
          role: data.user.role,
          diamondBalance: data.user.diamondBalance,
          points: data.user.points,
          level: data.user.level,
        })
      } else {
        console.error('Failed to fetch user:', data.error)
        router.push('/admin/users')
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (formData.diamondBalance < 0) {
      newErrors.diamondBalance = 'Diamond balance cannot be negative'
    }

    if (formData.points < 0) {
      newErrors.points = 'Points cannot be negative'
    }

    if (formData.level < 1) {
      newErrors.level = 'Level must be at least 1'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update user')
      }

      router.push(`/admin/users/${params.id}`)
    } catch (error: any) {
      setErrors({ submit: error.message || 'An unexpected error occurred' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading user...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push(`/admin/users/${params.id}`)}
          className="text-gray-400 hover:text-white mb-2 flex items-center gap-2"
        >
          ← Back to User Details
        </button>
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit User</h1>
        <p className="text-gray-400 mt-1">{user.email}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-[#1a1a1a] border border-red-500/20 rounded-lg p-6 shadow-lg shadow-red-500/10 space-y-6">
          <h2 className="text-lg font-bold text-white">Basic Information</h2>

          <FormField
            label="Name"
            type="text"
            value={formData.name}
            onChange={(value) => {
              setFormData({ ...formData, name: value })
              setErrors({ ...errors, name: '' })
            }}
            error={errors.name}
            required
            placeholder="User name"
          />

          <FormField
            label="Role"
            type="select"
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value })}
            required
            options={[
              { label: 'User', value: 'USER' },
              { label: 'Artist', value: 'ARTIST' },
              { label: 'Admin', value: 'ADMIN' },
            ]}
            helpText="⚠️ Be careful when changing user roles"
          />

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm">
            <strong>Note:</strong> Email cannot be changed. User ID: {user.id}
          </div>
        </div>

        {/* Gamification */}
        <div className="bg-[#1a1a1a] border border-red-500/20 rounded-lg p-6 shadow-lg shadow-red-500/10 space-y-6">
          <h2 className="text-lg font-bold text-white">Gamification</h2>

          <FormField
            label="Diamond Balance"
            type="number"
            value={formData.diamondBalance}
            onChange={(value) => {
              setFormData({ ...formData, diamondBalance: parseInt(value) || 0 })
              setErrors({ ...errors, diamondBalance: '' })
            }}
            error={errors.diamondBalance}
            required
            min={0}
            placeholder="0"
            helpText="User's current diamond balance"
          />

          <FormField
            label="Points"
            type="number"
            value={formData.points}
            onChange={(value) => {
              setFormData({ ...formData, points: parseInt(value) || 0 })
              setErrors({ ...errors, points: '' })
            }}
            error={errors.points}
            required
            min={0}
            placeholder="0"
            helpText="User's total points earned"
          />

          <FormField
            label="Level"
            type="number"
            value={formData.level}
            onChange={(value) => {
              setFormData({ ...formData, level: parseInt(value) || 1 })
              setErrors({ ...errors, level: '' })
            }}
            error={errors.level}
            required
            min={1}
            placeholder="1"
            helpText="User's current level"
          />
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
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all shadow-lg shadow-red-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/users/${params.id}`)}
            disabled={submitting}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

