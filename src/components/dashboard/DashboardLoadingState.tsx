'use client'

import GenericLoader from '@/components/generic/GenericLoader'
import GenericText from '@/components/generic/GenericText'

export default function DashboardLoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <GenericLoader size="lg" color="primary" />
        <GenericText variant="p" color="text-gray-600" className="mt-4">
          Loading dashboard data...
        </GenericText>
      </div>
    </div>
  )
}
