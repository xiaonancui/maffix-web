'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  href?: string
  gradient?: string
  delay?: number
}

export default function FeatureCard({
  icon,
  title,
  description,
  href,
  gradient = 'from-purple-500 to-blue-500',
  delay = 0,
}: FeatureCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl ${
        href ? 'cursor-pointer hover:scale-105' : ''
      }`}
    >
      {/* Gradient background on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-5`}
      />

      {/* Icon */}
      <div
        className={`relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-4xl shadow-lg`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-[#FF5656] transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>

        {href && (
          <div className="mt-4 flex items-center text-sm font-semibold text-[#FF5656] group-hover:text-purple-700">
            Learn more
            <svg
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

