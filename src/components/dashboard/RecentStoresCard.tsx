'use client'

import { useRouter } from 'next/navigation'
import type { RecentStore } from '@/types/dashboard.types'
import GenericCard from '@/components/generic/GenericCard'
import GenericText from '@/components/generic/GenericText'
import GenericButton from '@/components/generic/GenericButton'
import StoreItem from './StoreItem'

interface Props {
  stores: RecentStore[]
}

export default function RecentStoresCard({ stores }: Props) {
  const router = useRouter()

  return (
    <GenericCard
      title="Recent Stores"
      actions={
        <GenericButton variant="secondary" size="sm" onClick={() => router.push('/stores')}>
          View All Stores
        </GenericButton>
      }
    >
      {stores.length === 0 ? (
        <div className="py-8 text-center">
          <GenericText variant="p" color="text-gray-500">
            No recent stores
          </GenericText>
        </div>
      ) : (
        <div className="space-y-4">
          {stores.map(store => (
            <StoreItem key={store.id} store={store} />
          ))}
        </div>
      )}
    </GenericCard>
  )
}
