'use client'

import { motion } from 'framer-motion'

interface TimelineItem {
  year: string
  title: string
  description: string
  icon?: string
}

interface TimelineProps {
  items: TimelineItem[]
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-blue-600 to-purple-600 -translate-x-1/2 hidden md:block" />

      {/* Timeline Items */}
      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col md:flex-row items-center gap-8 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Content */}
            <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  {item.icon && <span className="text-3xl">{item.icon}</span>}
                  <span className="text-[#FF5656] font-bold text-lg">{item.year}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </div>

            {/* Center Node */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg shadow-purple-500/50">
                <div className="w-8 h-8 bg-white rounded-full animate-pulse-glow" />
              </div>
            </div>

            {/* Spacer for alternating layout */}
            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

