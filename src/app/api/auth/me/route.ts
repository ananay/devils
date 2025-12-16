import { NextResponse } from 'next/server'
import { getCurrentUser, getUserById } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getCurrentUser()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await getUserById(session.userId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: String(error) },
      { status: 500 }
    )
  }
}




