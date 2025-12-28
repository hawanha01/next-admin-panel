import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { storeOwnerApi } from '@/utils/api/store-owner.api'
import {
  getErrorMessage,
  extractApiError,
  parseValidationErrors,
  getApiErrorMessage,
} from '@/utils/error-handler'
import type { CreateStoreOwnerRequest } from '@/types/store-owner.types'

interface StoreOwnerState {
  loading: boolean
  error: string | null
  fieldErrors: Partial<Record<keyof CreateStoreOwnerRequest, string>>
}

const initialState: StoreOwnerState = {
  loading: false,
  error: null,
  fieldErrors: {},
}

// Async thunks
export const inviteStoreOwner = createAsyncThunk(
  'storeOwner/invite',
  async (data: CreateStoreOwnerRequest, { rejectWithValue }) => {
    try {
      const response = await storeOwnerApi.inviteStoreOwner(data)
      return response
    } catch (error: unknown) {
      // Extract API error response
      const apiError = extractApiError(error)

      if (apiError) {
        // Parse validation errors for field-level display
        const fieldErrors = parseValidationErrors<CreateStoreOwnerRequest>(apiError)

        // Get user-friendly error message
        const errorMessage = getApiErrorMessage(apiError)

        return rejectWithValue({
          error: errorMessage,
          fieldErrors,
        })
      }

      // Fallback for non-API errors
      const errorMessage = getErrorMessage(error, 'Failed to invite store owner')
      return rejectWithValue({
        error: errorMessage,
        fieldErrors: {},
      })
    }
  }
)

const storeOwnerSlice = createSlice({
  name: 'storeOwner',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
      state.fieldErrors = {}
    },
  },
  extraReducers: builder => {
    builder
      // Invite Store Owner
      .addCase(inviteStoreOwner.pending, state => {
        state.loading = true
        state.error = null
        state.fieldErrors = {}
      })
      .addCase(inviteStoreOwner.fulfilled, state => {
        state.loading = false
        state.error = null
        state.fieldErrors = {}
      })
      .addCase(inviteStoreOwner.rejected, (state, action) => {
        state.loading = false
        const payload = action.payload as
          | { error: string; fieldErrors: Partial<Record<keyof CreateStoreOwnerRequest, string>> }
          | undefined
        if (payload) {
          state.error = payload.error
          state.fieldErrors = payload.fieldErrors
        } else {
          state.error = 'Failed to invite store owner'
          state.fieldErrors = {}
        }
      })
  },
})

export const { clearError } = storeOwnerSlice.actions
export default storeOwnerSlice.reducer
