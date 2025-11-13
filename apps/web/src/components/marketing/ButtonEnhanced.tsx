'use client'

import Link from 'next/link'
import { useState } from 'react'

interface ButtonEnhancedProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  ripple?: boolean
  glow?: boolean
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function ButtonEnhanced({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  ripple = false,
  glow = false,
  href,
  onClick,
  className = '',
  disabled = false,
}: ButtonEnhancedProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return

    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRipple = { x, y, id: Date.now() }
      setRipples([...ripples, newRipple])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 600)
    }

    if (onClick) onClick()
  }

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  // Variant classes
  const variantClasses = {
    primary: 'bg-[#FF5656] text-white hover:bg-[#FF5656]/90',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600',
    outline: 'bg-transparent border-2 border-[#FF5656] text-[#FF5656] hover:bg-[#FF5656] hover:text-white',
    ghost: 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40',
  }

  const baseClasses = `
    relative inline-flex items-center justify-center gap-2
    font-bold rounded-lg
    transition-all duration-300
    overflow-hidden
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}
    ${className}
  `

  const content = (
    <>
      {/* Background layers for smooth transition */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-[#FF5656]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Ripple effects */}
      {ripple && ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className={`group ${baseClasses}`}
        onClick={handleClick}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={`group ${baseClasses}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {content}
    </button>
  )
}

