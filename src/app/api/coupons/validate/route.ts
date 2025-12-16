import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      )
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      )
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: 'Coupon has been fully redeemed' },
        { status: 400 }
      )
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Coupon has expired' },
        { status: 400 }
      )
    }

    return NextResponse.json({ coupon })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon', details: String(error) },
      { status: 500 }
    )
  }
}




