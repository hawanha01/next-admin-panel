'use client'

import TemplateForm from './TemplateForm'
import GenericText from '@/components/generic/GenericText'

export default function CreateTemplatePageComponent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <GenericText variant="h1" size="3xl" weight="bold" className="mb-2">
          Create Email Template
        </GenericText>
        <GenericText variant="p" size="lg" color="text-gray-600">
          Create a new email template for your platform
        </GenericText>
      </div>

      <TemplateForm mode="create" />
    </div>
  )
}
