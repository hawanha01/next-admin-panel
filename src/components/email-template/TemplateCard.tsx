'use client'

import { useRouter } from 'next/navigation'
import type { EmailTemplate } from '@/types/email-template.types'
import GenericCard from '@/components/generic/GenericCard'
import GenericText from '@/components/generic/GenericText'
import GenericButton from '@/components/generic/GenericButton'

interface Props {
  template: EmailTemplate
}

export default function TemplateCard({ template }: Props) {
  const router = useRouter()

  const handleView = () => {
    router.push(`/templates/${template.id}`)
  }

  return (
    <GenericCard>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <GenericText variant="h3" size="lg" weight="semibold" className="mb-2">
            {template.name}
          </GenericText>
          <GenericText variant="p" size="sm" color="text-gray-600" className="mb-2">
            <span className="font-medium">Code:</span> {template.templateCode}
          </GenericText>
          <GenericText variant="p" size="sm" color="text-gray-600" className="mb-2">
            <span className="font-medium">Subject:</span> {template.subject}
          </GenericText>
          {template.description && (
            <GenericText variant="p" size="sm" color="text-gray-500" className="mb-4">
              {template.description}
            </GenericText>
          )}
          {template.variables && template.variables.length > 0 && (
            <div className="mb-4">
              <GenericText variant="p" size="xs" color="text-gray-500" className="mb-1">
                Variables:
              </GenericText>
              <div className="flex flex-wrap gap-1">
                {template.variables.map(variable => (
                  <span
                    key={variable}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <GenericButton variant="primary" size="sm" onClick={handleView} className="flex-1">
            View
          </GenericButton>
          <GenericButton
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/templates/${template.id}/edit`)}
            className="flex-1"
          >
            Edit
          </GenericButton>
        </div>
      </div>
    </GenericCard>
  )
}
