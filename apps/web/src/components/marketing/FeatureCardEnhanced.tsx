'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Target, ShoppingBag, Users, Gem, Ticket, Trophy, BarChart, Music, CreditCard, Star, Rocket, Dices, ArrowRight, Check } from 'lucide-react'

interface FeatureCardEnhancedProps {
  variant?: 'default' | 'image' | 'pricing' | 'testimonial' | 'stat'
  icon?: string | React.ReactNode
  iconName?: 'Dices' | 'Target' | 'ShoppingBag' | 'Users' | 'Gem' | 'Ticket' | 'Trophy' | 'BarChart' | 'Music' | 'CreditCard' | 'Star' | 'Rocket'
  image?: string
  title: string
  subtitle?: string
  description: string
  keyBenefit?: string
  price?: string
  features?: string[]
  author?: {
    name: string
    role: string
    avatar: string
  }
  date?: string
  rating?: number
  stat?: {
    value: string
    label: string
  }
  href?: string
  buttonText?: string
  color?: 'red' | 'blue' | 'yellow' | 'green' | 'purple'
  delay?: number
}

// Icon mapping for Lucide icons
const iconMap: Record<string, any> = {
  Dices,
  Target,
  ShoppingBag,
  Users,
  Gem,
  Ticket,
  Trophy,
  BarChart,
  Music,
  CreditCard,
  Star,
  Rocket,
}

// Solid color backgrounds for icon containers
const colorMap = {
  red: 'bg-[#FF2D55]',
  blue: 'bg-[#007AFF]',
  yellow: 'bg-[#FFCC00]',
  green: 'bg-[#00D664]',
  purple: 'bg-[#B457FF]',
}

// Icon colors
const iconColorMap = {
  red: 'text-white',
  blue: 'text-white',
  yellow: 'text-black',
  green: 'text-white',
  purple: 'text-white',
}

export default function FeatureCardEnhanced({
  variant = 'default',
  icon,
  iconName,
  image,
  title,
  subtitle,
  description,
  keyBenefit,
  price,
  features,
  author,
  date,
  rating,
  stat,
  href,
  buttonText = 'Learn More',
  color = 'red',
  delay = 0,
}: FeatureCardEnhancedProps) {
  // Get the Lucide icon component
  const LucideIconComponent = iconName ? iconMap[iconName] : null

  const colorClass = colorMap[color]
  const iconColorClass = iconColorMap[color]

  const cardContent = (
    <div className="group h-full">
      <div className="h-full bg-[#111111] border border-[#333333] hover:border-[#FF2D55] rounded-2xl">
        {/* Variant: Default */}
        {variant === 'default' && (
          <div className="p-8 h-full flex flex-col">
            {/* Icon */}
            {(icon || LucideIconComponent) && (
              <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${colorClass} ${iconColorClass}`}>
                {LucideIconComponent ? <LucideIconComponent className="h-6 w-6" /> : typeof icon === 'string' ? icon : icon}
              </div>
            )}

            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm font-semibold text-[#007AFF] uppercase tracking-wider mb-2">
                {subtitle}
              </p>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold mb-3 text-white">
              {title}
            </h3>

            {/* Description */}
            <p className="text-[#B3B3B3] mb-4 leading-relaxed flex-grow text-sm">
              {description}
            </p>

            {/* Key Benefit */}
            {keyBenefit && (
              <p className="text-white font-semibold mb-4 text-xs">
                {keyBenefit}
              </p>
            )}

            {/* Button */}
            {href && (
              <div className="flex items-center gap-2 text-[#FF2D55] font-semibold mt-auto text-sm">
                {buttonText}
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </div>
        )}

        {/* Variant: Image */}
        {variant === 'image' && (
          <>
            {/* Image */}
            {image && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
                {subtitle && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#FF2D55] text-white text-xs font-bold rounded-full">
                    {subtitle}
                  </div>
                )}
              </div>
            )}

            <div className="p-8">
              {/* Title */}
              <h3 className="text-xl font-bold mb-3 text-white">
                {title}
              </h3>

              {/* Description */}
              <p className="text-[#B3B3B3] mb-4 leading-relaxed text-sm">
                {description}
              </p>

              {/* Button */}
              {href && (
                <div className="flex items-center gap-2 text-[#FF2D55] font-semibold text-sm">
                  {buttonText}
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
          </>
        )}

        {/* Variant: Pricing */}
        {variant === 'pricing' && (
          <div className="p-8 text-center h-full flex flex-col">
            {/* Title */}
            <h3 className="text-xl font-bold mb-2 text-white">
              {title}
            </h3>

            {/* Price */}
            {price && (
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#FF2D55]">
                  {price}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-[#B3B3B3] mb-6 leading-relaxed text-sm">
              {description}
            </p>

            {/* Features */}
            {features && features.length > 0 && (
              <ul className="space-y-3 mb-8 text-left flex-grow">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#00D664] flex-shrink-0 mt-0.5" />
                    <span className="text-[#B3B3B3] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Button */}
            {href && (
              <Link
                href={href}
                className="block w-full py-3 px-6 bg-[#FF2D55] text-white font-bold rounded-lg text-sm"
              >
                {buttonText}
              </Link>
            )}
          </div>
        )}

        {/* Variant: Testimonial */}
        {variant === 'testimonial' && (
          <div className="p-8">
            {/* Date and Rating */}
            <div className="flex justify-between items-center mb-4">
              {icon && (
                <div className={`h-10 w-10 ${colorClass} ${iconColorClass} rounded-lg flex items-center justify-center`}>
                  {LucideIconComponent ? <LucideIconComponent className="h-5 w-5" /> : typeof icon === 'string' ? icon : icon}
                </div>
              )}
              {date && <span className="text-xs text-[#666666]">{date}</span>}
            </div>

            {/* Rating */}
            {rating && (
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < rating ? 'text-[#FFCC00] fill-[#FFCC00]' : 'text-[#333333]'}`}
                  />
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-[#B3B3B3] mb-6 italic leading-relaxed text-sm">
              &ldquo;{description}&rdquo;
            </p>

            {/* Author */}
            {author && (
              <div className="flex items-center gap-3">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="font-bold text-white text-sm">{author.name}</div>
                  <div className="text-xs text-[#666666]">{author.role}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Variant: Stat */}
        {variant === 'stat' && stat && (
          <div className="p-8 text-center h-full flex flex-col justify-center">
            {/* Icon */}
            {(icon || LucideIconComponent) && (
              <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl ${colorClass} ${iconColorClass}`}>
                {LucideIconComponent ? <LucideIconComponent className="h-8 w-8" /> : typeof icon === 'string' ? icon : icon}
              </div>
            )}

            {/* Stat Value */}
            <div className="text-5xl md:text-6xl font-bold mb-2 text-white">
              {stat.value}
            </div>

            {/* Stat Label */}
            <div className="text-[#007AFF] uppercase tracking-wider font-semibold text-xs mb-2">
              {stat.label}
            </div>

            {/* Description */}
            {description && (
              <p className="text-xs text-[#666666]">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (href && variant !== 'pricing') {
    return <Link href={href}>{cardContent}</Link>
  }

  return cardContent
}
