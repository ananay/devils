import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { fetchUrl } from '@/lib/server-utils'

// SSRF vulnerability - fetches arbitrary URLs
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Fetch the image from the URL (SSRF vulnerability)
    const { data, status } = await fetchUrl(url)

    if (status !== 200) {
      return NextResponse.json(
        { error: 'Failed to fetch image from URL' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll just store the URL directly
    // In a real vulnerable app, we'd save the fetched content
    await prisma.user.update({
      where: { id: user.userId },
      data: { avatarUrl: url },
    })

    return NextResponse.json({
      message: 'Avatar imported successfully',
      url: url,
    })
  } catch (error) {
    console.error('Import avatar error:', error)
    return NextResponse.json(
      { error: 'Failed to import avatar', details: String(error) },
      { status: 500 }
    )
  }
}

