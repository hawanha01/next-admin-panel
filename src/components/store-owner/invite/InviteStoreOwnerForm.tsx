'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { inviteStoreOwner } from '@/store/slices/storeOwnerSlice'
import GenericCard from '@/components/generic/GenericCard'
import GenericButton from '@/components/generic/GenericButton'
import GenericText from '@/components/generic/GenericText'
import type { CreateStoreOwnerRequest } from '@/types/store-owner.types'
import { validateEmail, validatePhone, validateUsername } from '@/utils/validation'
import InviteStoreOwnerFormFields from './InviteStoreOwnerFormFields'

export default function InviteStoreOwnerForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error, fieldErrors } = useAppSelector(state => state.storeOwner)

  const [form, setForm] = useState<CreateStoreOwnerRequest>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'store_owner',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CreateStoreOwnerRequest, string>>>({})
  const [success, setSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateStoreOwnerRequest, string>> = {}

    // Email validation
    if (!form.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Username validation
    if (!form.username) {
      newErrors.username = 'Username is required'
    } else if (!validateUsername(form.username)) {
      newErrors.username =
        'Username must be 3-30 characters and contain only letters, numbers, and underscores'
    }

    // First name validation
    if (!form.firstName) {
      newErrors.firstName = 'First name is required'
    } else if (form.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }

    // Last name validation
    if (!form.lastName) {
      newErrors.lastName = 'Last name is required'
    } else if (form.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }

    // Phone validation
    if (!form.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const result = await dispatch(inviteStoreOwner(form))

    if (inviteStoreOwner.fulfilled.match(result)) {
      // Show success message
      setSuccess(true)

      // Reset form on success (keep role)
      setForm({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'store_owner',
      })
      setErrors({})

      // Redirect to store owners list after a delay
      setTimeout(() => {
        router.push('/store-owners')
      }, 2000)
    }
  }

  const handleCancel = (): void => {
    router.push('/dashboard')
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0

  return (
    <GenericCard variant="elevated">
      <form onSubmit={handleSubmit} className="space-y-6">
        <InviteStoreOwnerFormFields
          form={form}
          errors={errors}
          fieldErrors={fieldErrors}
          loading={loading}
          onFormChange={setForm}
        />

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <GenericText variant="p" size="sm" color="text-green-600">
              Store owner invited successfully! Welcome email has been sent. Redirecting...
            </GenericText>
          </div>
        )}

        {/* General Error Message (only if no field-specific errors) */}
        {error && !hasFieldErrors && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <GenericText variant="p" size="sm" color="text-red-600">
              {error}
            </GenericText>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <GenericButton
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </GenericButton>
          <GenericButton
            type="submit"
            variant="primary"
            disabled={loading}
            loading={loading}
            className="flex-1"
          >
            {!loading ? 'Invite Store Owner' : 'Inviting...'}
          </GenericButton>
        </div>
      </form>
    </GenericCard>
  )
}
