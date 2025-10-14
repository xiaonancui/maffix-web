#!/usr/bin/env node

/**
 * Fix database imports in page components
 * This script replaces static db imports with dynamic imports to avoid build-time issues
 */

const fs = require('fs')
const path = require('path')

const filesToFix = [
  'src/app/(admin)/admin/tasks/page.tsx',
  'src/app/(dashboard)/dashboard/page.tsx',
  'src/app/(dashboard)/gacha/page.tsx',
  'src/app/(dashboard)/prizes/page.tsx',
  'src/app/(dashboard)/profile/page.tsx',
  'src/app/(dashboard)/tasks/page.tsx',
  'scripts/test-db.ts',
]

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return
  }

  let content = fs.readFileSync(fullPath, 'utf8')
  let modified = false

  // Remove static db import
  if (content.includes("import { db } from '@/lib/db'")) {
    content = content.replace(/import { db } from '@\/lib\/db'\n?/g, '')
    modified = true
  }

  // Add dynamic import before first db usage
  if (content.includes('db.') && !content.includes('const { db } = await import')) {
    // Find the first function that uses db
    const functionMatch = content.match(/(export default async function|async function)\s+\w+[^{]*{/)
    if (functionMatch) {
      const insertIndex = content.indexOf(functionMatch[0]) + functionMatch[0].length
      const dynamicImport = '\n  // Dynamic import to avoid build-time database connection\n  const { db } = await import(\'@/lib/db\')\n'
      content = content.slice(0, insertIndex) + dynamicImport + content.slice(insertIndex)
      modified = true
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content)
    console.log(`✅ Fixed: ${filePath}`)
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`)
  }
}

console.log('🔧 Fixing database imports...')

filesToFix.forEach(fixFile)

console.log('✅ Database import fixes completed!')
