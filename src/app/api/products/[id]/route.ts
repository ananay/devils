import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const productId = parseInt(id)

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product', details: String(error) },
      { status: 500 }
    )
  }
}

// PUT update product - no auth check
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    const body = await request.json()

    const product = await prisma.product.update({
      where: { id: productId },
      data: body,
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Failed to update product', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE product - no auth check
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const productId = parseInt(id)

    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product', details: String(error) },
      { status: 500 }
    )
  }
}





