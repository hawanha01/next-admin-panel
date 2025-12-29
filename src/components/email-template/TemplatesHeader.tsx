'use client'

import { useRouter } from 'next/navigation'
import GenericText from '@/components/generic/GenericText'
import GenericButton from '@/components/generic/GenericButton'

export default function TemplatesHeader() {
  const router = useRouter()

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <GenericText variant="h1" size="3xl" weight="bold" className="mb-2">
          Email Templates
        </GenericText>
        <GenericText variant="p" size="lg" color="text-gray-600">
          Manage email templates for your platform
        </GenericText>
      </div>
      <GenericButton variant="primary" size="md" onClick={() => router.push('/templates/create')}>
        Create Template
      </GenericButton>
    </div>
  )
}
