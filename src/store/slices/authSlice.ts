import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { loginAction, logoutAction as serverLogoutAction } from '@/app/actions/auth.actions'
import { getUserIdFromToken, isTokenExpired } from '@/utils/jwt'
import { getErrorMessage } from '@/utils/error-handler'
import { getAccessToken, getRefreshToken } from '@/utils/cookies'
import type { LoginRequest, User } from '@/types/auth.types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

// Initialize auth from cookies (synchronous check)
if (typeof window !== 'undefined') {
  const storedToken = getAccessToken()
  const storedRefreshToken = getRefreshToken()

  if (storedToken && storedRefreshToken) {
    initialState.accessToken = storedToken
    initialState.refreshToken = storedRefreshToken

    const userId = getUserIdFromToken(storedToken)
    if (userId) {
      initialState.user = {
        id: userId,
        email: '',
        username: '',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        phone: '',
        avatar: null,
        isEmailVerified: true,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      initialState.isAuthenticated = true
    }
  }
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      // Call server action which sets httpOnly cookies
      const role = 'admin' // You can make this dynamic if needed
      const response = await loginAction(credentials, role)

      if (response && response.accessToken) {
        // Cookies are already set by the server action (both httpOnly and non-httpOnly)
        // No need to store in localStorage anymore

        // Extract user info from token
        const userId = getUserIdFromToken(response.accessToken)
        const user: User = {
          id: userId || response.userId,
          email: '',
          username: '',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          fullName: 'Admin User',
          phone: '',
          avatar: null,
          isEmailVerified: true,
          lastLoginAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        return {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user,
        }
      }

      throw new Error('Invalid response from server')
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        'An error occurred during login. Please try again.'
      )
      return rejectWithValue(errorMessage)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    // Call server action which handles backend API and clears cookies
    await serverLogoutAction()
  } catch (error: unknown) {
    // Even if API call fails, we still want to clear cookies
    const errorMessage = getErrorMessage(error, 'Failed to logout on server')
    console.error('Logout API error:', errorMessage)
    // Don't throw - we'll still clear cookies
  }

  // Clear all auth-related cookies (always, even if API fails)
  // Do this synchronously to ensure cookies are cleared immediately
  if (typeof window !== 'undefined') {
    // Use dynamic import instead of require
    const { clearAuthCookies } = await import('@/utils/cookies')
    clearAuthCookies()
  }

  // Return success to trigger fulfilled case
  return { success: true }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
    initializeAuth: (
      state,
      action: PayloadAction<
        { accessToken: string; refreshToken: string; user: User | null } | undefined
      >
    ) => {
      // Reducer should be pure - receive data from action payload
      const { accessToken, refreshToken, user } = action.payload || {}

      if (accessToken && refreshToken) {
        // Validate token before setting
        const tokenStatus = isTokenExpired(accessToken)
        if (tokenStatus === false) {
          // Token is valid
          state.accessToken = accessToken
          state.refreshToken = refreshToken
          state.user = user || null
          state.isAuthenticated = true
        } else {
          // Token expired or invalid
          state.isAuthenticated = false
          state.accessToken = null
          state.refreshToken = null
          state.user = null
        }
      } else {
        state.isAuthenticated = false
        state.accessToken = null
        state.refreshToken = null
        state.user = null
      }
    },
    clearAuth: state => {
      // Pure reducer - only updates state, no side effects
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(login.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Login failed'
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logout.pending, state => {
        state.loading = true
      })
      .addCase(logout.fulfilled, state => {
        // Pure reducer - only updates state, no side effects
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
      .addCase(logout.rejected, state => {
        // Even if logout API fails, clear state
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
  },
})

export const { clearError, initializeAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
