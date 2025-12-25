import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const ext = file.name.split('.').pop()
    const filename = `${uuidv4()}.${ext}`

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'screenshots')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Write file
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return public URL
    const screenshotUrl = `/uploads/screenshots/${filename}`

    return NextResponse.json({
      success: true,
      screenshotUrl,
    })
  } catch (error) {
    console.error('Screenshot upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
