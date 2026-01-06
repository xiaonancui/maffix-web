'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, CheckCircle, Loader2 } from 'lucide-react'

export default function HomepageGate() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/homepage-otp/verify')
        const data = await response.json()
        if (data.verified) {
          // User is already authenticated, redirect to dashboard
          router.push('/dashboard')
          return
        }
      } catch (error) {
        console.error('Failed to check auth:', error)
      }
      setIsChecking(false)
    }

    checkAuth()
  }, [router])

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

      // Redirect to dashboard
      router.push(data.redirectTo || '/dashboard')
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5656] mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF5656]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Maffix</h1>
          <p className="text-gray-400">Independent Musician Fan Engagement Platform</p>
        </div>

        {/* Gate Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {step === 'email' && (
            <>
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FF5656]/10 mx-auto mb-6">
                <Mail className="h-7 w-7 text-[#FF5656]" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Welcome to Maffix
              </h2>
              <p className="text-gray-400 text-center mb-8">
                Enter your email to get started
              </p>

              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF5656] focus:ring-[#FF5656]"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#FF5656] hover:bg-[#FF5656]/90 text-white font-semibold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FF5656]/10 mx-auto mb-6">
                <Lock className="h-7 w-7 text-[#FF5656]" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-400 text-center mb-2">
                We sent a verification code to
              </p>
              <p className="text-white font-medium text-center mb-8">{email}</p>

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <Label htmlFor="otp" className="text-gray-300">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="mt-2 bg-gray-800 border-gray-700 text-white text-center text-2xl tracking-[0.5em] font-mono placeholder:text-gray-500 focus:border-[#FF5656] focus:ring-[#FF5656]"
                  />
                </div>

                {devCode && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-400 text-center">
                      <strong>Dev Mode:</strong> Your code is <code className="bg-yellow-500/20 px-2 py-1 rounded">{devCode}</code>
                    </p>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#FF5656] hover:bg-[#FF5656]/90 text-white font-semibold py-3"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Continue'
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setOtp('')
                    setError('')
                    setDevCode(null)
                  }}
                  className="w-full text-sm text-gray-400 hover:text-white transition-colors py-2"
                >
                  Use a different email
                </button>
              </form>
            </>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Free Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>No Spam</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Unsubscribe Anytime</span>
          </div>
        </div>
      </div>
    </div>
  )
}
