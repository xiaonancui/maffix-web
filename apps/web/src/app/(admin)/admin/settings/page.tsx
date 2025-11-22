'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading settings...</div>
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Site Information</h2>
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Email Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Email Enabled</label>
                <p className="text-sm text-muted-foreground">Enable email notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => updateSetting('emailEnabled', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">API Keys</h2>
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Feature Flags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Enable Gacha</label>
                <p className="text-sm text-muted-foreground">Enable gacha system</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableGacha}
                onChange={(e) => updateSetting('enableGacha', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Enable Store</label>
                <p className="text-sm text-muted-foreground">Enable merchandise store</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableStore}
                onChange={(e) => updateSetting('enableStore', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Enable Missions</label>
                <p className="text-sm text-muted-foreground">Enable mission system</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableMissions}
                onChange={(e) => updateSetting('enableMissions', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Enable Prizes</label>
                <p className="text-sm text-muted-foreground">Enable prize system</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enablePrizes}
                onChange={(e) => updateSetting('enablePrizes', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Enable Releases</label>
                <p className="text-sm text-muted-foreground">Enable release system</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableReleases}
                onChange={(e) => updateSetting('enableReleases', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Maintenance Mode</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Maintenance Mode</label>
                <p className="text-sm text-muted-foreground">Put entire site in maintenance mode</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Social Media Links</h2>
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Advanced Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Debug Mode</label>
                <p className="text-sm text-muted-foreground">Enable debug logging</p>
              </div>
              <input
                type="checkbox"
                checked={settings.debugMode}
                onChange={(e) => updateSetting('debugMode', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
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
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary bg-transparent text-primary rounded-lg hover:bg-primary/10 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gradient-to-r dark:from-red-600 dark:to-red-500 dark:text-primary-foreground dark:border-transparent dark:hover:from-red-700 dark:hover:to-red-600"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

