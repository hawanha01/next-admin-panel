/**
 * JWT utility functions for decoding and extracting data from JWT tokens
 */
import { jwtDecode } from 'jwt-decode'

export interface JwtPayload {
  sub: string // userId
  email: string
  role: string
  iat?: number // issued at
  exp?: number // expiration
}

/**
 * Decodes a JWT token and returns the payload
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Extracts userId from JWT token
 * @param token - The JWT token string
 * @returns The userId (sub) or null if invalid
 */
export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeJwt(token)
  return payload?.sub || null
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if expired, false if valid, null if invalid token
 */
export const isTokenExpired = (token: string): boolean | null => {
  const payload = decodeJwt(token)
  if (!payload || !payload.exp) {
    return null
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000
  return Date.now() >= expirationTime
}
