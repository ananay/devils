import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, verifyPassword, hashPassword } from '@/lib/auth'

// No CSRF protection on this endpoint
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
    const { currentPassword, newPassword } = body

    // Get user with password
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, dbUser.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password
    await prisma.user.update({
      where: { id: user.userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Failed to change password', details: String(error) },
      { status: 500 }
    )
  }
}





