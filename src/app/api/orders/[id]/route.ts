import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

interface RouteParams { params: Promise<{ id: string }> }
async function authorize(params: RouteParams['params'], adminOnly = false) {
  const user = await getCurrentUser()
  if (!user) return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) }
  if (adminOnly && user.role !== 'admin') return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  const { id } = await params
  const orderId = Number(id)
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(orderId)) return { error: NextResponse.json({ error: 'Invalid order ID' }, { status: 400 }) }
  return { user, orderId }
}
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const access = await authorize(params)
    if (access.error) return access.error
    const order = await prisma.order.findFirst({
      where: { id: access.orderId, ...(access.user.role === 'admin' ? {} : { userId: access.user.userId }) },
      include: { user: { select: { id: true, name: true, email: true } }, items: { include: { product: true } } },
    })
    return order ? NextResponse.json({ order }) : NextResponse.json({ error: 'Order not found' }, { status: 404 })
  } catch { return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 }) }
}
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const access = await authorize(params, true)
    if (access.error) return access.error
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length !== 1 ||
        typeof body.status !== 'string' || !['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(body.status)) {
      return NextResponse.json({ error: 'Only a valid order status may be updated' }, { status: 400 })
    }
    const result = await prisma.order.updateMany({ where: { id: access.orderId }, data: { status: body.status } })
    if (!result.count) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json({ message: 'Order status updated' })
  } catch { return NextResponse.json({ error: 'Failed to update order' }, { status: 500 }) }
}
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const access = await authorize(params, true)
    if (access.error) return access.error
    const result = await prisma.order.deleteMany({ where: { id: access.orderId } })
    if (!result.count) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json({ message: 'Order deleted' })
  } catch { return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 }) }
}
