'use client'

import { useState, useMemo } from 'react'
import type { EmailTemplate } from '@/types/email-template.types'
import { formatHtmlForPreview } from '@/utils/html-formatter'
import GenericCard from '@/components/generic/GenericCard'
import GenericText from '@/components/generic/GenericText'
import GenericButton from '@/components/generic/GenericButton'

interface Props {
  template: EmailTemplate
  onDelete: () => void
}

export default function TemplateDetailContent({ template, onDelete }: Props) {
  const [showHtml, setShowHtml] = useState(false)

  // Format HTML to restore spacing for better preview
  const formattedHtml = useMemo(() => {
    return formatHtmlForPreview(template.htmlContent)
  }, [template.htmlContent])

  return (
    <div className="space-y-6">
      {/* Template Info Card */}
      <GenericCard>
        <div className="space-y-4">
          <div>
            <GenericText variant="p" size="sm" color="text-gray-600" className="mb-1">
              Template Name
            </GenericText>
            <GenericText variant="h3" size="xl" weight="semibold">
              {template.name}
            </GenericText>
          </div>

          <div>
            <GenericText variant="p" size="sm" color="text-gray-600" className="mb-1">
              Template Code
            </GenericText>
            <GenericText variant="p" size="md" weight="medium">
              {template.templateCode}
            </GenericText>
          </div>

          <div>
            <GenericText variant="p" size="sm" color="text-gray-600" className="mb-1">
              Subject
            </GenericText>
            <GenericText variant="p" size="md">
              {template.subject}
            </GenericText>
          </div>

          {template.description && (
            <div>
              <GenericText variant="p" size="sm" color="text-gray-600" className="mb-1">
                Description
              </GenericText>
              <GenericText variant="p" size="md">
                {template.description}
              </GenericText>
            </div>
          )}

          {template.variables && template.variables.length > 0 && (
            <div>
              <GenericText variant="p" size="sm" color="text-gray-600" className="mb-2">
                Available Variables
              </GenericText>
              <div className="flex flex-wrap gap-2">
                {template.variables.map(variable => (
                  <span
                    key={variable}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <GenericButton
              variant="primary"
              size="md"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/templates/${template.id}/edit`
                }
              }}
            >
              Edit Template
            </GenericButton>
            <GenericButton variant="danger" size="md" onClick={onDelete}>
              Delete Template
            </GenericButton>
          </div>
        </div>
      </GenericCard>

      {/* HTML Content Card */}
      <GenericCard>
        <div className="flex items-center justify-between mb-4">
          <GenericText variant="h3" size="lg" weight="semibold">
            HTML Content
          </GenericText>
          <GenericButton variant="secondary" size="sm" onClick={() => setShowHtml(!showHtml)}>
            {showHtml ? 'Hide HTML' : 'Show HTML'}
          </GenericButton>
        </div>

        {showHtml ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
                {template.htmlContent}
              </pre>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <GenericText variant="p" size="xs" color="text-blue-700">
                <strong>Preview:</strong> The HTML content above is minified. Use the preview below
                to see the rendered version.
              </GenericText>
            </div>
          </div>
        ) : (
          <GenericText variant="p" size="sm" color="text-gray-500">
            Click &quot;Show HTML&quot; to view the template HTML content
          </GenericText>
        )}
      </GenericCard>

      {/* HTML Preview Card - Always visible */}
      <GenericCard>
        <GenericText variant="h3" size="lg" weight="semibold" className="mb-4">
          Email Preview
        </GenericText>
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 shadow-lg">
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <GenericText variant="p" size="sm" color="text-gray-600">
              Email Preview
            </GenericText>
            <div className="w-16"></div>
          </div>
          <div className="bg-white">
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      body {
                        margin: 0;
                        padding: 40px 20px;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                        line-height: 1.6;
                        background-color: #f5f5f5;
                        color: #333;
                      }
                      * {
                        max-width: 100%;
                        box-sizing: border-box;
                      }
                      /* Email container styling */
                      .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                      }
                    </style>
                  </head>
                  <body>
                    <div class="email-container">
                      ${formattedHtml}
                    </div>
                  </body>
                </html>
              `}
              className="w-full min-h-[700px] border-0"
              title="Email Template Preview"
              sandbox="allow-same-origin"
              style={{
                display: 'block',
                width: '100%',
                minHeight: '700px',
                border: 'none',
              }}
            />
          </div>
        </div>
      </GenericCard>
    </div>
  )
}
