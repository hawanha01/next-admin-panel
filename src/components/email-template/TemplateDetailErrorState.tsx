'use client'

import GenericCard from '@/components/generic/GenericCard'
import GenericText from '@/components/generic/GenericText'
import GenericButton from '@/components/generic/GenericButton'

interface Props {
  error: string
  onRetry: () => void
}

export default function TemplateDetailErrorState({ error, onRetry }: Props) {
  return (
    <div className="mb-6">
      <GenericCard
        variant="outlined"
        actions={
          <GenericButton variant="primary" onClick={onRetry}>
            Retry
          </GenericButton>
        }
      >
        <GenericText variant="p" color="text-red-600">
          {error}
        </GenericText>
      </GenericCard>
    </div>
  )
}
