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
          <div className="text-muted-foreground">Loading settings...</div>
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Store Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Store Enabled</label>
                <p className="text-sm text-muted-foreground">Enable or disable the entire store</p>
              </div>
              <input
                type="checkbox"
                checked={settings.storeEnabled}
                onChange={(e) => updateSetting('storeEnabled', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Maintenance Mode</label>
                <p className="text-sm text-muted-foreground">Put store in maintenance mode</p>
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

        {/* Payment Settings */}
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Payment Methods</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Klarna</label>
                <p className="text-sm text-muted-foreground">Enable Klarna payments</p>
              </div>
              <input
                type="checkbox"
                checked={settings.paymentMethods.klarna}
                onChange={(e) => updateNestedSetting('paymentMethods', 'klarna', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
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
                <label className="text-foreground font-medium">Stripe</label>
                <p className="text-sm text-muted-foreground">Enable Stripe payments</p>
              </div>
              <input
                type="checkbox"
                checked={settings.paymentMethods.stripe}
                onChange={(e) => updateNestedSetting('paymentMethods', 'stripe', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Shipping Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Shipping Enabled</label>
                <p className="text-sm text-muted-foreground">Enable shipping for physical products</p>
              </div>
              <input
                type="checkbox"
                checked={settings.shippingEnabled}
                onChange={(e) => updateSetting('shippingEnabled', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
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
                    <label className="text-foreground font-medium">International Shipping</label>
                    <p className="text-sm text-muted-foreground">Enable international shipping</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.internationalShipping}
                    onChange={(e) => updateSetting('internationalShipping', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Tax Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-foreground font-medium">Tax Enabled</label>
                <p className="text-sm text-muted-foreground">Enable tax calculation</p>
              </div>
              <input
                type="checkbox"
                checked={settings.taxEnabled}
                onChange={(e) => updateSetting('taxEnabled', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
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
                    <label className="text-foreground font-medium">Tax Included in Price</label>
                    <p className="text-sm text-muted-foreground">Tax is already included in product prices</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.taxIncludedInPrice}
                    onChange={(e) => updateSetting('taxIncludedInPrice', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Currency Settings */}
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Currency Settings</h2>
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
        <div className="bg-card border border-border rounded-lg p-6 dark:shadow-lg dark:shadow-red-500/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Order Settings</h2>
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
                <label className="text-foreground font-medium">Auto-Confirm Orders</label>
                <p className="text-sm text-muted-foreground">Automatically confirm orders after payment</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoConfirmOrders}
                onChange={(e) => updateSetting('autoConfirmOrders', e.target.checked)}
                className="h-5 w-5 rounded border-gray-600 bg-secondary text-red-600 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-foreground rounded-lg hover:from-red-700 hover:to-red-600 transition-all dark:shadow-lg dark:shadow-red-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
