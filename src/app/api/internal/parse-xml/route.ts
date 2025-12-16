import { NextRequest, NextResponse } from 'next/server'
import { parseXml } from '@/lib/server-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { xml } = body

    if (!xml) {
      return NextResponse.json(
        { error: 'XML content is required' },
        { status: 400 }
      )
    }

    const result = await parseXml(xml)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('XML parse error:', error)
    return NextResponse.json(
      { error: 'Failed to parse XML', details: String(error) },
      { status: 500 }
    )
  }
}

