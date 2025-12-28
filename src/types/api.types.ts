export interface ApiResponse<T> {
  data: T
  message: string
  status: number
  errors?: string[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta
}
