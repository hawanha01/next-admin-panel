'use client'

import { useState, useEffect, useMemo, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { createTemplate, updateTemplate, clearError } from '@/store/slices/emailTemplateSlice'
import { minifyHtml } from '@/utils/html-minifier'
import { convertQuillToEmailHtml } from '@/utils/quill-to-email'
import GenericCard from '@/components/generic/GenericCard'
import GenericButton from '@/components/generic/GenericButton'
import GenericText from '@/components/generic/GenericText'
import GenericInput from '@/components/generic/GenericInput'
import QuillEditor from './QuillEditor'
import type {
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
  EmailTemplate,
} from '@/types/email-template.types'

interface TemplateFormProps {
  template?: EmailTemplate | null
  mode: 'create' | 'edit'
}

/**
 * Extract variables from text content (HTML or plain text)
 * Matches patterns like {{variableName}}
 * Case-sensitive: {{firstName}} and {{FirstName}} are treated as different variables
 */
const extractVariables = (text: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g
  const matches: string[] = []
  const seenVariableNames = new Set<string>()
  let match

  while ((match = regex.exec(text)) !== null) {
    const variableName = match[1].trim()
    if (variableName) {
      // Case sensitive duplicate check
      if (!seenVariableNames.has(variableName)) {
        seenVariableNames.add(variableName)
        matches.push(variableName) // Keep original case of first occurrence
      }
    }
  }

  return matches.sort()
}

/**
 * Validate variable names - they should not contain spaces
 */
const validateVariableNames = (variables: string[]): { valid: boolean; invalid: string[] } => {
  const invalid = variables.filter(v => /\s/.test(v))
  return {
    valid: invalid.length === 0,
    invalid,
  }
}

export default function TemplateForm({ template, mode }: TemplateFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error, fieldErrors } = useAppSelector(state => state.emailTemplate)

  const [form, setForm] = useState<CreateEmailTemplateRequest>({
    templateCode: template?.templateCode || '',
    name: template?.name || '',
    subject: template?.subject || '',
    htmlContent: template?.htmlContent || '',
    description: template?.description || '',
    variables: template?.variables || [],
  })

  const [localErrors, setLocalErrors] = useState<
    Partial<Record<keyof CreateEmailTemplateRequest, string>>
  >({})
  const [variableValidationError, setVariableValidationError] = useState<string>('')

  // Auto-detect variables from HTML content and subject
  const detectedVariables = useMemo(() => {
    const htmlVars = extractVariables(form.htmlContent)
    const subjectVars = extractVariables(form.subject)
    const allVars = [...htmlVars, ...subjectVars]
    return Array.from(new Set(allVars)).sort()
  }, [form.htmlContent, form.subject])

  // Auto-update variables list when HTML content or subject changes
  useEffect(() => {
    if (detectedVariables.length > 0) {
      const validation = validateVariableNames(detectedVariables)
      if (validation.valid) {
        startTransition(() => {
          setForm(prev => {
            // Only update if detected variables are different from current
            const currentVars = prev.variables || []
            const varsEqual =
              currentVars.length === detectedVariables.length &&
              currentVars.every((v, i) => v === detectedVariables[i])
            if (varsEqual) {
              return prev
            }
            return {
              ...prev,
              variables: detectedVariables,
            }
          })
          setVariableValidationError('')
        })
      } else {
        startTransition(() => {
          setVariableValidationError(
            `Invalid variable names (spaces not allowed): ${validation.invalid.map(v => `{{${v}}}`).join(', ')}`
          )
        })
      }
    } else {
      // If no variables detected, clear variables only if they were auto-detected
      // Keep existing variables if they were manually set (but we can't distinguish, so clear)
      startTransition(() => {
        setForm(prev => ({
          ...prev,
          variables: [],
        }))
        setVariableValidationError('')
      })
    }
  }, [detectedVariables]) // Only depend on detectedVariables, not form.variables to avoid loops

  useEffect(() => {
    if (template) {
      startTransition(() => {
        setForm({
          templateCode: template.templateCode,
          name: template.name,
          subject: template.subject,
          htmlContent: template.htmlContent,
          description: template.description || '',
          variables: template.variables || [],
        })
      })
    }
  }, [template])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateEmailTemplateRequest, string>> = {}

    if (!form.templateCode.trim()) {
      newErrors.templateCode = 'Template code is required'
    } else if (form.templateCode.length > 100) {
      newErrors.templateCode = 'Template code must not exceed 100 characters'
    }

    if (!form.name.trim()) {
      newErrors.name = 'Template name is required'
    } else if (form.name.length > 255) {
      newErrors.name = 'Template name must not exceed 255 characters'
    }

    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required'
    } else if (form.subject.length > 500) {
      newErrors.subject = 'Subject must not exceed 500 characters'
    }

    if (!form.htmlContent.trim()) {
      newErrors.htmlContent = 'HTML content is required'
    }

    // Validate variables - check for spaces in variable names
    if (detectedVariables.length > 0) {
      const validation = validateVariableNames(detectedVariables)
      if (!validation.valid) {
        newErrors.variables = `Variable names cannot contain spaces: ${validation.invalid.map(v => `{{${v}}}`).join(', ')}`
        setVariableValidationError(newErrors.variables)
      }
    }

    // Also validate manually entered variables
    if (form.variables && form.variables.length > 0) {
      const validation = validateVariableNames(form.variables)
      if (!validation.valid) {
        newErrors.variables = `Variable names cannot contain spaces: ${validation.invalid.map(v => `{{${v}}}`).join(', ')}`
        setVariableValidationError(newErrors.variables)
      }
    }

    setLocalErrors(newErrors)
    return Object.keys(newErrors).length === 0 && !variableValidationError
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    dispatch(clearError())

    // Convert Quill HTML to email-compatible HTML (converts classes to inline styles)
    const emailHtml = convertQuillToEmailHtml(form.htmlContent)

    // Minify HTML before sending to backend
    const minifiedHtml = minifyHtml(emailHtml)
    const submitData = {
      ...form,
      htmlContent: minifiedHtml,
    }

    try {
      if (mode === 'create') {
        const result = await dispatch(createTemplate(submitData))
        if (createTemplate.fulfilled.match(result)) {
          router.push('/templates')
        }
      } else if (template) {
        const updateData: UpdateEmailTemplateRequest = {
          name: submitData.name,
          subject: submitData.subject,
          htmlContent: submitData.htmlContent,
          description: submitData.description,
          variables: submitData.variables,
          // templateCode is excluded as it cannot be changed in edit mode
        }
        const result = await dispatch(updateTemplate({ id: template.id, data: updateData }))
        if (updateTemplate.fulfilled.match(result)) {
          router.push(`/templates/${template.id}`)
        }
      }
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  const handleChange = (field: keyof CreateEmailTemplateRequest, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear local error when user starts typing
    if (localErrors[field]) {
      setLocalErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const getFieldError = (field: keyof CreateEmailTemplateRequest): string | undefined => {
    return fieldErrors[field] || localErrors[field]
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Template Code */}
        <div>
          <GenericInput
            label="Template Code"
            type="text"
            value={form.templateCode}
            onChange={value => handleChange('templateCode', value as string)}
            error={getFieldError('templateCode')}
            placeholder="e.g., store-owner-welcome"
            required
            disabled={mode === 'edit'}
          />
          <GenericText variant="p" size="xs" color="text-gray-500" className="mt-1">
            {mode === 'edit'
              ? 'Template code cannot be changed'
              : 'Unique identifier for this template'}
          </GenericText>
        </div>

        {/* Template Name */}
        <div>
          <GenericInput
            label="Template Name"
            type="text"
            value={form.name}
            onChange={value => handleChange('name', value as string)}
            error={getFieldError('name')}
            placeholder="e.g., Store Owner Welcome Email"
            required
          />
        </div>

        {/* Subject */}
        <div>
          <GenericInput
            label="Email Subject"
            type="text"
            value={form.subject}
            onChange={value => handleChange('subject', value as string)}
            error={getFieldError('subject')}
            placeholder="e.g., Welcome {{firstName}} - Store Owner Account Created"
            required
          />
          <GenericText variant="p" size="xs" color="text-gray-500" className="mt-1">
            You can use template variables like {'{{variableName}}'}
          </GenericText>
        </div>

        {/* Description */}
        <div>
          <GenericInput
            label="Description"
            type="text"
            value={form.description || ''}
            onChange={value => handleChange('description', value as string)}
            error={getFieldError('description')}
            placeholder="Optional description of this template"
          />
        </div>

        {/* HTML Content Editor */}
        <div>
          <GenericText variant="span" size="md" weight="medium" className="mb-2 block">
            HTML Content <span className="text-red-500">*</span>
          </GenericText>
          <QuillEditor
            value={form.htmlContent}
            onChange={value => handleChange('htmlContent', value)}
            placeholder="Enter email content..."
            className="mb-2"
          />
          {getFieldError('htmlContent') && (
            <GenericText variant="p" size="sm" color="text-red-600" className="mt-1">
              {getFieldError('htmlContent')}
            </GenericText>
          )}
          <GenericText variant="p" size="xs" color="text-gray-500" className="mt-1">
            You can use template variables like {'{{variableName}}'} in the content
          </GenericText>
        </div>

        {/* Variables - Auto-detected */}
        <div>
          <GenericText variant="span" size="md" weight="medium" className="mb-2 block">
            Template Variables
          </GenericText>
          {detectedVariables.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {detectedVariables.map(variable => {
                  const hasSpace = /\s/.test(variable)
                  return (
                    <span
                      key={variable}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                        hasSpace
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {`{{${variable}}}`}
                      {hasSpace && (
                        <span className="ml-2 text-red-600" title="Variable name contains spaces">
                          ⚠️
                        </span>
                      )}
                    </span>
                  )
                })}
              </div>
              {variableValidationError && (
                <GenericText variant="p" size="sm" color="text-red-600" className="mt-2">
                  {variableValidationError}
                </GenericText>
              )}
              <GenericText variant="p" size="xs" color="text-gray-500" className="mt-1">
                Variables are automatically detected from your HTML content and subject. Variable
                names cannot contain spaces.
              </GenericText>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <GenericText variant="p" size="sm" color="text-gray-600">
                No variables detected. Variables will be automatically detected when you use{' '}
                {'{{variableName}}'} in your content.
              </GenericText>
            </div>
          )}
          {getFieldError('variables') && (
            <GenericText variant="p" size="sm" color="text-red-600" className="mt-2">
              {getFieldError('variables')}
            </GenericText>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <GenericCard variant="outlined">
            <GenericText variant="p" color="text-red-600">
              {error}
            </GenericText>
          </GenericCard>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <GenericButton type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Saving...' : mode === 'create' ? 'Create Template' : 'Update Template'}
          </GenericButton>
          <GenericButton
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </GenericButton>
        </div>
      </div>
    </form>
  )
}
