import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Exclude system/internal routes that should never be checked
  const isWellKnown = pathname.startsWith('/.well-known')
  const isNextInternal = pathname.startsWith('/_next')
  const isFavicon = pathname === '/favicon.ico'
  const isApiAuth = pathname.startsWith('/api/auth')

  // These routes should bypass all checks
  if (isWellKnown || isNextInternal || isFavicon || isApiAuth) {
    return NextResponse.next()
  }

  // Read cookies
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const hasTokens = !!(accessToken && refreshToken)

  // Handle login page
  const isPublicPage = pathname === '/login' || pathname === '/'
  if (isPublicPage) {
    // If user is already authenticated, redirect to dashboard
    if (hasTokens) {
      console.log('[Middleware] Authenticated user on login page - redirecting to dashboard')
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
    // If not authenticated, allow access to login page
    console.log('[Middleware] Unauthenticated user accessing login page - allowing')
    return NextResponse.next()
  }

  // For all other routes, require authentication
  if (!hasTokens && !isPublicPage) {
    console.log('[Middleware] Protected route without tokens - redirecting to login', { pathname })
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // User is authenticated and accessing a protected route
  console.log('[Middleware] Authenticated user accessing protected route', { pathname })
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .well-known (system files like Chrome DevTools)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|\\.well-known).*)',
  ],
}
