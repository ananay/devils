import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // CORS misconfiguration - allows all origins
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', '*')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  // Missing security headers
  // X-Frame-Options: not set (clickjacking)
  // X-Content-Type-Options: not set (MIME sniffing)
  // Content-Security-Policy: not set

  return response
}

export const config = {
  matcher: '/api/:path*',
}





