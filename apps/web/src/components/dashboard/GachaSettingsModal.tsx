'use client'

import { useState } from 'react'

interface GachaSettings {
  legendaryRate: number
  ssrRate: number
  epicRate: number
  rareRate: number
  commonRate: number
  guaranteedSSRAfter: number
  diamondCostSingle: number
  diamondCost10x: number
}

interface GachaSettingsModalProps {
  onClose: () => void
  onSave: (settings: GachaSettings) => void
}

export default function GachaSettingsModal({ onClose, onSave }: GachaSettingsModalProps) {
  const [settings, setSettings] = useState<GachaSettings>({
    legendaryRate: 0.5,
    ssrRate: 2.0,
    epicRate: 7.5,
    rareRate: 20.0,
    commonRate: 70.0,
    guaranteedSSRAfter: 10,
    diamondCostSingle: 100,
    diamondCost10x: 900
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that rates add up to 100%
    const totalRate = settings.legendaryRate + settings.ssrRate + settings.epicRate + settings.rareRate + settings.commonRate
    if (Math.abs(totalRate - 100) > 0.1) {
      alert('Error: Drop rates must add up to 100%')
      return
    }

    onSave(settings)
    onClose()
  }

  const updateSetting = (key: keyof GachaSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-secondary border border-border p-6 max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Gacha Settings</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drop Rates Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Drop Rates (%)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Legendary Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.legendaryRate}
                  onChange={(e) => updateSetting('legendaryRate', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-600 bg-secondary px-3 py-2 text-foreground focus:border-[#FF5656] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  SSR Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.ssrRate}
                  onChange={(e) => updateSetting('ssrRate', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-600 bg-secondary px-3 py-2 text-foreground focus:border-[#FF5656] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Epic Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.epicRate}
                  onChange={(e) => updateSetting('epicRate', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-600 bg-secondary px-3 py-2 text-foreground focus:border-[#FF5656] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Rare Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.rareRate}
                  onChange={(e) => updateSetting('rareRate', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-600 bg-secondary px-3 py-2 text-foreground focus:border-[#FF5656] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Common Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.commonRate}
                  onChange={(e) => updateSetting('commonRate', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-600 bg-secondary px-3 py-2 text-foreground focus:border-[#FF5656] focus:outline-none"
                />
              </div>
            </div>

            {/* Rate Summary */}
            <div className="mt-4 p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">
                Total Rate: {(settings.legendaryRate + settings.ssrRate + settings.epicRate + settings.rareRate + settings.commonRate).toFixed(1)}%
                {Math.abs((settings.legendaryRate + settings.ssrRate + settings.epicRate + settings.rareRate + settings.commonRate) - 100) > 0.1 && (
                  <span className="text-red-400 ml-2">⚠️ Must equal 100%</span>
                )}
              </p>
            </div>
          </div>

          {/* Pity System */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Pity System</h3>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Guaranteed SSR After (pulls)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.guaranteedSSRAfter}
                onChange={(e) => updateSetting('guaranteedSSRAfter', parseInt(e.target.value) || 10)}
                className="w-full rounded-md border border-gray-600 bg-secondary px-3 py-2 text-foreground focus:border-[#FF5656] focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Single Pull Cost (Diamonds)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.diamondCostSingle}
                  onChange={(e) => updateSetting('diamondCostSingle', parseInt(e.target.value) || 100)}
                  className="w-full rounded-md border border-gray-600 bg-secondary px-3 py-2 text-foreground focus:border-[#FF5656] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  10x Pull Cost (Diamonds)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.diamondCost10x}
                  onChange={(e) => updateSetting('diamondCost10x', parseInt(e.target.value) || 900)}
                  className="w-full rounded-md border border-gray-600 bg-secondary px-3 py-2 text-foreground focus:border-[#FF5656] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              Discount: {((1 - (settings.diamondCost10x / (settings.diamondCostSingle * 10))) * 100).toFixed(1)}% off for 10x pulls
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-600 bg-secondary px-4 py-2 text-muted-foreground hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-[#FF5656] px-4 py-2 text-foreground hover:bg-[#ff3333] transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
