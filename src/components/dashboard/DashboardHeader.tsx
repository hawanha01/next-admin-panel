'use client'

import GenericText from '@/components/generic/GenericText'

export default function DashboardHeader() {
  return (
    <div className="mb-8">
      <GenericText variant="h1" size="3xl" weight="bold" className="mb-2">
        Admin Dashboard
      </GenericText>
      <GenericText variant="p" size="lg" color="text-gray-600">
        Overview of your e-commerce platform
      </GenericText>
    </div>
  )
}
