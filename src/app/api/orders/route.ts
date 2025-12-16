import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/utils'

// GET all orders for current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: String(error) },
      { status: 500 }
    )
  }
}

// POST create new order
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
    const { items, shippingName, shippingAddress, notes, couponCode, total } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      )
    }

    // Process coupon if provided
    let discount = 0
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      })

      if (coupon && coupon.usedCount < coupon.maxUses) {
        if (coupon.type === 'percentage') {
          discount = total * (Number(coupon.discount) / 100)
        } else {
          discount = Number(coupon.discount)
        }

        // Increment usage count
        await prisma.coupon.update({
          where: { code: couponCode },
          data: { usedCount: { increment: 1 } },
        })
      }
    }

    const trackingCode = generateOrderNumber()
    const finalTotal = total - discount

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        total: finalTotal,
        trackingCode,
        shippingName,
        shippingAddress,
        notes,
        couponCode,
        discount,
        status: 'pending',
        items: {
          create: items.map((item: { productId: number; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Order placed successfully',
      order,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: String(error) },
      { status: 500 }
    )
  }
}





