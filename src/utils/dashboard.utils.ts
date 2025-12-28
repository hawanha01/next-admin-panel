/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Format date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get status color classes
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    suspended: 'text-red-600 bg-red-100',
    completed: 'text-green-600 bg-green-100',
    processing: 'text-blue-600 bg-blue-100',
  }
  return statusColors[status] || 'text-gray-600 bg-gray-100'
}
