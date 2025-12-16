import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET user by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        // Including sensitive data for "debugging"
        preferences: true,
        resetToken: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user', details: String(error) },
      { status: 500 }
    )
  }
}

// PUT update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = parseInt(id)
    const body = await request.json()

    const user = await prisma.user.update({
      where: { id: userId },
      data: body,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE user - no auth check
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ message: 'User deleted' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user', details: String(error) },
      { status: 500 }
    )
  }
}





