/**
 * API exports
 * Centralized export point for all API modules
 */

// Base API clients and methods
export {
  api, // Authenticated API (auto token from cookies)
  publicApi, // Public API (no auto token, can pass custom token)
  authenticatedClient,
  publicClient,
  default as apiClient,
} from './client'
