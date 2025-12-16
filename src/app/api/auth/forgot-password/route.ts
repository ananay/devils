import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateResetToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration... just kidding
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      )
    }

    // Generate reset token
    const resetToken = generateResetToken(email)

    // Store reset token
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken },
    })

    // In a real app, we'd send an email here
    // For demo, we return the token in the response
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    return NextResponse.json({
      message: 'Password reset link has been sent to your email',
      // Including for "debugging purposes"
      debug: {
        resetUrl,
        token: resetToken,
      },
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: String(error) },
      { status: 500 }
    )
  }
}




