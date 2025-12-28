'use client'

import GenericInput from '@/components/generic/GenericInput'
import GenericText from '@/components/generic/GenericText'
import type { CreateStoreOwnerRequest } from '@/types/store-owner.types'
import { formatRoleDisplay } from '@/utils/validation'

interface Props {
  form: CreateStoreOwnerRequest
  errors: Partial<Record<keyof CreateStoreOwnerRequest, string>>
  fieldErrors: Partial<Record<keyof CreateStoreOwnerRequest, string>>
  loading: boolean
  onFormChange: (form: CreateStoreOwnerRequest) => void
}

export default function InviteStoreOwnerFormFields({
  form,
  errors,
  fieldErrors,
  loading,
  onFormChange,
}: Props) {
  const handleFieldChange = (field: keyof CreateStoreOwnerRequest, value: string): void => {
    onFormChange({
      ...form,
      [field]: value,
    })
  }

  const getFieldError = (field: keyof CreateStoreOwnerRequest): string | undefined => {
    return errors[field] || fieldErrors[field]
  }

  return (
    <>
      {/* Email */}
      <div>
        <GenericInput
          type="email"
          label="Email Address"
          placeholder="store.owner@example.com"
          value={form.email}
          error={getFieldError('email')}
          disabled={loading}
          required
          autocomplete="email"
          onChange={value => handleFieldChange('email', value as string)}
        />
      </div>

      {/* Username */}
      <div>
        <GenericInput
          type="text"
          label="Username"
          placeholder="store_owner_001"
          value={form.username}
          error={getFieldError('username')}
          disabled={loading}
          required
          autocomplete="username"
          onChange={value => handleFieldChange('username', value as string)}
        />
        <GenericText variant="p" size="xs" color="text-gray-500" className="mt-1">
          3-30 characters, letters, numbers, and underscores only
        </GenericText>
      </div>

      {/* First Name */}
      <div>
        <GenericInput
          type="text"
          label="First Name"
          placeholder="John"
          value={form.firstName}
          error={getFieldError('firstName')}
          disabled={loading}
          required
          autocomplete="given-name"
          onChange={value => handleFieldChange('firstName', value as string)}
        />
      </div>

      {/* Last Name */}
      <div>
        <GenericInput
          type="text"
          label="Last Name"
          placeholder="Doe"
          value={form.lastName}
          error={getFieldError('lastName')}
          disabled={loading}
          required
          autocomplete="family-name"
          onChange={value => handleFieldChange('lastName', value as string)}
        />
      </div>

      {/* Phone */}
      <div>
        <GenericInput
          type="tel"
          label="Phone Number"
          placeholder="+1234567890"
          value={form.phone}
          error={getFieldError('phone')}
          disabled={loading}
          required
          autocomplete="tel"
          onChange={value => handleFieldChange('phone', value as string)}
        />
      </div>

      {/* Role (Read-only, pre-populated) */}
      <div>
        <GenericInput
          type="text"
          label="Role"
          placeholder="Store Owner"
          value={formatRoleDisplay(form.role)}
          disabled={true}
          readonly
        />
        <GenericText variant="p" size="xs" color="text-gray-500" className="mt-1">
          This field is automatically set and cannot be changed
        </GenericText>
      </div>
    </>
  )
}
