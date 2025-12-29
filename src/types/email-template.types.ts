export interface EmailTemplate {
  id: string
  templateCode: string
  name: string
  subject: string
  htmlContent: string
  description: string | null
  variables: string[] | null
  createdAt: string
  updatedAt: string
}

export interface EmailTemplateWithHtml extends EmailTemplate {
  formattedHtmlForSeeder: string
}

export interface CreateEmailTemplateRequest {
  templateCode: string
  name: string
  subject: string
  htmlContent: string
  description?: string
  variables?: string[]
}

export interface UpdateEmailTemplateRequest {
  templateCode?: string
  name?: string
  subject?: string
  htmlContent?: string
  description?: string
  variables?: string[]
}
