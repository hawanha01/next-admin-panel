'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchTemplateById,
  deleteTemplate,
  clearError,
  clearCurrentTemplate,
} from '@/store/slices/emailTemplateSlice'
import TemplateDetailHeader from './TemplateDetailHeader'
import TemplateDetailLoadingState from './TemplateDetailLoadingState'
import TemplateDetailErrorState from './TemplateDetailErrorState'
import TemplateDetailContent from './TemplateDetailContent'

export default function TemplateDetailPageComponent() {
  const router = useRouter()
  const params = useParams()
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

  const handleRetry = () => {
    dispatch(clearError())
    if (templateId) {
      dispatch(fetchTemplateById(templateId))
    }
  }

  const handleDelete = async () => {
    if (!templateId || !currentTemplate) return

    if (
      window.confirm(
        `Are you sure you want to delete "${currentTemplate.name}"? This action cannot be undone.`
      )
    ) {
      const result = await dispatch(deleteTemplate(templateId))
      if (deleteTemplate.fulfilled.match(result)) {
        router.push('/templates')
      }
    }
  }

  const handleBack = () => {
    router.push('/templates')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <TemplateDetailHeader onBack={handleBack} />

      {loading && !currentTemplate && <TemplateDetailLoadingState />}

      {error && <TemplateDetailErrorState error={error} onRetry={handleRetry} />}

      {currentTemplate && !loading && (
        <TemplateDetailContent template={currentTemplate} onDelete={handleDelete} />
      )}
    </div>
  )
}
