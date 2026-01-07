'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import FormField from '@/components/admin/FormField'
import { Save } from 'lucide-react'

interface SiteSettings {
  // Site Information
  siteName: string
  siteDescription: string
  siteUrl: string
  logoUrl: string
  faviconUrl: string
  
  // Email Configuration
  emailEnabled: boolean
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  emailFrom: string
  emailFromName: string
  
  // API Keys
  tiktokApiKey: string
  tiktokApiSecret: string
  googleAnalyticsId: string
  facebookPixelId: string
  
  // Feature Flags
  enableGacha: boolean
  enableStore: boolean
  enableMissions: boolean
  enablePrizes: boolean
  enableReleases: boolean
  
  // Maintenance
  maintenanceMode: boolean
  maintenanceMessage: string
  maintenanceAllowedIPs: string[]
  
  // Social Media
  tiktokUrl: string
  instagramUrl: string
  twitterUrl: string
  youtubeUrl: string
  
  // Advanced
  debugMode: boolean
  logLevel: string
  maxUploadSize: number
}

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Maffix',
    siteDescription: 'TikTok-focused MVP platform for musician-fan engagement',
    siteUrl: 'https://maffix.com',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    emailEnabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    emailFrom: 'noreply@maffix.com',
    emailFromName: 'Maffix',
    tiktokApiKey: '',
    tiktokApiSecret: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    enableGacha: true,
    enableStore: true,
    enableMissions: true,
    enablePrizes: true,
    enableReleases: true,
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
    maintenanceAllowedIPs: [],
    tiktokUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    debugMode: false,
    logLevel: 'info',
    maxUploadSize: 10,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      if (data.success && data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch site settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        alert('Site settings saved successfully!')
      } else {
        alert('Failed to save settings: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to save site settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white/60">Loading settings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="space-y-6">
        <AdminPageHeader
          title="Site Settings"
          description="Configure site-wide settings, API keys, and feature flags"
          action={{
            label: saving ? 'Saving...' : 'Save Settings',
            onClick: handleSave,
            disabled: saving,
          }}
        />

        {/* Site Information */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Site Information</h2>
          <div className="space-y-4">
            <FormField
              label="Site Name"
              value={settings.siteName}
              onChange={(value) => updateSetting('siteName', value)}
              placeholder="Maffix"
            />
            <FormField
              label="Site Description"
              value={settings.siteDescription}
              onChange={(value) => updateSetting('siteDescription', value)}
              type="textarea"
              rows={3}
            />
            <FormField
              label="Site URL"
              value={settings.siteUrl}
              onChange={(value) => updateSetting('siteUrl', value)}
              placeholder="https://maffix.com"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Logo URL"
                value={settings.logoUrl}
                onChange={(value) => updateSetting('logoUrl', value)}
                placeholder="/logo.png"
              />
              <FormField
                label="Favicon URL"
                value={settings.faviconUrl}
                onChange={(value) => updateSetting('faviconUrl', value)}
                placeholder="/favicon.ico"
              />
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Email Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="emailEnabled" className="text-white font-medium cursor-pointer">Email Enabled</label>
                <p className="text-sm text-white/60">Enable email notifications</p>
              </div>
              <input
                id="emailEnabled"
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => updateSetting('emailEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-[#10B981]/30 bg-surface-base text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 cursor-pointer"
              />
            </div>
            {settings.emailEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="SMTP Host"
                    value={settings.smtpHost}
                    onChange={(value) => updateSetting('smtpHost', value)}
                    placeholder="smtp.gmail.com"
                  />
                  <FormField
                    label="SMTP Port"
                    value={settings.smtpPort.toString()}
                    onChange={(value) => updateSetting('smtpPort', parseInt(value) || 587)}
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="SMTP User"
                    value={settings.smtpUser}
                    onChange={(value) => updateSetting('smtpUser', value)}
                    placeholder="user@gmail.com"
                  />
                  <FormField
                    label="SMTP Password"
                    value={settings.smtpPassword}
                    onChange={(value) => updateSetting('smtpPassword', value)}
                    type="password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="From Email"
                    value={settings.emailFrom}
                    onChange={(value) => updateSetting('emailFrom', value)}
                    placeholder="noreply@maffix.com"
                  />
                  <FormField
                    label="From Name"
                    value={settings.emailFromName}
                    onChange={(value) => updateSetting('emailFromName', value)}
                    placeholder="Maffix"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">API Keys</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="TikTok API Key"
                value={settings.tiktokApiKey}
                onChange={(value) => updateSetting('tiktokApiKey', value)}
                type="password"
                placeholder="Enter TikTok API key"
              />
              <FormField
                label="TikTok API Secret"
                value={settings.tiktokApiSecret}
                onChange={(value) => updateSetting('tiktokApiSecret', value)}
                type="password"
                placeholder="Enter TikTok API secret"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Google Analytics ID"
                value={settings.googleAnalyticsId}
                onChange={(value) => updateSetting('googleAnalyticsId', value)}
                placeholder="G-XXXXXXXXXX"
              />
              <FormField
                label="Facebook Pixel ID"
                value={settings.facebookPixelId}
                onChange={(value) => updateSetting('facebookPixelId', value)}
                placeholder="Enter Facebook Pixel ID"
              />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Feature Flags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="enableGacha" className="text-white font-medium cursor-pointer">Enable Gacha</label>
                <p className="text-sm text-white/60">Enable gacha system</p>
              </div>
              <input
                id="enableGacha"
                type="checkbox"
                checked={settings.enableGacha}
                onChange={(e) => updateSetting('enableGacha', e.target.checked)}
                className="h-4 w-4 rounded border-[#8B5CF6]/30 bg-surface-base text-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="enableStore" className="text-white font-medium cursor-pointer">Enable Store</label>
                <p className="text-sm text-white/60">Enable merchandise store</p>
              </div>
              <input
                id="enableStore"
                type="checkbox"
                checked={settings.enableStore}
                onChange={(e) => updateSetting('enableStore', e.target.checked)}
                className="h-4 w-4 rounded border-[#00F5FF]/30 bg-surface-base text-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="enableMissions" className="text-white font-medium cursor-pointer">Enable Missions</label>
                <p className="text-sm text-white/60">Enable mission system</p>
              </div>
              <input
                id="enableMissions"
                type="checkbox"
                checked={settings.enableMissions}
                onChange={(e) => updateSetting('enableMissions', e.target.checked)}
                className="h-4 w-4 rounded border-[#FFC700]/30 bg-surface-base text-[#FFC700] focus:ring-2 focus:ring-[#FFC700]/20 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="enablePrizes" className="text-white font-medium cursor-pointer">Enable Prizes</label>
                <p className="text-sm text-white/60">Enable prize system</p>
              </div>
              <input
                id="enablePrizes"
                type="checkbox"
                checked={settings.enablePrizes}
                onChange={(e) => updateSetting('enablePrizes', e.target.checked)}
                className="h-4 w-4 rounded border-[#FF1F7D]/30 bg-surface-base text-[#FF1F7D] focus:ring-2 focus:ring-[#FF1F7D]/20 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="enableReleases" className="text-white font-medium cursor-pointer">Enable Releases</label>
                <p className="text-sm text-white/60">Enable release system</p>
              </div>
              <input
                id="enableReleases"
                type="checkbox"
                checked={settings.enableReleases}
                onChange={(e) => updateSetting('enableReleases', e.target.checked)}
                className="h-4 w-4 rounded border-[#10B981]/30 bg-surface-base text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Maintenance Mode</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="maintenanceMode" className="text-white font-medium cursor-pointer">Maintenance Mode</label>
                <p className="text-sm text-white/60">Put entire site in maintenance mode</p>
              </div>
              <input
                id="maintenanceMode"
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                className="h-4 w-4 rounded border-[#FF1F7D]/30 bg-surface-base text-[#FF1F7D] focus:ring-2 focus:ring-[#FF1F7D]/20 cursor-pointer"
              />
            </div>
            {settings.maintenanceMode && (
              <FormField
                label="Maintenance Message"
                value={settings.maintenanceMessage}
                onChange={(value) => updateSetting('maintenanceMessage', value)}
                type="textarea"
                rows={3}
              />
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="TikTok URL"
              value={settings.tiktokUrl}
              onChange={(value) => updateSetting('tiktokUrl', value)}
              placeholder="https://tiktok.com/@maffix"
            />
            <FormField
              label="Instagram URL"
              value={settings.instagramUrl}
              onChange={(value) => updateSetting('instagramUrl', value)}
              placeholder="https://instagram.com/maffix"
            />
            <FormField
              label="Twitter URL"
              value={settings.twitterUrl}
              onChange={(value) => updateSetting('twitterUrl', value)}
              placeholder="https://twitter.com/maffix"
            />
            <FormField
              label="YouTube URL"
              value={settings.youtubeUrl}
              onChange={(value) => updateSetting('youtubeUrl', value)}
              placeholder="https://youtube.com/@maffix"
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Advanced Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="debugMode" className="text-white font-medium cursor-pointer">Debug Mode</label>
                <p className="text-sm text-white/60">Enable debug logging</p>
              </div>
              <input
                id="debugMode"
                type="checkbox"
                checked={settings.debugMode}
                onChange={(e) => updateSetting('debugMode', e.target.checked)}
                className="h-4 w-4 rounded border-[#8B5CF6]/30 bg-surface-base text-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Log Level"
                value={settings.logLevel}
                onChange={(value) => updateSetting('logLevel', value)}
                placeholder="info"
                helpText="Options: debug, info, warn, error"
              />
              <FormField
                label="Max Upload Size (MB)"
                value={settings.maxUploadSize.toString()}
                onChange={(value) => updateSetting('maxUploadSize', parseInt(value) || 10)}
                type="number"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#FF1F7D]/40 bg-gradient-to-r from-[#FF1F7D]/20 to-[#FF1F7D]/10 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF1F7D]/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#FF1F7D]/60 hover:shadow-[#FF1F7D]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Save className="h-5 w-5 text-[#FF1F7D]" />
            <span className="text-[#FF1F7D]">{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

