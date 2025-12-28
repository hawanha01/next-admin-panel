'use client'

import React, { useId } from 'react'

interface Props {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  value?: string | number
  error?: string
  disabled?: boolean
  required?: boolean
  autocomplete?: string
  id?: string
  readonly?: boolean
  onChange?: (value: string | number) => void
  onBlur?: () => void
  onFocus?: () => void
}

const GenericInput: React.FC<Props> = ({
  type = 'text',
  label,
  placeholder,
  value,
  error,
  disabled = false,
  required = false,
  autocomplete,
  id,
  readonly = false,
  onChange,
  onBlur,
  onFocus,
}) => {
  const generatedId = useId()
  const inputId = id || generatedId

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange) {
      onChange(event.target.value)
    }
  }

  const handleBlur = (): void => {
    if (onBlur) {
      onBlur()
    }
  }

  const handleFocus = (): void => {
    if (onFocus) {
      onFocus()
    }
  }

  const inputClasses = [
    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
    disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
    readonly && 'bg-gray-50 cursor-default',
  ].join(' ')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autocomplete}
        readOnly={readonly}
        className={inputClasses}
        onChange={handleInput}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default GenericInput
