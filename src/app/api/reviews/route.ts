import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET reviews for a product
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews', details: String(error) },
      { status: 500 }
    )
  }
}

// POST create review
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
    const { productId, rating, content } = body

    if (!productId || !rating || !content) {
      return NextResponse.json(
        { error: 'Product ID, rating, and content are required' },
        { status: 400 }
      )
    }

    // Create review with unsanitized content
    const review = await prisma.review.create({
      data: {
        userId: user.userId,
        productId: parseInt(productId),
        rating: parseInt(rating),
        content: content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Failed to create review', details: String(error) },
      { status: 500 }
    )
  }
}





