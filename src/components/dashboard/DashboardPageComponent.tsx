'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchAllDashboardData, clearError } from '@/store/slices/dashboardSlice'
import DashboardHeader from './DashboardHeader'
import DashboardLoadingState from './DashboardLoadingState'
import DashboardErrorState from './DashboardErrorState'
import StatsGrid from './StatsGrid'
import RecentDataGrid from './RecentDataGrid'

export default function DashboardPageComponent() {
  const dispatch = useAppDispatch()
  const { stats, recentStores, recentOrders, loading, error } = useAppSelector(
    state => state.dashboard
  )

  const hasStats = stats !== null
  const hasRecentData = recentStores.length > 0 || recentOrders.length > 0

  useEffect(() => {
    dispatch(fetchAllDashboardData())
  }, [dispatch])

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(fetchAllDashboardData())
  }

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader />

      {loading && !hasStats && <DashboardLoadingState />}

      {error && <DashboardErrorState error={error} onRetry={handleRetry} />}

      {hasStats && <StatsGrid stats={stats} />}

      {hasRecentData && <RecentDataGrid recentStores={recentStores} recentOrders={recentOrders} />}
    </div>
  )
}
