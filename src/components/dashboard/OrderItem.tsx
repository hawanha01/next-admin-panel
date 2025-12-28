'use client'

import type { RecentOrder } from '@/types/dashboard.types'
import GenericText from '@/components/generic/GenericText'
import { formatCurrency, formatDate, getStatusColor } from '@/utils/dashboard.utils'

interface Props {
  order: RecentOrder
}

export default function OrderItem({ order }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <GenericText variant="h4" size="md" weight="semibold" className="mb-1">
          {order.orderNumber}
        </GenericText>
        <GenericText variant="p" size="sm" color="text-gray-600">
          {order.storeName}
        </GenericText>
        <GenericText variant="p" size="sm" weight="semibold" color="text-gray-900" className="mt-1">
          {formatCurrency(order.totalAmount)}
        </GenericText>
        <GenericText variant="p" size="xs" color="text-gray-500" className="mt-1">
          {formatDate(order.createdAt)}
        </GenericText>
      </div>
      <div>
        <GenericText
          variant="span"
          size="xs"
          weight="medium"
          className={`px-3 py-1 rounded-full inline-block ${getStatusColor(order.status)}`}
        >
          {order.status}
        </GenericText>
      </div>
    </div>
  )
}
