/**
 * Shared error handling utilities for parsing API error responses
 */

export interface ValidationError {
  property: string
  constraints?: Record<string, string>
  value?: unknown
}

export interface ApiErrorResponse {
  statusCode: number
  message: string
  errors?: string[]
  validationErrors?: ValidationError[]
}

/**
 * Parse validation errors from API response and return field-specific errors
 */
export function parseValidationErrors<T extends object>(
  errorResponse: ApiErrorResponse
): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {}

  // Parse validationErrors array (detailed field-level errors)
  if (errorResponse.validationErrors && Array.isArray(errorResponse.validationErrors)) {
    errorResponse.validationErrors.forEach((validationError: ValidationError) => {
      const field = validationError.property as keyof T

      // Get the first constraint message (most specific error)
      if (validationError.constraints) {
        const constraintMessages = Object.values(validationError.constraints)
        if (constraintMessages.length > 0 && constraintMessages[0]) {
          // Make error message more user-friendly
          const errorMessage = constraintMessages[0]
          fieldErrors[field] = errorMessage
        }
      }
    })
  }

  // Fallback to errors array if validationErrors not available
  if (Object.keys(fieldErrors).length === 0 && errorResponse.errors) {
    errorResponse.errors.forEach((errorMsg: string) => {
      // Try to extract field name from error message (e.g., "email: Email is required")
      const match = errorMsg.match(/^(\w+):\s*(.+)$/i)
      if (match) {
        const field = match[1] as keyof T
        const message = match[2]
        fieldErrors[field] = message
      }
    })
  }

  return fieldErrors
}

/**
 * Get user-friendly error message from API response
 */
export function getApiErrorMessage(errorResponse: ApiErrorResponse): string {
  // If we have validation errors, create a summary message
  if (errorResponse.validationErrors && errorResponse.validationErrors.length > 0) {
    const fieldCount = errorResponse.validationErrors.length
    if (fieldCount === 1) {
      const firstError = errorResponse.validationErrors[0]
      if (firstError?.constraints) {
        const constraintValues = Object.values(firstError.constraints)
        if (constraintValues.length > 0 && constraintValues[0]) {
          return constraintValues[0]
        }
      }
    }
    return `Please fix ${fieldCount} error${fieldCount > 1 ? 's' : ''} in the form`
  }

  // Use errors array if available
  if (errorResponse.errors && errorResponse.errors.length > 0) {
    const firstError = errorResponse.errors[0]
    return firstError || 'Validation failed'
  }

  // Fallback to message
  return errorResponse.message || 'An error occurred'
}

/**
 * Extract API error response from caught error
 */
export function extractApiError(error: unknown): ApiErrorResponse | null {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const apiError = error as {
      response?: { data?: ApiErrorResponse }
    }

    if (apiError.response?.data) {
      return apiError.response.data
    }
  }

  return null
}

/**
 * Get user-friendly error message from any error
 */
export function getErrorMessage(error: unknown, defaultMessage = 'An error occurred'): string {
  // Try to extract API error response
  const apiError = extractApiError(error)
  if (apiError) {
    return getApiErrorMessage(apiError)
  }

  // Fallback to Error message
  if (error instanceof Error) {
    return error.message
  }

  return defaultMessage
}
