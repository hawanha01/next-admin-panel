'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchTemplateById,
  clearError,
  clearCurrentTemplate,
} from '@/store/slices/emailTemplateSlice'
import TemplateForm from './TemplateForm'
import GenericText from '@/components/generic/GenericText'
import GenericLoader from '@/components/generic/GenericLoader'

export default function EditTemplatePageComponent() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentTemplate, loading, error } = useAppSelector(state => state.emailTemplate)

  const templateId = params.id as string

  useEffect(() => {
    if (templateId) {
      dispatch(clearError())
      dispatch(clearCurrentTemplate())
      dispatch(fetchTemplateById(templateId))
    }

    return () => {
      dispatch(clearCurrentTemplate())
    }
  }, [dispatch, templateId])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <GenericLoader size="lg" color="primary" />
            <GenericText variant="p" color="text-gray-600" className="mt-4">
              Loading template...
            </GenericText>
          </div>
        </div>
      </div>
    )
  }

  if (error || !currentTemplate) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <GenericText variant="h1" size="3xl" weight="bold" className="mb-2">
            Edit Email Template
          </GenericText>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <GenericText variant="p" color="text-red-600">
            {error || 'Template not found'}
          </GenericText>
          <button
            onClick={() => router.push('/templates')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Templates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <GenericText variant="h1" size="3xl" weight="bold" className="mb-2">
          Edit Email Template
        </GenericText>
        <GenericText variant="p" size="lg" color="text-gray-600">
          Update the email template: {currentTemplate.name}
        </GenericText>
      </div>

      <TemplateForm mode="edit" template={currentTemplate} />
    </div>
  )
}
