import { api } from './client'
import type {
  EmailTemplate,
  EmailTemplateWithHtml,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
} from '@/types/email-template.types'

/**
 * Email Template API endpoints
 * All endpoints require authentication (admin role)
 */
export const emailTemplateApi = {
  /**
   * Get all email templates
   */
  getAll: async (): Promise<EmailTemplate[]> => {
    try {
      const response = await api.get<EmailTemplate[]>('/email-templates')
      // Backend returns array directly, not wrapped in ApiResponse
      return Array.isArray(response.data) ? response.data : []
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Error fetching email templates: ${message}`)
    }
  },

  /**
   * Get email template by ID
   */
  getById: async (id: string): Promise<EmailTemplate> => {
    try {
      const response = await api.get<EmailTemplate>(`/email-templates/${id}`)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Error fetching email template: ${message}`)
    }
  },

  /**
   * Create new email template
   */
  create: async (data: CreateEmailTemplateRequest): Promise<EmailTemplateWithHtml> => {
    try {
      const response = await api.post<EmailTemplateWithHtml>('/email-templates', data)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Error creating email template: ${message}`)
    }
  },

  /**
   * Update email template
   */
  update: async (id: string, data: UpdateEmailTemplateRequest): Promise<EmailTemplateWithHtml> => {
    try {
      const response = await api.put<EmailTemplateWithHtml>(`/email-templates/${id}`, data)
      return response.data
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Error updating email template: ${message}`)
    }
  },

  /**
   * Delete email template (soft delete)
   * Returns 204 No Content
   */
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/email-templates/${id}`)
      // 204 No Content - no response body
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Error deleting email template: ${message}`)
    }
  },
}
