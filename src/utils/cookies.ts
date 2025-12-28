/**
 * Cookie utility functions for client-side
 * Note: httpOnly cookies cannot be read by JavaScript
 * These functions work with non-httpOnly cookies
 */

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }

  return null
}

/**
 * Set a cookie
 */
export const setCookie = (
  name: string,
  value: string,
  options?: {
    maxAge?: number
    path?: string
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  }
): void => {
  if (typeof document === 'undefined') return

  let cookieString = `${name}=${value}`

  if (options?.maxAge) {
    cookieString += `; max-age=${options.maxAge}`
  }

  if (options?.path) {
    cookieString += `; path=${options.path}`
  }

  if (options?.secure) {
    cookieString += '; secure'
  }

  if (options?.sameSite) {
    cookieString += `; samesite=${options.sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Remove a cookie
 * Must match the same attributes (path, secure, sameSite) used when setting
 */
export const removeCookie = (name: string, path: string = '/'): void => {
  if (typeof document === 'undefined') return

  const isSecure = process.env.NODE_ENV === 'production'

  // Remove with all possible combinations to ensure it's deleted
  // Remove with path
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`

  // Remove with secure flag if in production
  if (isSecure) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; secure;`
  }

  // Remove with sameSite
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; samesite=lax;`

  // Remove with both secure and sameSite
  if (isSecure) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; secure; samesite=lax;`
  }

  // Also try without path (in case it was set without path)
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
}

/**
 * Get access token from cookie
 */
export const getAccessToken = (): string | null => {
  return getCookie('accessToken')
}

/**
 * Get refresh token from cookie
 */
export const getRefreshToken = (): string | null => {
  return getCookie('refreshToken')
}

/**
 * Set access token cookie
 */
export const setAccessToken = (token: string, maxAge: number = 60 * 15): void => {
  setCookie('accessToken', token, {
    maxAge,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

/**
 * Set refresh token cookie
 */
export const setRefreshToken = (token: string, maxAge: number = 60 * 60 * 24 * 7): void => {
  setCookie('refreshToken', token, {
    maxAge,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

/**
 * Remove access token cookie
 */
export const removeAccessToken = (): void => {
  removeCookie('accessToken')
}

/**
 * Remove refresh token cookie
 */
export const removeRefreshToken = (): void => {
  removeCookie('refreshToken')
}

/**
 * Clear all auth cookies
 * This function ensures cookies are cleared with all possible attribute combinations
 */
export const clearAuthCookies = (): void => {
  // Clear all auth-related cookies
  removeCookie('accessToken')
  removeCookie('refreshToken')
  removeCookie('userRole')

  // Also try clearing with maxAge 0 to ensure deletion
  if (typeof document !== 'undefined') {
    const isSecure = process.env.NODE_ENV === 'production'
    const path = '/'

    const cookiesToClear = ['accessToken', 'refreshToken', 'userRole']

    cookiesToClear.forEach(name => {
      // Set with maxAge 0 and all attributes
      document.cookie = `${name}=; max-age=0; path=${path}; samesite=lax;`
      if (isSecure) {
        document.cookie = `${name}=; max-age=0; path=${path}; secure; samesite=lax;`
      }
      // Also try without path
      document.cookie = `${name}=; max-age=0;`
    })
  }
}
