/**
 * Minify HTML by removing unnecessary whitespace while preserving HTML structure
 * - Removes whitespace between tags (e.g., ">  <" becomes "><")
 * - Removes newlines and extra spaces
 * - Preserves spaces within tag attributes and between tag name and attributes
 * This matches the backend's minification logic
 */
export const minifyHtml = (html: string): string => {
  return (
    html
      // First, normalize all whitespace (tabs, newlines, etc.) to single spaces
      .replace(/[\t\n\r]+/g, ' ')
      // Remove whitespace between closing and opening tags (e.g., ">  <" becomes "><")
      .replace(/>\s+</g, '><')
      // Remove leading/trailing whitespace from the entire string
      .trim()
  )
}
