import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// No authentication check on internal API endpoints
export async function GET() {
  try {
    const [totalUsers, totalOrders, totalProducts, revenueResult, recentOrders] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ])

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: Number(revenueResult._sum.total) || 0,
      recentOrders,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: String(error) },
      { status: 500 }
    )
  }
}




