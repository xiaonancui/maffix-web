'use client'

import { motion } from 'framer-motion'

interface SectionHeadingProps {
  badge?: string
  title: string
  subtitle?: string
  centered?: boolean
  delay?: number
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  delay = 0,
}: SectionHeadingProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay }}
          className={`mb-4 inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 ${
            centered ? '' : ''
          }`}
        >
          {badge}
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
        className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className={`mt-4 text-lg leading-8 text-gray-600 ${
            centered ? 'mx-auto max-w-2xl' : ''
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

