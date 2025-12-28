import { api } from './client'
import type { CreateStoreOwnerRequest, CreateStoreOwnerResponse } from '@/types/store-owner.types'

/**
 * Store Owner API endpoints
 * All endpoints require authentication (admin role)
 */
export const storeOwnerApi = {
  /**
   * Create/invite a new store owner
   * Admin-only endpoint
   */
  inviteStoreOwner: async (data: CreateStoreOwnerRequest): Promise<CreateStoreOwnerResponse> => {
    try {
      const response = await api.post<CreateStoreOwnerResponse>('/admin/store-owners', data)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Error inviting store owner: ${message}`)
    }
  },
}
