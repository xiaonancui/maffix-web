'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface FloatingElement {
  src: string
  alt: string
  animation: 'float-up' | 'float-down' | 'float-left' | 'float-right' | 'spin-slow' | 'blink' | 'bounce-slow'
  position: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  size?: number
  delay?: number
}

interface CTAButton {
  text: string
  href: string
  icon?: string
  variant?: 'primary' | 'secondary'
}

interface HeroFullScreenProps {
  title: React.ReactNode
  subtitle?: string
  description?: string
  primaryCTA?: CTAButton
  secondaryCTA?: CTAButton
  floatingElements?: FloatingElement[]
  backgroundImage?: string
  backgroundVideo?: string
  backgroundGradient?: string
  centerImage?: string
  stats?: Array<{ value: string; label: string }>
}

export default function HeroFullScreen({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  floatingElements = [],
  backgroundImage,
  backgroundVideo,
  backgroundGradient = 'from-black via-gray-900 to-black',
  centerImage,
  stats,
}: HeroFullScreenProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {backgroundVideo && (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}
        {!backgroundVideo && backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/70" />
          </>
        )}
        {!backgroundVideo && !backgroundImage && <div className="absolute inset-0 bg-black" />}
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute animate-${element.animation} z-0`}
          style={{
            ...element.position,
            animationDelay: `${element.delay || 0}ms`,
          }}
        >
          <Image
            src={element.src}
            alt={element.alt}
            width={element.size || 80}
            height={element.size || 80}
            className="opacity-80"
          />
        </div>
      ))}

      {/* Main Content */}
      <div className="container relative z-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Center Image */}
          {centerImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Image
                src={centerImage}
                alt="Hero center"
                width={200}
                height={200}
                className="mx-auto"
              />
            </motion.div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4"
            >
              <span className="inline-block text-lg font-bold text-[#FF5656] uppercase tracking-wider">
                {subtitle}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
          >
            {typeof title === 'string' ? (
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                {title}
              </h1>
            ) : (
              title
            )}
          </motion.div>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
            >
              {description}
            </motion.p>
          )}

          {/* CTA Buttons */}
          {(primaryCTA || secondaryCTA) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {primaryCTA && (
                <Link
                  href={primaryCTA.href}
                  className="group relative px-8 py-4 bg-[#FF5656] text-white font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {primaryCTA.text}
                    {primaryCTA.icon && <span>{primaryCTA.icon}</span>}
                  </span>
                  <div className="absolute inset-0 bg-[#FF5656]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-lg border-2 border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    {secondaryCTA.text}
                    {secondaryCTA.icon && <span>{secondaryCTA.icon}</span>}
                  </span>
                </Link>
              )}
            </motion.div>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}


