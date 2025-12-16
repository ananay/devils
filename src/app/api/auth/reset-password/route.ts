import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyResetToken, hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Verify reset token
    const { email, valid } = verifyResetToken(token)

    if (!valid || !email) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Find user and verify token matches
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: token,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
      },
    })

    return NextResponse.json({
      message: 'Password has been reset successfully',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: String(error) },
      { status: 500 }
    )
  }
}





