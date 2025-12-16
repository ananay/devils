import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// No authentication check - exposes all user data
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        // Sensitive data exposed
        resetToken: true,
        preferences: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', details: String(error) },
      { status: 500 }
    )
  }
}





