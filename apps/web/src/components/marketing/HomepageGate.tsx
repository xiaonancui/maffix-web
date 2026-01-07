'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, CheckCircle, Loader2, Sparkles, Zap } from 'lucide-react'

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-base">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        >
          <source src="/banners/login-bg.mp4" type="video/mp4" />
        </video>

        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-[#FF1F7D]/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-[#8B5CF6]/20 blur-3xl" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative text-center">
          <div className="relative mb-6 inline-flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#FF1F7D]/40"></div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF1F7D] to-[#8B5CF6] shadow-lg shadow-[#FF1F7D]/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" strokeWidth={2.5} />
            </div>
          </div>
          <p className="font-display text-lg font-bold text-white">Loading...</p>
          <p className="mt-2 text-sm text-white/60">Preparing your experience</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-surface-base">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      >
        <source src="/files/beat-like-dat.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />

      {/* Animated ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-[#FF1F7D]/20 blur-3xl" />
        <div className="absolute -right-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-[#8B5CF6]/20 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-[#00F5FF]/10 blur-3xl" style={{ animationDelay: '4s' }} />
      </div>

      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF1F7D]/50 via-[#8B5CF6]/50 to-transparent" />

      <div className="relative w-full max-w-md animate-fade-in-up px-4">
        {/* Logo & Branding */}
        <div className="mb-8 text-center">
          <div className="relative mb-4 inline-flex items-center justify-center">
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#FF1F7D]/30 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1F7D] to-[#8B5CF6] shadow-xl shadow-[#FF1F7D]/50">
              <Zap className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="font-display text-5xl font-black tracking-tight text-white">
            Maffix
          </h1>
          <p className="mt-2 font-display text-sm font-bold uppercase tracking-[0.3em] text-[#00F5FF]">
            Universe
          </p>
          <p className="mt-3 text-base text-white/70">
            Support the music. Stack rewards. Unlock legendary.
          </p>
        </div>

        {/* Gate Card with Glassmorphism */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-card/90 to-surface-raised/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Card ambient glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF1F7D]/20 via-[#8B5CF6]/10 to-transparent blur-3xl" />

          {/* Top gradient line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF1F7D]/50 to-transparent" />

          <div className="relative">
            {step === 'email' && (
              <>
                {/* Icon */}
                <div className="relative mb-6 flex justify-center">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-[#FF1F7D]/30 blur-lg" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1F7D] to-[#B200FF] shadow-lg shadow-[#FF1F7D]/50">
                    <Mail className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="mb-2 text-center font-display text-2xl font-black text-white">
                  Welcome Back
                </h2>
                <p className="mb-8 text-center text-sm text-white/60">
                  Enter your email to continue your journey
                </p>

                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-display text-xs font-bold uppercase tracking-wider text-white/70">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-sans text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/40 focus:border-[#FF1F7D]/60 focus:outline-none focus:ring-2 focus:ring-[#FF1F7D]/20"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-[#FF1F7D]/30 bg-[#FF1F7D]/10 px-4 py-3 backdrop-blur-sm">
                      <p className="text-sm font-semibold text-[#FF1F7D]">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="group w-full rounded-full bg-gradient-to-r from-[#FF1F7D] to-[#B200FF] py-6 font-display text-base font-bold text-white shadow-lg shadow-[#FF1F7D]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FF1F7D]/60"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending magic link...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Continue</span>
                        <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                      </div>
                    )}
                  </Button>
                </form>
              </>
            )}

            {step === 'otp' && (
              <>
                {/* Icon */}
                <div className="relative mb-6 flex justify-center">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-[#8B5CF6]/30 blur-lg" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#00F5FF] shadow-lg shadow-[#8B5CF6]/50">
                    <Lock className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="mb-2 text-center font-display text-2xl font-black text-white">
                  Check Your Email
                </h2>
                <p className="mb-2 text-center text-sm text-white/60">
                  We sent a verification code to
                </p>
                <p className="mb-8 text-center font-display text-base font-bold text-white">{email}</p>

                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="font-display text-xs font-bold uppercase tracking-wider text-white/70">
                      Verification Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center font-mono text-2xl tracking-[0.5em] text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/30 focus:border-[#8B5CF6]/60 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20"
                    />
                  </div>

                  {devCode && (
                    <div className="relative overflow-hidden rounded-xl border border-[#FFC700]/30 bg-[#FFC700]/10 p-4 backdrop-blur-sm">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFC700]/10 to-transparent" />
                      <p className="relative text-center text-sm text-[#FFC700]">
                        <span className="font-bold">Dev Mode:</span> Your code is{' '}
                        <code className="rounded-lg bg-[#FFC700]/20 px-3 py-1.5 font-mono text-base font-black text-white ring-1 ring-[#FFC700]/40">
                          {devCode}
                        </code>
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl border border-[#FF1F7D]/30 bg-[#FF1F7D]/10 px-4 py-3 backdrop-blur-sm">
                      <p className="text-sm font-semibold text-[#FF1F7D]">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="group w-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] py-6 font-display text-base font-bold text-white shadow-lg shadow-[#8B5CF6]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#8B5CF6]/60 disabled:opacity-50"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Verify & Continue</span>
                        <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                      </div>
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
                    className="w-full rounded-xl py-3 text-sm font-semibold text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white"
                  >
                    Use a different email
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/20 p-1.5 ring-1 ring-emerald-500/30">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-white/70">Free Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/20 p-1.5 ring-1 ring-emerald-500/30">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-white/70">No Spam</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/20 p-1.5 ring-1 ring-emerald-500/30">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-white/70">Unsubscribe Anytime</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/50 via-[#00F5FF]/50 to-transparent" />
    </div>
  )
}
