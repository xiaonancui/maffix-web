'use client'

import { useState } from 'react'

interface Mission {
  id: string
  title: string
  description: string
  diamonds: number
  points: number
  estimatedTime: string
  targetTikTokAccount?: string
  missionType: string
  difficulty: string
}

interface AddMissionModalProps {
  onClose: () => void
  onAdd: (mission: Mission) => void
}

export default function AddMissionModal({ onClose, onAdd }: AddMissionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    diamonds: 0,
    points: 0,
    estimatedTime: '',
    targetTikTokAccount: '',
    missionType: 'FOLLOW',
    difficulty: 'EASY'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newMission: Mission = {
      id: `mission-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      diamonds: formData.diamonds,
      points: formData.points,
      estimatedTime: formData.estimatedTime,
      targetTikTokAccount: formData.targetTikTokAccount || undefined,
      missionType: formData.missionType,
      difficulty: formData.difficulty
    }

    onAdd(newMission)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-lg rounded-lg bg-gray-900 border border-gray-800 p-6 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add New Mission</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mission Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none"
              placeholder="Follow @username on TikTok"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none"
              placeholder="Follow the specified TikTok account and submit proof"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Diamonds Reward
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.diamonds}
                onChange={(e) => setFormData(prev => ({ ...prev, diamonds: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Points Reward
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none"
                placeholder="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Time
            </label>
            <input
              type="text"
              required
              value={formData.estimatedTime}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none"
              placeholder="2 minutes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target TikTok Account (Optional)
            </label>
            <input
              type="text"
              value={formData.targetTikTokAccount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetTikTokAccount: e.target.value }))}
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none"
              placeholder="@username"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mission Type
              </label>
              <select
                value={formData.missionType}
                onChange={(e) => setFormData(prev => ({ ...prev, missionType: e.target.value }))}
                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none"
              >
                <option value="FOLLOW">Follow</option>
                <option value="LIKE">Like</option>
                <option value="REPOST">Repost</option>
                <option value="USE_AUDIO">Use Audio</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-[#FF5656] focus:outline-none"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-[#FF5656] px-4 py-2 text-white hover:bg-[#ff3333] transition-colors"
            >
              Add Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
