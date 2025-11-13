'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface TestimonialProps {
  quote: string
  author: {
    name: string
    role: string
    avatar?: string
  }
  rating?: number
  delay?: number
}

export default function Testimonial({ quote, author, rating = 5, delay = 0 }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl bg-white p-8 shadow-lg"
    >
      {/* Quote icon */}
      <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl shadow-lg">
        &ldquo;
      </div>

      {/* Rating stars */}
      {rating > 0 && (
        <div className="mb-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Quote */}
      <p className="text-gray-700 leading-relaxed italic mb-6">{quote}</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {author.avatar ? (
          <div className="relative h-12 w-12 rounded-full overflow-hidden">
            <Image src={author.avatar} alt={author.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg">
            {author.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{author.name}</p>
          <p className="text-sm text-gray-600">{author.role}</p>
        </div>
      </div>
    </motion.div>
  )
}

