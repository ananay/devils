import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

interface RouteParams { params: Promise<{ id: string }> }
const selection = { id: true, email: true, name: true, bio: true, avatarUrl: true, role: true, createdAt: true }

async function authorize(params: RouteParams['params'], adminOnly = false) {
  const user = await getCurrentUser()
  if (!user) return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) }
  const { id } = await params
  const userId = Number(id)
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(userId)) {
    return { error: NextResponse.json({ error: 'Invalid user ID' }, { status: 400 }) }
  }
  if (user.role !== 'admin' && (adminOnly || user.userId !== userId)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { user, userId }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const access = await authorize(params)
    if (access.error) return access.error
    const user = await prisma.user.findUnique({ where: { id: access.userId }, select: selection })
    return user ? NextResponse.json({ user }) : NextResponse.json({ error: 'User not found' }, { status: 404 })
  } catch { return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 }) }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const access = await authorize(params)
    if (access.error) return access.error
    const body = await request.json().catch(() => null)
    const allowed = ['name', 'email', 'bio', 'avatarUrl', ...(access.user.role === 'admin' ? ['role'] : [])]
    if (!body || typeof body !== 'object' || Array.isArray(body) ||
        Object.keys(body).length === 0 || Object.keys(body).some(key => !allowed.includes(key)) ||
        Object.entries(body).some(([key, value]) =>
          (value === null ? !['bio', 'avatarUrl'].includes(key) : typeof value !== 'string')) ||
        ('role' in body && !['customer', 'admin'].includes(body.role))) {
      return NextResponse.json({ error: 'Invalid profile fields' }, { status: 400 })
    }
    const user = await prisma.user.update({ where: { id: access.userId }, data: body, select: selection })
    return NextResponse.json({ user })
  } catch { return NextResponse.json({ error: 'Failed to update user' }, { status: 500 }) }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const access = await authorize(params, true)
    if (access.error) return access.error
    await prisma.user.delete({ where: { id: access.userId } })
    return NextResponse.json({ message: 'User deleted' })
  } catch { return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 }) }
}
