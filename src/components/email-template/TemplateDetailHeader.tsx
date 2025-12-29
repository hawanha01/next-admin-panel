'use client'

import GenericButton from '@/components/generic/GenericButton'
import GenericText from '@/components/generic/GenericText'

interface Props {
  onBack: () => void
}

export default function TemplateDetailHeader({ onBack }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <GenericButton variant="secondary" size="sm" onClick={onBack}>
          ← Back
        </GenericButton>
      </div>
      <GenericText variant="h1" size="3xl" weight="bold" className="mb-2">
        Email Template Details
      </GenericText>
      <GenericText variant="p" size="lg" color="text-gray-600">
        View and manage email template
      </GenericText>
    </div>
  )
}
