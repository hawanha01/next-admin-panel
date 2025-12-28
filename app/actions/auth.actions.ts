'use server'

import { cookies } from 'next/headers'
import axios from 'axios'
import type { LoginRequest, LoginResponse } from '@/types/auth.types'
import type { ApiResponse } from '@/types/api.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

/**
 * Server Action to handle login and set httpOnly cookies
 * This can only be called from Server Components or Client Components
 */
export async function loginAction(
  credentials: LoginRequest,
  role: string = 'admin'
): Promise<LoginResponse> {
  try {
    const cookieStore = await cookies()

    // Set userRole cookie if provided
    if (role) {
      cookieStore.set('userRole', role, {
        httpOnly: false, // Can be read by client if needed
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        sameSite: 'lax',
      })
    }

    // Call the backend API
    const response = await axios.post<ApiResponse<LoginResponse>>(
      `${API_BASE_URL}/auth/login`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-role': role,
        },
      }
    )

    if (!response.data?.data) {
      throw new Error('Invalid response from server')
    }

    const { accessToken, refreshToken } = response.data.data

    // Set cookies (non-httpOnly so client-side can read them for API calls)
    // Middleware can read from request cookies, client-side can read from document.cookie
    cookieStore.set('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15, // 15 minutes in seconds
      path: '/',
      sameSite: 'lax',
    })

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
      sameSite: 'lax',
    })

    return response.data.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Error at server: ${message}`)
  }
}

/**
 * Server Action to handle token refresh and update httpOnly cookies
 */
export async function refreshTokenAction(refreshToken?: string): Promise<LoginResponse> {
  try {
    const cookieStore = await cookies()
    const tokenToUse = refreshToken || cookieStore.get('refreshToken')?.value

    if (!tokenToUse) {
      throw new Error('No refresh token available')
    }

    // Call the backend API
    const response = await axios.post<ApiResponse<LoginResponse>>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken: tokenToUse },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.data?.data) {
      throw new Error('Invalid response from server')
    }

    const { accessToken, refreshToken: newRefreshToken } = response.data.data

    // Update cookies
    cookieStore.set('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15, // 15 minutes in seconds
      path: '/',
      sameSite: 'lax',
    })

    cookieStore.set('refreshToken', newRefreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
      sameSite: 'lax',
    })

    return response.data.data
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Error refreshing token: ${message}`)
  }
}

/**
 * Server Action to handle logout and clear httpOnly cookies
 */
export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    // Call the backend API if we have a token
    if (accessToken) {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    }
  } catch (error) {
    // Even if API call fails, we still want to clear cookies
    console.error('Logout API error:', error)
  } finally {
    // Clear cookies by setting them with maxAge 0
    const cookieStore = await cookies()

    // Delete cookies using Next.js cookieStore.delete()
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    cookieStore.delete('userRole')

    // Also set with maxAge 0 as backup to ensure deletion
    cookieStore.set('accessToken', '', {
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
    })

    cookieStore.set('refreshToken', '', {
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
    })

    cookieStore.set('userRole', '', {
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
    })
  }
}
