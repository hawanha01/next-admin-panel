/**
 * Restore spacing in minified HTML
 * The backend minifies HTML by removing all whitespace, including spaces within text.
 * This function attempts to restore spaces in common patterns found in email templates.
 */
export const restoreHtmlSpacing = (html: string): string => {
  let restored = html
  // First, preserve template variables (they should have spaces around them)
  // Replace {{variable}} with a placeholder, restore later
  const variablePlaceholders: string[] = []
  restored = restored.replace(/\{\{([^}]+)\}\}/g, match => {
    const placeholder = `__VAR_${variablePlaceholders.length}__`
    variablePlaceholders.push(match)
    return placeholder
  })

  // Add space before capital letters (but not for acronyms like HTML, CSS, etc.)
  // Only if preceded by lowercase letter
  restored = restored.replace(/([a-z])([A-Z][a-z])/g, '$1 $2')

  // Add space after punctuation (periods, exclamation, question marks, commas)
  restored = restored.replace(/([.!?,])([A-Za-z])/g, '$1 $2')

  // Add space after colons
  restored = restored.replace(/(:)([A-Za-z])/g, '$1 $2')

  // Add space before opening parentheses (but not for function calls in attributes)
  restored = restored.replace(/([A-Za-z0-9])(\()/g, '$1 $2')

  // Add space after closing parentheses
  restored = restored.replace(/(\))([A-Za-z])/g, '$1 $2')

  // Restore template variables
  variablePlaceholders.forEach((placeholder, index) => {
    restored = restored.replace(`__VAR_${index}__`, placeholder)
  })

  // Add space around template variables
  restored = restored.replace(/([A-Za-z])(\{\{)/g, '$1 $2')
  restored = restored.replace(/(\}\})([A-Za-z])/g, '$1 $2')

  // Clean up multiple spaces
  restored = restored.replace(/\s{2,}/g, ' ')

  // Clean up spaces inside HTML tags (but preserve attributes)
  restored = restored.replace(/(<[^>]+)\s+>/g, '$1>')

  return restored
}

/**
 * Format HTML for better display in preview
 * This ensures proper spacing between text nodes for email rendering
 */
export const formatHtmlForPreview = (html: string): string => {
  // Restore spacing that was removed during minification
  return restoreHtmlSpacing(html)
}
