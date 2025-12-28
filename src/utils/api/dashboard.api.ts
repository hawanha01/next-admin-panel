import type { DashboardStats, RecentStore, RecentOrder } from '@/types/dashboard.types'

/**
 * Dashboard API endpoints
 * Uses api for authenticated endpoints (auto token from cookies)
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      // TODO: Replace with actual API call when backend endpoint is ready
      // const response = await api.get<DashboardStats>('/admin/dashboard/stats')
      // return response.data

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        totalStores: 125,
        totalStoreOwners: 89,
        totalOrders: 3456,
        totalRevenue: 1250000,
        activeStores: 98,
        pendingStores: 12,
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Error fetching dashboard stats: ${message}`)
    }
  },

  /**
   * Get recent stores
   */
  getRecentStores: async (): Promise<RecentStore[]> => {
    try {
      // TODO: Replace with actual API call when backend endpoint is ready
      // const response = await api.get<RecentStore[]>('/admin/dashboard/recent-stores')
      // return response.data

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 300))
      return [
        {
          id: '1',
          name: 'Tech Store',
          ownerName: 'John Doe',
          status: 'active',
          createdAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'Fashion Boutique',
          ownerName: 'Jane Smith',
          status: 'pending',
          createdAt: '2024-01-14T14:20:00Z',
        },
        {
          id: '3',
          name: 'Electronics Hub',
          ownerName: 'Bob Johnson',
          status: 'active',
          createdAt: '2024-01-13T09:15:00Z',
        },
      ]
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Error fetching recent stores: ${message}`)
    }
  },

  /**
   * Get recent orders
   */
  getRecentOrders: async (): Promise<RecentOrder[]> => {
    try {
      // TODO: Replace with actual API call when backend endpoint is ready
      // const response = await api.get<RecentOrder[]>('/admin/dashboard/recent-orders')
      // return response.data

      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 300))
      return [
        {
          id: '1',
          orderNumber: 'ORD-001',
          storeName: 'Tech Store',
          totalAmount: 299.99,
          status: 'completed',
          createdAt: '2024-01-15T11:00:00Z',
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          storeName: 'Fashion Boutique',
          totalAmount: 149.5,
          status: 'pending',
          createdAt: '2024-01-15T10:45:00Z',
        },
        {
          id: '3',
          orderNumber: 'ORD-003',
          storeName: 'Electronics Hub',
          totalAmount: 599.99,
          status: 'processing',
          createdAt: '2024-01-15T10:30:00Z',
        },
      ]
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Error fetching recent orders: ${message}`)
    }
  },
}
