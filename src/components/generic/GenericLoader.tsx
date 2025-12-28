'use client'

import React from 'react'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  variant?: 'spinner' | 'dots' | 'pulse'
}

const GenericLoader: React.FC<Props> = ({
  size = 'md',
  color = 'primary',
  variant = 'spinner',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
  }

  if (variant === 'spinner') {
    return (
      <div className={`${sizeClasses[size]} ${colorClasses[color]}`}>
        <svg
          className="animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    )
  }

  if (variant === 'dots') {
    const dotSizeClasses = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
      xl: 'w-3 h-3',
    }

    return (
      <div className={`${sizeClasses[size]} ${colorClasses[color]} flex gap-1`}>
        <div
          className={`rounded-full bg-current animate-bounce ${dotSizeClasses[size]}`}
          style={{ animationDelay: '0ms' }}
        />
        <div
          className={`rounded-full bg-current animate-bounce ${dotSizeClasses[size]}`}
          style={{ animationDelay: '150ms' }}
        />
        <div
          className={`rounded-full bg-current animate-bounce ${dotSizeClasses[size]}`}
          style={{ animationDelay: '300ms' }}
        />
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`${sizeClasses[size]} ${colorClasses[color]}`}>
        <div className={`rounded-full bg-current animate-pulse ${sizeClasses[size]}`} />
      </div>
    )
  }

  return null
}

export default GenericLoader
