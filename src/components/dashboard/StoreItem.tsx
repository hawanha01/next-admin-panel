'use client'

import type { RecentStore } from '@/types/dashboard.types'
import GenericText from '@/components/generic/GenericText'
import { formatDate, getStatusColor } from '@/utils/dashboard.utils'

interface Props {
  store: RecentStore
}

export default function StoreItem({ store }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <GenericText variant="h4" size="md" weight="semibold" className="mb-1">
          {store.name}
        </GenericText>
        <GenericText variant="p" size="sm" color="text-gray-600">
          Owner: {store.ownerName}
        </GenericText>
        <GenericText variant="p" size="xs" color="text-gray-500" className="mt-1">
          {formatDate(store.createdAt)}
        </GenericText>
      </div>
      <div>
        <GenericText
          variant="span"
          size="xs"
          weight="medium"
          className={`px-3 py-1 rounded-full inline-block ${getStatusColor(store.status)}`}
        >
          {store.status}
        </GenericText>
      </div>
    </div>
  )
}
