/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    outputFileTracingRoot: process.cwd(),
  },
  images: {
    domains: ['localhost', 'supabase.co'],
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  // Skip build-time static optimization for API routes
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Webpack configuration for better build performance
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ignore build-time database connections
    if (!dev && isServer) {
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
      })
    }
    return config
  },
}

module.exports = nextConfig
