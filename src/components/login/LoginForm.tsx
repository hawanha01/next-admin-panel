'use client'

import { useState, FormEvent } from 'react'
import GenericInput from '@/components/generic/GenericInput'
import GenericButton from '@/components/generic/GenericButton'
import GenericText from '@/components/generic/GenericText'
import GenericCard from '@/components/generic/GenericCard'
import type { LoginRequest } from '@/types/auth.types'

interface Props {
  onSubmit: (credentials: LoginRequest) => void
  loading: boolean
  error: string | null
}

interface LoginFormState {
  email: string
  password: string
}

export const LoginForm: React.FC<Props> = ({ onSubmit, loading, error }) => {
  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (!password) {
      return { valid: false, message: 'Password is required' }
    }

    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' }
    }

    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' }
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' }
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' }
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one special character',
      }
    }

    return { valid: true }
  }

  const validateForm = (): boolean => {
    setValidationError(null)

    if (!form.email) {
      setValidationError('Email is required')
      return false
    }

    if (!validateEmail(form.email)) {
      setValidationError('Please enter a valid email address')
      return false
    }

    const passwordValidation = validatePassword(form.password)
    if (!passwordValidation.valid) {
      setValidationError(passwordValidation.message || 'Invalid password')
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        email: form.email,
        password: form.password,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      const form = e.currentTarget.closest('form')
      if (form) {
        form.requestSubmit()
      }
    }
  }

  const displayError = validationError || error

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <GenericText variant="h1" size="3xl" weight="bold" className="mb-2 text-white">
            Welcome Back
          </GenericText>
          <GenericText variant="p" size="lg" color="text-gray-300">
            Sign in to continue to Admin Panel
          </GenericText>
        </div>

        <GenericCard variant="elevated" className="backdrop-blur-sm bg-white/95 shadow-2xl">
          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <GenericText variant="p" size="sm" color="text-red-600">
                {displayError}
              </GenericText>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <GenericInput
                type="email"
                label="Email Address"
                placeholder="admin@example.com"
                value={form.email}
                disabled={isSubmitting || loading}
                required
                autocomplete="email"
                onChange={value => setForm({ ...form, email: value as string })}
              />
            </div>

            <div>
              <GenericInput
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                disabled={isSubmitting || loading}
                required
                autocomplete="current-password"
                onChange={value => setForm({ ...form, password: value as string })}
              />
              <GenericText variant="p" size="xs" color="text-gray-500" className="mt-2">
                Must contain: 8+ characters, uppercase, lowercase, number, special character
              </GenericText>
            </div>

            <GenericButton
              type="submit"
              variant="primary"
              disabled={isSubmitting || loading}
              loading={isSubmitting || loading}
              className="w-full"
              size="lg"
            >
              {!isSubmitting && !loading ? 'Sign In' : 'Signing in...'}
            </GenericButton>
          </form>
        </GenericCard>

        <div className="mt-6 text-center">
          <GenericText variant="p" size="sm" color="text-gray-400">
            Secure admin access portal
          </GenericText>
        </div>
      </div>
    </div>
  )
}
