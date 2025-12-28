import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = [/^\/login$/, /^\/api\/auth/, /^\/_next/, /^\/favicon\.ico$/]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Match the current pathname against the pattern(s) in config.matcher
  const isPublic = PUBLIC_ROUTES.some(regex => regex.test(pathname))

  // Allow public routes
  if (isPublic) {
    return NextResponse.next()
  }

  // Read cookies
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // If tokens missing → redirect to login
  if (!accessToken || !refreshToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
