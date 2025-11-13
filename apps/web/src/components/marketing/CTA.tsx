'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface CTAProps {
  title: string
  description: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton?: {
    text: string
    href: string
  }
  gradient?: string
}

export default function CTA({
  title,
  description,
  primaryButton,
  secondaryButton,
  gradient = 'from-purple-600 to-blue-600',
}: CTAProps) {
  return (
    <div className="relative isolate overflow-hidden">
      <div className={`bg-gradient-to-br ${gradient} px-6 py-24 sm:px-6 sm:py-32 lg:px-8`}>
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-8 text-purple-100"
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href={primaryButton.href}
              className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-[#FF5656] shadow-lg hover:bg-gray-50 transition-all hover:scale-105"
            >
              {primaryButton.text}
            </Link>
            {secondaryButton && (
              <Link
                href={secondaryButton.href}
                className="text-base font-semibold leading-6 text-white hover:text-purple-100 transition-colors"
              >
                {secondaryButton.text} <span aria-hidden="true">→</span>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
        <defs>
          <radialGradient id="gradient">
            <stop stopColor="#7c3aed" />
            <stop offset={1} stopColor="#2563eb" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

