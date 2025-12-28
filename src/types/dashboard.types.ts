export interface DashboardStats {
  totalStores: number
  totalStoreOwners: number
  totalOrders: number
  totalRevenue: number
  activeStores: number
  pendingStores: number
}

export interface RecentStore {
  id: string
  name: string
  ownerName: string
  status: 'active' | 'pending' | 'suspended'
  createdAt: string
}

export interface RecentOrder {
  id: string
  orderNumber: string
  storeName: string
  totalAmount: number
  status: string
  createdAt: string
}
