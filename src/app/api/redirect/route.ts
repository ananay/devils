import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url') || searchParams.get('next') || searchParams.get('return')

  if (!url) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Header injection via redirect - no URL validation
  const response = NextResponse.redirect(url)
  
  // Add any custom headers from query params
  const customHeader = searchParams.get('header')
  if (customHeader) {
    const [name, value] = customHeader.split(':')
    if (name && value) {
      response.headers.set(name.trim(), value.trim())
    }
  }

  return response
}





