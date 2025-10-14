#!/usr/bin/env node

/**
 * Simple build environment checker for Vercel
 */

console.log('🔍 Checking build environment...')

// Check if we're in Vercel build environment
if (process.env.VERCEL) {
  console.log('✅ Running in Vercel build environment')
} else {
  console.log('ℹ️  Running in local environment')
}

// Check for required environment variables
const requiredEnvVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL']
let hasErrors = false

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Missing environment variable: ${envVar}`)
    // Don't fail build for missing env vars in Vercel - they might be set as secrets
    if (!process.env.VERCEL) {
      hasErrors = true
    }
  } else {
    console.log(`✅ ${envVar} is set`)
  }
})

// Optional environment variables
const optionalEnvVars = ['DATABASE_URL', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']
optionalEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`)
  } else {
    console.log(`ℹ️  Optional: ${envVar} not set`)
  }
})

if (hasErrors) {
  console.error('\n❌ Build environment check failed!')
  process.exit(1)
} else {
  console.log('\n✅ Build environment check passed!')
}
