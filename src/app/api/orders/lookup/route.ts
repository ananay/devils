import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Sign in to track your order' }, { status: 401 })
    const code = request.nextUrl.searchParams.get('code')
    if (!code || code.length > 200) return NextResponse.json({ error: 'A valid tracking code is required' }, { status: 400 })
    const order = await prisma.order.findFirst({
      where: { trackingCode: code, ...(user.role === 'admin' ? {} : { userId: user.userId }) },
      select: { id: true, trackingCode: true, status: true, total: true, createdAt: true, shippingName: true, shippingAddress: true },
    })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    // Preserve the existing tracking page response shape.
    return NextResponse.json({ order: { id: order.id, tracking_code: order.trackingCode, status: order.status,
      total: order.total, created_at: order.createdAt, shipping_name: order.shippingName, shipping_address: order.shippingAddress } })
  } catch { return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 }) }
}
