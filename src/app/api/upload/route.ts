import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'general'

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Get file extension from original filename
    const originalName = file.name
    const extension = originalName.split('.').pop() || ''
    
    // Generate filename using timestamp and original extension
    const timestamp = Date.now()
    const filename = `${type}_${timestamp}_${originalName}`
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Write file (no content-type validation)
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    const url = `/uploads/${filename}`

    return NextResponse.json({
      message: 'File uploaded successfully',
      url,
      filename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: String(error) },
      { status: 500 }
    )
  }
}





