export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userId: string
}

export interface User {
  id: string
  email: string
  username: string
  role: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  avatar: string | null
  isEmailVerified: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}
