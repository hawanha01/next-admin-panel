'use client'

import { useRouter } from 'next/navigation'
import type { RecentOrder } from '@/types/dashboard.types'
import GenericCard from '@/components/generic/GenericCard'
import GenericText from '@/components/generic/GenericText'
import GenericButton from '@/components/generic/GenericButton'
import OrderItem from './OrderItem'

interface Props {
  orders: RecentOrder[]
}

export default function RecentOrdersCard({ orders }: Props) {
  const router = useRouter()

  return (
    <GenericCard
      title="Recent Orders"
      actions={
        <GenericButton variant="secondary" size="sm" onClick={() => router.push('/orders')}>
          View All Orders
        </GenericButton>
      }
    >
      {orders.length === 0 ? (
        <div className="py-8 text-center">
          <GenericText variant="p" color="text-gray-500">
            No recent orders
          </GenericText>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </GenericCard>
  )
}
