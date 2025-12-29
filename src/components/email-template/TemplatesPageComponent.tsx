'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchAllTemplates, clearError } from '@/store/slices/emailTemplateSlice'
import TemplatesHeader from './TemplatesHeader'
import TemplatesLoadingState from './TemplatesLoadingState'
import TemplatesErrorState from './TemplatesErrorState'
import TemplatesList from './TemplatesList'

export default function TemplatesPageComponent() {
  const dispatch = useAppDispatch()
  const { templates, loading, error } = useAppSelector(state => state.emailTemplate)

  useEffect(() => {
    dispatch(clearError())
    dispatch(fetchAllTemplates())
  }, [dispatch])

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(fetchAllTemplates())
  }

  return (
    <div className="max-w-7xl mx-auto">
      <TemplatesHeader />

      {loading && templates.length === 0 && <TemplatesLoadingState />}

      {error && <TemplatesErrorState error={error} onRetry={handleRetry} />}

      {!loading && templates.length > 0 && <TemplatesList templates={templates} />}

      {!loading && templates.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">No email templates found</p>
        </div>
      )}
    </div>
  )
}
