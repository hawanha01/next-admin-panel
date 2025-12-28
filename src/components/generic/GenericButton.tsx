'use client'

import React from 'react'
import type { ButtonVariant, ButtonSize } from '@/types/component.types'
import GenericButtonLoader from './GenericButtonLoader'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  children: React.ReactNode
}

const GenericButton: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  children,
}) => {
  const baseClasses =
    'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  const loaderColorMap: Record<ButtonVariant, 'white' | 'gray'> = {
    primary: 'white',
    secondary: 'gray',
    danger: 'white',
    success: 'white',
    warning: 'white',
  }

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (!disabled && !loading && onClick) {
      onClick(event)
    }
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading && <GenericButtonLoader size={size} color={loaderColorMap[variant]} />}
      {children}
    </button>
  )
}

export default GenericButton
