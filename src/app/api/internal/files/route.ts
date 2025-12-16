import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filename = searchParams.get('file')

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    const content = await readFile(filePath, 'utf-8')

    return NextResponse.json({ content })
  } catch (error) {
    console.error('File read error:', error)
    return NextResponse.json(
      { error: 'Failed to read file', details: String(error) },
      { status: 500 }
    )
  }
}





