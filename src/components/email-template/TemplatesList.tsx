'use client'

import type { EmailTemplate } from '@/types/email-template.types'
import TemplateCard from './TemplateCard'

interface Props {
  templates: EmailTemplate[]
}

export default function TemplatesList({ templates }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map(template => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}
