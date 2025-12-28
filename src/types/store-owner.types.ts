export interface CreateStoreOwnerRequest {
  email: string
  username: string
  firstName: string
  lastName: string
  phone: string
  role: 'store_owner'
}

export interface CreateStoreOwnerResponse {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  role: 'store_owner'
  isEmailVerified: boolean
  generatedPassword?: string
}
