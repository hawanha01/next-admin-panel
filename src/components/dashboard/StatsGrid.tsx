'use client'

import type { DashboardStats } from '@/types/dashboard.types'
import { formatCurrency } from '@/utils/dashboard.utils'
import StatCard from './StatCard'

interface Props {
  stats: DashboardStats
}

export default function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        label="Total Stores"
        value={stats.totalStores}
        icon="🏪"
        iconBgColor="bg-blue-100"
      />
      <StatCard
        label="Total Store Owners"
        value={stats.totalStoreOwners}
        icon="👥"
        iconBgColor="bg-green-100"
      />
      <StatCard
        label="Total Orders"
        value={stats.totalOrders}
        icon="📦"
        iconBgColor="bg-purple-100"
      />
      <StatCard
        label="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon="💰"
        iconBgColor="bg-yellow-100"
        isCurrency
      />
      <StatCard
        label="Active Stores"
        value={stats.activeStores}
        icon="✅"
        iconBgColor="bg-green-100"
        valueColor="text-green-600"
      />
      <StatCard
        label="Pending Stores"
        value={stats.pendingStores}
        icon="⏳"
        iconBgColor="bg-yellow-100"
        valueColor="text-yellow-600"
      />
    </div>
  )
}
