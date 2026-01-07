'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import FormField from '@/components/admin/FormField'

interface StoreSettings {
  // Payment Settings
  paymentMethods: {
    klarna: boolean
    stripe: boolean
    paypal: boolean
  }
  klarnaApiKey: string
  stripePublicKey: string
  stripeSecretKey: string
  
  // Shipping Settings
  shippingEnabled: boolean
  freeShippingThreshold: number
  defaultShippingRate: number
  internationalShipping: boolean
  internationalShippingRate: number
  
  // Tax Settings
  taxEnabled: boolean
  taxRate: number
  taxIncludedInPrice: boolean
  
  // Currency Settings
  currency: string
  currencySymbol: string
  
  // Order Settings
  orderPrefix: string
  autoConfirmOrders: boolean
  lowStockThreshold: number
  
  // Store Settings
  storeEnabled: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
}

export default function StoreSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<StoreSettings>({
    paymentMethods: {
      klarna: true,
      stripe: true,
      paypal: false,
    },
    klarnaApiKey: '',
    stripePublicKey: '',
    stripeSecretKey: '',
    shippingEnabled: true,
    freeShippingThreshold: 100,
    defaultShippingRate: 9.99,
    internationalShipping: true,
    internationalShippingRate: 29.99,
    taxEnabled: true,
    taxRate: 8.5,
    taxIncludedInPrice: false,
    currency: 'USD',
    currencySymbol: '$',
    orderPrefix: 'MFX',
    autoConfirmOrders: false,
    lowStockThreshold: 10,
    storeEnabled: true,
    maintenanceMode: false,
    maintenanceMessage: 'Store is currently under maintenance. Please check back later.',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/store/settings')
      const data = await response.json()
      
      if (data.success && data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch store settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/store/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        alert('Store settings saved successfully!')
      } else {
        alert('Failed to save settings: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to save store settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateNestedSetting = (parent: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof StoreSettings] as any),
        [key]: value,
      },
    }))
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
          title="Store Settings"
          description="Configure payment, shipping, tax, and order settings"
          action={{
            label: saving ? 'Saving...' : 'Save Settings',
            onClick: handleSave,
            disabled: saving,
          }}
        />

        {/* Store Status */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Store Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Store Enabled</label>
                <p className="text-sm text-white/60">Enable or disable the entire store</p>
              </div>
              <input
                type="checkbox"
                checked={settings.storeEnabled}
                onChange={(e) => updateSetting('storeEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-[#10B981]/30 bg-surface-base text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Maintenance Mode</label>
                <p className="text-sm text-white/60">Put store in maintenance mode</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                className="h-4 w-4 rounded border-[#FF1F7D]/30 bg-surface-base text-[#FF1F7D] focus:ring-2 focus:ring-[#FF1F7D]/20"
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

        {/* Payment Settings */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Payment Methods</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Klarna</label>
                <p className="text-sm text-white/60">Enable Klarna payments</p>
              </div>
              <input
                type="checkbox"
                checked={settings.paymentMethods.klarna}
                onChange={(e) => updateNestedSetting('paymentMethods', 'klarna', e.target.checked)}
                className="h-4 w-4 rounded border-[#8B5CF6]/30 bg-surface-base text-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
            {settings.paymentMethods.klarna && (
              <FormField
                label="Klarna API Key"
                value={settings.klarnaApiKey}
                onChange={(value) => updateSetting('klarnaApiKey', value)}
                placeholder="Enter Klarna API key"
              />
            )}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Stripe</label>
                <p className="text-sm text-white/60">Enable Stripe payments</p>
              </div>
              <input
                type="checkbox"
                checked={settings.paymentMethods.stripe}
                onChange={(e) => updateNestedSetting('paymentMethods', 'stripe', e.target.checked)}
                className="h-4 w-4 rounded border-[#00F5FF]/30 bg-surface-base text-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20"
              />
            </div>
            {settings.paymentMethods.stripe && (
              <>
                <FormField
                  label="Stripe Public Key"
                  value={settings.stripePublicKey}
                  onChange={(value) => updateSetting('stripePublicKey', value)}
                  placeholder="pk_..."
                />
                <FormField
                  label="Stripe Secret Key"
                  value={settings.stripeSecretKey}
                  onChange={(value) => updateSetting('stripeSecretKey', value)}
                  placeholder="sk_..."
                  type="password"
                />
              </>
            )}
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Shipping Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Shipping Enabled</label>
                <p className="text-sm text-white/60">Enable shipping for physical products</p>
              </div>
              <input
                type="checkbox"
                checked={settings.shippingEnabled}
                onChange={(e) => updateSetting('shippingEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-[#10B981]/30 bg-surface-base text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
            {settings.shippingEnabled && (
              <>
                <FormField
                  label="Default Shipping Rate ($)"
                  value={settings.defaultShippingRate.toString()}
                  onChange={(value) => updateSetting('defaultShippingRate', parseFloat(value) || 0)}
                  type="number"
                  step={0.01}
                />
                <FormField
                  label="Free Shipping Threshold ($)"
                  value={settings.freeShippingThreshold.toString()}
                  onChange={(value) => updateSetting('freeShippingThreshold', parseFloat(value) || 0)}
                  type="number"
                  step={0.01}
                  helpText="Orders above this amount get free shipping"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">International Shipping</label>
                    <p className="text-sm text-white/60">Enable international shipping</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.internationalShipping}
                    onChange={(e) => updateSetting('internationalShipping', e.target.checked)}
                    className="h-4 w-4 rounded border-[#FFC700]/30 bg-surface-base text-[#FFC700] focus:ring-2 focus:ring-[#FFC700]/20"
                  />
                </div>
                {settings.internationalShipping && (
                  <FormField
                    label="International Shipping Rate ($)"
                    value={settings.internationalShippingRate.toString()}
                    onChange={(value) =>
                      updateSetting('internationalShippingRate', parseFloat(value) || 0)
                    }
                    type="number"
                    step={0.01}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Tax Settings */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Tax Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Tax Enabled</label>
                <p className="text-sm text-white/60">Enable tax calculation</p>
              </div>
              <input
                type="checkbox"
                checked={settings.taxEnabled}
                onChange={(e) => updateSetting('taxEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-[#10B981]/30 bg-surface-base text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
            {settings.taxEnabled && (
              <>
                <FormField
                  label="Tax Rate (%)"
                  value={settings.taxRate.toString()}
                  onChange={(value) => updateSetting('taxRate', parseFloat(value) || 0)}
                  type="number"
                  step={0.01}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Tax Included in Price</label>
                    <p className="text-sm text-white/60">Tax is already included in product prices</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.taxIncludedInPrice}
                    onChange={(e) => updateSetting('taxIncludedInPrice', e.target.checked)}
                    className="h-4 w-4 rounded border-[#8B5CF6]/30 bg-surface-base text-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Currency Settings */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Currency Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Currency Code"
              value={settings.currency}
              onChange={(value) => updateSetting('currency', value)}
              placeholder="USD"
            />
            <FormField
              label="Currency Symbol"
              value={settings.currencySymbol}
              onChange={(value) => updateSetting('currencySymbol', value)}
              placeholder="$"
            />
          </div>
        </div>

        {/* Order Settings */}
        <div className="rounded-3xl border-2 border-white/10 bg-gradient-to-br from-surface-card/50 to-surface-raised/50 p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-black uppercase tracking-wider text-white mb-6">Order Settings</h2>
          <div className="space-y-4">
            <FormField
              label="Order Number Prefix"
              value={settings.orderPrefix}
              onChange={(value) => updateSetting('orderPrefix', value)}
              placeholder="MFX"
              helpText="Prefix for order numbers (e.g., MFX-001)"
            />
            <FormField
              label="Low Stock Threshold"
              value={settings.lowStockThreshold.toString()}
              onChange={(value) => updateSetting('lowStockThreshold', parseInt(value) || 0)}
              type="number"
              helpText="Alert when stock falls below this number"
            />
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Auto-Confirm Orders</label>
                <p className="text-sm text-white/60">Automatically confirm orders after payment</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoConfirmOrders}
                onChange={(e) => updateSetting('autoConfirmOrders', e.target.checked)}
                className="h-4 w-4 rounded border-[#10B981]/30 bg-surface-base text-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
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
            <span className="text-[#FF1F7D]">{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
