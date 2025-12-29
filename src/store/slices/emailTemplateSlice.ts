import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { emailTemplateApi } from '@/utils/api/email-template.api'
import {
  getErrorMessage,
  extractApiError,
  parseValidationErrors,
  getApiErrorMessage,
} from '@/utils/error-handler'
import type {
  EmailTemplate,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
} from '@/types/email-template.types'

interface EmailTemplateState {
  templates: EmailTemplate[]
  currentTemplate: EmailTemplate | null
  loading: boolean
  error: string | null
  fieldErrors: Partial<Record<string, string>>
}

const initialState: EmailTemplateState = {
  templates: [],
  currentTemplate: null,
  loading: false,
  error: null,
  fieldErrors: {},
}

// Async thunks
export const fetchAllTemplates = createAsyncThunk(
  'emailTemplate/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const templates = await emailTemplateApi.getAll()
      return templates
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to fetch email templates')
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchTemplateById = createAsyncThunk(
  'emailTemplate/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const template = await emailTemplateApi.getById(id)
      return template
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to fetch email template')
      return rejectWithValue(errorMessage)
    }
  }
)

export const createTemplate = createAsyncThunk(
  'emailTemplate/create',
  async (data: CreateEmailTemplateRequest, { rejectWithValue, dispatch }) => {
    try {
      const template = await emailTemplateApi.create(data)
      // Refetch templates after creation
      await dispatch(fetchAllTemplates())
      return template
    } catch (error: unknown) {
      const apiError = extractApiError(error)
      if (apiError) {
        const errorMessage = getApiErrorMessage(apiError)
        const fieldErrors = parseValidationErrors(apiError)
        return rejectWithValue({ message: errorMessage, fieldErrors })
      }
      const errorMessage = getErrorMessage(error, 'Failed to create email template')
      return rejectWithValue({ message: errorMessage, fieldErrors: {} })
    }
  }
)

export const updateTemplate = createAsyncThunk(
  'emailTemplate/update',
  async (
    { id, data }: { id: string; data: UpdateEmailTemplateRequest },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const template = await emailTemplateApi.update(id, data)
      // Refetch templates after update
      await dispatch(fetchAllTemplates())
      return template
    } catch (error: unknown) {
      const apiError = extractApiError(error)
      if (apiError) {
        const errorMessage = getApiErrorMessage(apiError)
        const fieldErrors = parseValidationErrors(apiError)
        return rejectWithValue({ message: errorMessage, fieldErrors })
      }
      const errorMessage = getErrorMessage(error, 'Failed to update email template')
      return rejectWithValue({ message: errorMessage, fieldErrors: {} })
    }
  }
)

export const deleteTemplate = createAsyncThunk(
  'emailTemplate/delete',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await emailTemplateApi.delete(id)
      // Refetch templates after deletion
      await dispatch(fetchAllTemplates())
      return id
    } catch (error: unknown) {
      const apiError = extractApiError(error)
      if (apiError) {
        const errorMessage = getApiErrorMessage(apiError)
        return rejectWithValue(errorMessage)
      }
      const errorMessage = getErrorMessage(error, 'Failed to delete email template')
      return rejectWithValue(errorMessage)
    }
  }
)

const emailTemplateSlice = createSlice({
  name: 'emailTemplate',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
      state.fieldErrors = {}
    },
    clearCurrentTemplate: state => {
      state.currentTemplate = null
    },
  },
  extraReducers: builder => {
    builder
      // Fetch All Templates
      .addCase(fetchAllTemplates.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllTemplates.fulfilled, (state, action) => {
        state.loading = false
        state.templates = action.payload
        state.error = null
      })
      .addCase(fetchAllTemplates.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch email templates'
      })
      // Fetch Template By ID
      .addCase(fetchTemplateById.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false
        state.currentTemplate = action.payload
        state.error = null
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch email template'
      })
      // Create Template
      .addCase(createTemplate.pending, state => {
        state.loading = true
        state.error = null
        state.fieldErrors = {}
      })
      .addCase(createTemplate.fulfilled, state => {
        state.loading = false
        state.error = null
        state.fieldErrors = {}
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false
        const payload = action.payload as
          | { message?: string; fieldErrors?: Record<string, string> }
          | string
        if (typeof payload === 'object' && payload !== null) {
          state.error = payload.message || 'Failed to create email template'
          state.fieldErrors = payload.fieldErrors || {}
        } else {
          state.error = payload || 'Failed to create email template'
          state.fieldErrors = {}
        }
      })
      // Update Template
      .addCase(updateTemplate.pending, state => {
        state.loading = true
        state.error = null
        state.fieldErrors = {}
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false
        state.currentTemplate = action.payload as EmailTemplate
        state.error = null
        state.fieldErrors = {}
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false
        const payload = action.payload as
          | { message?: string; fieldErrors?: Record<string, string> }
          | string
        if (typeof payload === 'object' && payload !== null) {
          state.error = payload.message || 'Failed to update email template'
          state.fieldErrors = payload.fieldErrors || {}
        } else {
          state.error = payload || 'Failed to update email template'
          state.fieldErrors = {}
        }
      })
      // Delete Template
      .addCase(deleteTemplate.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTemplate.fulfilled, state => {
        state.loading = false
        state.error = null
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to delete email template'
      })
  },
})

export const { clearError, clearCurrentTemplate } = emailTemplateSlice.actions
export default emailTemplateSlice.reducer
