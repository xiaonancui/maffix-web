'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, CheckCircle } from 'lucide-react'

interface HomepageGateProps {
  children: React.ReactNode
}

export default function HomepageGate({ children }: HomepageGateProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'verified'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)

  // Check if user is already verified on mount
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await fetch('/api/homepage-otp/verify')
        const data = await response.json()
        if (data.verified) {
          setIsVerified(true)
          setStep('verified')
        }
      } catch (error) {
        console.error('Failed to check verification:', error)
      }
    }

    // Check localStorage for session token
    const sessionToken = localStorage.getItem('homepage_verification')
    if (sessionToken) {
      try {
        const data = JSON.parse(atob(sessionToken))
        if (data.verifiedAt && Date.now() - data.verifiedAt < 24 * 60 * 60 * 1000) {
          // Valid session within 24 hours
          setIsVerified(true)
          setStep('verified')
          return
        }
      } catch (e) {
        // Invalid token, clear it
        localStorage.removeItem('homepage_verification')
      }
    }

    checkVerification()
  }, [])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/homepage-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to send verification code')
        return
      }

      // Show dev code in development
      if (data.devCode) {
        setDevCode(data.devCode)
      }

      setStep('otp')
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/homepage-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid verification code')
        return
      }

      // Store verification in localStorage
      if (data.verificationToken) {
        localStorage.setItem('homepage_verification', data.verificationToken)
      }

      setIsVerified(true)
      setStep('verified')
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified || step === 'verified') {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Maffix</h1>
          <p className="text-gray-400 mt-2">Independent Musician Fan Engagement Platform</p>
        </div>

        {/* Gate Card */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-xl">
          {step === 'email' && (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground text-center mb-2">
                Welcome to Maffix
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Enter your email to access the platform
              </p>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Continue'}
                </Button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground text-center mb-2">
                Verify Your Email
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                We sent a code to <span className="text-foreground font-medium">{email}</span>
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="mt-1.5 text-center text-2xl tracking-widest"
                  />
                </div>

                {devCode && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                    <p className="text-xs text-yellow-500">
                      Development Mode: Your code is <strong>{devCode}</strong>
                    </p>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? 'Verifying...' : 'Verify'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setError('')
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Use different email
                </button>
              </form>
            </>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Free Access</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>No Spam</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Unsubscribe Anytime</span>
          </div>
        </div>
      </div>
    </div>
  )
}
