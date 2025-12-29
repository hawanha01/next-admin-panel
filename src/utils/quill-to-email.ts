/**
 * Convert Quill HTML output to email-compatible HTML
 * - Converts Quill classes to inline styles
 * - Wraps content in proper email HTML structure if needed
 * - Ensures all styles are inline for email client compatibility
 */

/**
 * Convert Quill classes to inline styles using regex
 * This is more reliable than DOM parsing for email HTML
 */
const convertQuillClassesToInlineStyles = (html: string): string => {
  let processedHtml = html

  // Convert Quill alignment classes to inline styles
  // Match: class="ql-align-center" or class="some-class ql-align-center other-class"
  processedHtml = processedHtml.replace(
    /class="([^"]*\s)?ql-align-center(\s[^"]*)?"/g,
    (match, before = '', after = '') => {
      const remainingClasses = (before + after).trim().replace(/\s+/g, ' ')
      const styleAttr = 'style="text-align: center;"'
      if (remainingClasses) {
        return `class="${remainingClasses}" ${styleAttr}`
      }
      return styleAttr
    }
  )

  processedHtml = processedHtml.replace(
    /class="([^"]*\s)?ql-align-right(\s[^"]*)?"/g,
    (match, before = '', after = '') => {
      const remainingClasses = (before + after).trim().replace(/\s+/g, ' ')
      const styleAttr = 'style="text-align: right;"'
      if (remainingClasses) {
        return `class="${remainingClasses}" ${styleAttr}`
      }
      return styleAttr
    }
  )

  processedHtml = processedHtml.replace(
    /class="([^"]*\s)?ql-align-justify(\s[^"]*)?"/g,
    (match, before = '', after = '') => {
      const remainingClasses = (before + after).trim().replace(/\s+/g, ' ')
      const styleAttr = 'style="text-align: justify;"'
      if (remainingClasses) {
        return `class="${remainingClasses}" ${styleAttr}`
      }
      return styleAttr
    }
  )

  // Convert Quill background color classes
  // Match: class="ql-background-rgb(187,187,187)" or similar
  processedHtml = processedHtml.replace(
    /class="([^"]*\s)?ql-background-([^"\s]+)(\s[^"]*)?"/g,
    (match, before = '', bgValue = '', after = '') => {
      const remainingClasses = (before + after).trim().replace(/\s+/g, ' ')

      // Extract RGB or hex color
      let bgColor = bgValue
      if (bgValue.startsWith('rgb(')) {
        bgColor = bgValue
      } else if (bgValue.match(/^[0-9a-fA-F]{6}$/)) {
        bgColor = `#${bgValue}`
      } else {
        // Try to parse as RGB values
        const rgbMatch = bgValue.match(/(\d+),(\d+),(\d+)/)
        if (rgbMatch) {
          bgColor = `rgb(${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]})`
        }
      }

      const styleAttr = `style="background-color: ${bgColor};"`
      if (remainingClasses) {
        return `class="${remainingClasses}" ${styleAttr}`
      }
      return styleAttr
    }
  )

  // Remove empty class attributes
  processedHtml = processedHtml.replace(/class="\s*"/g, '')

  // Merge style attributes if element already has a style attribute
  // This handles cases where Quill adds both class and style
  processedHtml = processedHtml.replace(
    /(<[^>]+)\s+style="([^"]+)"\s+style="([^"]+)"/g,
    (match, tag, style1, style2) => {
      return `${tag} style="${style1}; ${style2}"`
    }
  )

  return processedHtml
}

/**
 * Extract body content if HTML is already wrapped
 */
const extractBodyContent = (html: string): string => {
  const trimmedHtml = html.trim()

  // If it's a full HTML document, extract body content
  if (trimmedHtml.includes('<body')) {
    const bodyMatch = trimmedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    if (bodyMatch && bodyMatch[1]) {
      return bodyMatch[1].trim()
    }
  }

  // If it's just body content wrapped in body tag, extract it
  if (trimmedHtml.startsWith('<body') && trimmedHtml.endsWith('</body>')) {
    const bodyMatch = trimmedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    if (bodyMatch && bodyMatch[1]) {
      return bodyMatch[1].trim()
    }
  }

  return html
}

/**
 * Wrap content in proper email HTML structure if not already wrapped
 */
const wrapInEmailStructure = (html: string): string => {
  // Check if already wrapped in full HTML structure
  const trimmedHtml = html.trim()
  if (trimmedHtml.startsWith('<!DOCTYPE') && trimmedHtml.includes('</html>')) {
    // Already wrapped, return as is
    return html
  }

  // Extract body content if it's wrapped in body tag
  const bodyContent = extractBodyContent(html)

  // Wrap in proper email HTML structure
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Email Template</title></head><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">${bodyContent}</body></html>`
}

/**
 * Convert Quill HTML to email-compatible HTML
 */
export const convertQuillToEmailHtml = (quillHtml: string): string => {
  if (!quillHtml || !quillHtml.trim()) {
    return quillHtml
  }

  try {
    // Step 1: Convert Quill classes to inline styles
    let processedHtml = convertQuillClassesToInlineStyles(quillHtml)

    // Step 2: Wrap in email structure if needed
    processedHtml = wrapInEmailStructure(processedHtml)

    return processedHtml
  } catch (error) {
    console.error('Error converting Quill HTML to email HTML:', error)
    // If conversion fails, return original HTML wrapped in structure
    return wrapInEmailStructure(quillHtml)
  }
}
