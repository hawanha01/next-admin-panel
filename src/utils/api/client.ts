import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { ApiResponse } from '@/types/api.types'
import { isTokenExpired } from '@/utils/jwt'
import type { LoginResponse } from '@/types/auth.types'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuthCookies,
} from '@/utils/cookies'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

/**
 * Check if we're in a browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

/**
 * Clear all auth-related cookies and redirect to login
 */
const clearAuthAndRedirect = (): void => {
  clearAuthCookies()
  if (isBrowser()) {
    window.location.href = '/login'
  }
}

/**
 * Refresh access token using refresh token
 * Backend expects refreshToken in request body
 */
const refreshAccessToken = async (refreshToken: string): Promise<LoginResponse | null> => {
  try {
    const response = await axios.post<ApiResponse<LoginResponse>>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.data?.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data
      // Set cookies client-side when refreshing tokens
      // Note: These should match the attributes used in server actions
      setAccessToken(accessToken)
      setRefreshToken(newRefreshToken)
      return response.data.data
    }
    return null
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return null
  }
}

/**
 * Authenticated API Client
 * Automatically adds accessToken from cookies to all requests
 * Use this for protected routes that require authentication
 */
const authenticatedClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to automatically add auth token and refresh if expired
authenticatedClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    // If no access token, proceed without it (will fail with 401)
    if (!accessToken) {
      return config
    }

    // Check if access token is expired or invalid
    const tokenStatus = isTokenExpired(accessToken)

    // If token is expired (true) or invalid (null), try to refresh
    if (tokenStatus === true || tokenStatus === null) {
      // Access token expired, try to refresh
      if (!refreshToken) {
        // No refresh token, clear auth and redirect
        clearAuthAndRedirect()
        return Promise.reject(new Error('Session expired, please login again'))
      }

      // Check if refresh token is also expired or invalid
      const refreshTokenStatus = isTokenExpired(refreshToken)
      if (refreshTokenStatus === true || refreshTokenStatus === null) {
        // Refresh token expired or invalid, clear auth and redirect
        clearAuthAndRedirect()
        return Promise.reject(new Error('Session expired, please login again'))
      }

      // Try to refresh the access token
      const newTokens = await refreshAccessToken(refreshToken)
      if (newTokens?.accessToken) {
        accessToken = newTokens.accessToken
      } else {
        // Refresh failed, clear auth and redirect
        clearAuthAndRedirect()
        return Promise.reject(new Error('Session expired, please login again'))
      }
    }

    // Add the (possibly refreshed) token to the request
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors (401 clears storage and redirects to login)
authenticatedClient.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (error.response?.status === 401) {
      // Backend returned 401 - token invalid or expired
      // Clear all storage and redirect to login
      clearAuthAndRedirect()
    }
    return Promise.reject(error)
  }
)

/**
 * Public API Client
 * Does NOT automatically add token, but allows custom token via config
 * Use this for public routes, login, registration, etc.
 */
const publicClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for public client (no auto token, but handles errors)
publicClient.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    // Handle errors without redirecting (for public endpoints)
    return Promise.reject(error)
  }
)

/**
 * Authenticated API methods
 * Automatically includes accessToken from cookies
 */
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await authenticatedClient.get<ApiResponse<T>>(url, config)
    return response.data
  },
  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await authenticatedClient.post<ApiResponse<T>>(url, data, config)
    return response.data
  },
  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await authenticatedClient.put<ApiResponse<T>>(url, data, config)
    return response.data
  },
  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await authenticatedClient.patch<ApiResponse<T>>(url, data, config)
    return response.data
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await authenticatedClient.delete<ApiResponse<T>>(url, config)
    return response.data
  },
}

/**
 * Public API methods
 * Does NOT automatically add token, but you can pass custom token via config
 * Example: publicApi.post('/auth/login', data, { headers: { Authorization: 'Bearer custom-token' } })
 */
export const publicApi = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await publicClient.get<ApiResponse<T>>(url, config)
    return response.data
  },
  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await publicClient.post<ApiResponse<T>>(url, data, config)
    return response.data
  },
  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await publicClient.put<ApiResponse<T>>(url, data, config)
    return response.data
  },
  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await publicClient.patch<ApiResponse<T>>(url, data, config)
    return response.data
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await publicClient.delete<ApiResponse<T>>(url, config)
    return response.data
  },
}

// Export clients for direct use if needed
export { authenticatedClient, publicClient }
export default authenticatedClient
