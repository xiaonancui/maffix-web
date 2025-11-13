'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface HeroProps {
  title: string
  subtitle: string
  description?: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  badge?: string
  backgroundImage?: string
}

export default function Hero({
  title,
  subtitle,
  description,
  primaryCTA = { text: 'Get Started', href: '/register' },
  secondaryCTA = { text: 'Learn More', href: '/how-it-works' },
  badge,
  backgroundImage,
}: HeroProps) {
  return (
    <div className="relative isolate overflow-hidden bg-black">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-8 inline-flex items-center rounded-full bg-[#FF5656]/20 px-4 py-2 text-sm font-semibold text-[#FF5656]"
            >
              {badge}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-xl leading-8 text-[#FF5656] font-semibold"
          >
            {subtitle}
          </motion.p>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 text-lg leading-8 text-gray-300"
            >
              {description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href={primaryCTA.href}
              className="rounded-lg bg-[#FF5656] px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-[#FF5656]/90 transition-all hover:scale-105"
            >
              {primaryCTA.text}
            </Link>
            <Link
              href={secondaryCTA.href}
              className="text-base font-semibold leading-6 text-white hover:text-[#FF5656] transition-colors"
            >
              {secondaryCTA.text} <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

