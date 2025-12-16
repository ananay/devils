import { NextRequest, NextResponse } from 'next/server'
import { prisma, rawQuery } from '@/lib/db'

// GET products with search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'name'
    const order = searchParams.get('order') || 'asc'

    if (search) {
      const products = await rawQuery<{
        id: number
        name: string
        slug: string
        description: string
        price: number
        image_url: string
        stock: number
        abv: number
        origin: string
        category_id: number
      }>(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.name ILIKE '%${search}%' OR p.description ILIKE '%${search}%'
        ORDER BY p.${sort} ${order}
      `)

      return NextResponse.json({ products })
    }

    // Regular Prisma query for non-search
    const where: Record<string, unknown> = {}
    if (category) {
      where.category = { slug: category }
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { [sort]: order },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', details: String(error) },
      { status: 500 }
    )
  }
}

// POST create product (admin only - but no auth check)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const product = await prisma.product.create({
      data: body,
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product', details: String(error) },
      { status: 500 }
    )
  }
}





