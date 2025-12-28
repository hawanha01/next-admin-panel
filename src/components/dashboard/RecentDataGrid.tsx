'use client'

import type { RecentStore, RecentOrder } from '@/types/dashboard.types'
import RecentStoresCard from './RecentStoresCard'
import RecentOrdersCard from './RecentOrdersCard'

interface Props {
  recentStores: RecentStore[]
  recentOrders: RecentOrder[]
}

export default function RecentDataGrid({ recentStores, recentOrders }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentStoresCard stores={recentStores} />
      <RecentOrdersCard orders={recentOrders} />
    </div>
  )
}
