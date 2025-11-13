export default function FloatingElements() {
  return (
    <>
      {/* Musical Note 1 */}
      <div className="absolute top-20 left-10 animate-float-up opacity-30">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-[#FF5656]">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>

      {/* Musical Note 2 */}
      <div className="absolute top-40 right-20 animate-float-down opacity-20 animation-delay-1000">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor" className="text-[#FF5656]">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>

      {/* Diamond 1 */}
      <div className="absolute top-1/4 left-1/4 animate-spin-slow opacity-25">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Diamond 2 */}
      <div className="absolute bottom-1/4 right-1/4 animate-spin-slower opacity-20 animation-delay-2000">
        <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor" className="text-[#FF5656]">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Star 1 */}
      <div className="absolute top-1/3 right-10 animate-blink">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      {/* Star 2 */}
      <div className="absolute bottom-20 left-20 animate-blink animation-delay-1500">
        <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      {/* Vinyl Record */}
      <div className="absolute top-1/2 left-10 animate-spin-slow opacity-15">
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#FF5656]">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* Headphones */}
      <div className="absolute bottom-1/3 right-16 animate-float-left opacity-20">
        <svg width="55" height="55" viewBox="0 0 24 24" fill="currentColor" className="text-[#FF5656]">
          <path d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h2v-6H5v-3c0-3.87 3.13-7 7-7s7 3.13 7 7v3h-2v6h2c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z" />
        </svg>
      </div>

      {/* Microphone */}
      <div className="absolute top-2/3 left-1/3 animate-bounce-slow opacity-25 animation-delay-500">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </div>

      {/* Wave Pattern 1 */}
      <div className="absolute top-10 right-1/4 animate-float-right opacity-10">
        <svg width="100" height="40" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#FF5656]">
          <path d="M0 20 Q 25 0, 50 20 T 100 20" />
        </svg>
      </div>

      {/* Wave Pattern 2 */}
      <div className="absolute bottom-10 left-1/3 animate-float-left opacity-10 animation-delay-1000">
        <svg width="120" height="50" viewBox="0 0 120 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#FF5656]">
          <path d="M0 25 Q 30 5, 60 25 T 120 25" />
        </svg>
      </div>

      {/* Glow Orb 1 */}
      <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-[#FF5656]/10 rounded-full blur-3xl animate-pulse-glow" />

      {/* Glow Orb 2 */}
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-[#FF5656]/10 rounded-full blur-3xl animate-pulse-glow animation-delay-2000" />

      {/* Glow Orb 3 */}
      <div className="absolute top-1/2 right-1/4 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow animation-delay-1000" />
    </>
  )
}

