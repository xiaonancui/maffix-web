import React from 'react'

export interface IconProps {
  name: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  label?: string
}

/**
 * Line Awesome Icon Component
 * 
 * Usage:
 * <Icon name="gem" />
 * <Icon name="users" size="lg" />
 * <Icon name="shield-alt" className="text-red-500" />
 */
export function Icon({ name, className = '', size = 'md', label }: IconProps) {
  const sizeClasses = {
    sm: 'la-sm',
    md: '',
    lg: 'la-lg',
    xl: 'la-2x',
    '2xl': 'la-3x',
  }

  const sizeClass = sizeClasses[size]

  return (
    <i
      className={`las la-${name} ${sizeClass} ${className}`.trim()}
      aria-label={label}
      aria-hidden={!label}
    />
  )
}

/**
 * Pre-configured icon components for common use cases
 */

// Navigation icons (24px equivalent)
export function NavIcon({ name, label }: { name: string; label?: string }) {
  return <Icon name={name} size="lg" label={label} />
}

// Button icons (20px equivalent)
export function ButtonIcon({ name, label }: { name: string; label?: string }) {
  return <Icon name={name} size="md" label={label} />
}

// Large icons (32px equivalent)
export function LargeIcon({ name, label }: { name: string; label?: string }) {
  return <Icon name={name} size="xl" label={label} />
}

// Hero/Feature icons (48px equivalent)
export function HeroIcon({ name, label }: { name: string; label?: string }) {
  return <Icon name={name} size="2xl" label={label} />
}

export default Icon
