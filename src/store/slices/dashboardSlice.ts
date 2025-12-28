import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboardApi } from '@/utils/api/dashboard.api'
import { getErrorMessage } from '@/utils/error-handler'
import type { DashboardStats, RecentStore, RecentOrder } from '@/types/dashboard.types'

interface DashboardState {
  stats: DashboardStats | null
  recentStores: RecentStore[]
  recentOrders: RecentOrder[]
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  stats: null,
  recentStores: [],
  recentOrders: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await dashboardApi.getStats()
      return stats
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to fetch dashboard stats')
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchRecentStores = createAsyncThunk(
  'dashboard/fetchRecentStores',
  async (_, { rejectWithValue }) => {
    try {
      const stores = await dashboardApi.getRecentStores()
      return stores
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to fetch recent stores')
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchRecentOrders = createAsyncThunk(
  'dashboard/fetchRecentOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await dashboardApi.getRecentOrders()
      return orders
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to fetch recent orders')
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchAllDashboardData = createAsyncThunk(
  'dashboard/fetchAll',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchDashboardStats()),
      dispatch(fetchRecentStores()),
      dispatch(fetchRecentOrders()),
    ])
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
    resetDashboard: state => {
      state.stats = null
      state.recentStores = []
      state.recentOrders = []
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Stats
      .addCase(fetchDashboardStats.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
        state.error = null
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch dashboard stats'
      })
      // Fetch Recent Stores
      .addCase(fetchRecentStores.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecentStores.fulfilled, (state, action) => {
        state.loading = false
        state.recentStores = action.payload
        state.error = null
      })
      .addCase(fetchRecentStores.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch recent stores'
      })
      // Fetch Recent Orders
      .addCase(fetchRecentOrders.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false
        state.recentOrders = action.payload
        state.error = null
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch recent orders'
      })
      // Fetch All
      .addCase(fetchAllDashboardData.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllDashboardData.fulfilled, state => {
        state.loading = false
        state.error = null
      })
      .addCase(fetchAllDashboardData.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch dashboard data'
      })
  },
})

export const { clearError, resetDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer
