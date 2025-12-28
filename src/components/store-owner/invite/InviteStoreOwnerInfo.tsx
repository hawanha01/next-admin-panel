'use client'

import GenericCard from '@/components/generic/GenericCard'
import GenericText from '@/components/generic/GenericText'

export default function InviteStoreOwnerInfo() {
  return (
    <GenericCard variant="outlined" className="mt-6">
      <GenericText variant="h3" size="md" weight="semibold" className="mb-4">
        What happens next?
      </GenericText>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
          <GenericText variant="p" size="sm" color="text-gray-600">
            A secure password will be automatically generated for the store owner
          </GenericText>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
          <GenericText variant="p" size="sm" color="text-gray-600">
            A welcome email will be sent with login credentials and a verification link
          </GenericText>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
          <GenericText variant="p" size="sm" color="text-gray-600">
            The store owner must verify their email before accessing their account
          </GenericText>
        </div>
      </div>
    </GenericCard>
  )
}
