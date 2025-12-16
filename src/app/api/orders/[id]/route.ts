import { NextRequest, NextResponse } from 'next/server'
import { prisma, rawQuery } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET single order
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const orderId = parseInt(id)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order', details: String(error) },
      { status: 500 }
    )
  }
}

// PUT update order status
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const orderId = parseInt(id)
    const body = await request.json()

    const order = await prisma.order.update({
      where: { id: orderId },
      data: body,
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: 'Failed to update order', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE order
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const orderId = parseInt(id)

    await prisma.order.delete({
      where: { id: orderId },
    })

    return NextResponse.json({ message: 'Order deleted' })
  } catch (error) {
    console.error('Delete order error:', error)
    return NextResponse.json(
      { error: 'Failed to delete order', details: String(error) },
      { status: 500 }
    )
  }
}





