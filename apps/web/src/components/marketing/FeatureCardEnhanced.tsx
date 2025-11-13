'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface FeatureCardEnhancedProps {
  variant?: 'default' | 'image' | 'pricing' | 'testimonial' | 'stat'
  icon?: string | React.ReactNode
  image?: string
  title: string
  subtitle?: string
  description: string
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
  gradient?: string
  delay?: number
}

export default function FeatureCardEnhanced({
  variant = 'default',
  icon,
  image,
  title,
  subtitle,
  description,
  price,
  features,
  author,
  date,
  rating,
  stat,
  href,
  buttonText = 'Learn More',
  gradient = 'from-purple-500 to-blue-500',
  delay = 0,
}: FeatureCardEnhancedProps) {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group h-full"
    >
      <div className="h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-purple-500/50">
        {/* Variant: Default */}
        {variant === 'default' && (
          <div className="p-6">
            {/* Icon */}
            {icon && (
              <div className={`mb-4 text-5xl bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {typeof icon === 'string' ? icon : icon}
              </div>
            )}

            {/* Title */}
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-[#FF5656] transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {description}
            </p>

            {/* Button */}
            {href && (
              <div className="flex items-center gap-2 text-[#FF5656] font-semibold group-hover:gap-4 transition-all">
                {buttonText}
                <span className="text-xl">→</span>
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
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {subtitle && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#FF5656] text-white text-sm font-bold rounded-full">
                    {subtitle}
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              {/* Title */}
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {description}
              </p>

              {/* Button */}
              {href && (
                <div className="flex items-center gap-2 text-[#FF5656] font-semibold">
                  {buttonText}
                  <span>→</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Variant: Pricing */}
        {variant === 'pricing' && (
          <div className="p-8 text-center">
            {/* Title */}
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {title}
            </h3>

            {/* Price */}
            {price && (
              <div className="mb-6">
                <span className={`text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {price}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {description}
            </p>

            {/* Features */}
            {features && features.length > 0 && (
              <ul className="space-y-3 mb-8 text-left">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Button */}
            {href && (
              <Link
                href={href}
                className={`block w-full py-3 px-6 bg-gradient-to-r ${gradient} text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                {buttonText}
              </Link>
            )}
          </div>
        )}

        {/* Variant: Testimonial */}
        {variant === 'testimonial' && (
          <div className="p-6">
            {/* Date and Rating */}
            <div className="flex justify-between items-center mb-4">
              {icon && <div className="text-2xl">{icon}</div>}
              {date && <span className="text-sm text-gray-500">{date}</span>}
            </div>

            {/* Rating */}
            {rating && (
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
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
                  <div className="font-bold text-gray-900 dark:text-white">{author.name}</div>
                  <div className="text-sm text-gray-500">{author.role}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Variant: Stat */}
        {variant === 'stat' && stat && (
          <div className="p-8 text-center">
            {/* Icon */}
            {icon && (
              <div className="mb-4 text-4xl">
                {typeof icon === 'string' ? icon : icon}
              </div>
            )}

            {/* Stat Value */}
            <div className={`text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </div>

            {/* Stat Label */}
            <div className="text-gray-600 dark:text-gray-400 uppercase tracking-wider font-semibold">
              {stat.label}
            </div>

            {/* Description */}
            {description && (
              <p className="mt-4 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )

  if (href && variant !== 'pricing') {
    return <Link href={href}>{cardContent}</Link>
  }

  return cardContent
}


