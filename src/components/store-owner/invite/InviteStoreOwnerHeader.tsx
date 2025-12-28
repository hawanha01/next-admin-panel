'use client'

import GenericText from '@/components/generic/GenericText'

export default function InviteStoreOwnerHeader() {
  return (
    <div className="mb-8">
      <GenericText variant="h1" size="3xl" weight="bold" className="mb-2">
        Invite Store Owner
      </GenericText>
      <GenericText variant="p" size="lg" color="text-gray-600">
        Create a new store owner account and send them an invitation email
      </GenericText>
    </div>
  )
}
