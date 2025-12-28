'use client'

import React from 'react'
import type { CardVariant } from '@/types/component.types'
import GenericText from './GenericText'

interface Props {
  title?: string
  variant?: CardVariant
  className?: string
  children: React.ReactNode
  actions?: React.ReactNode
}

const GenericCard: React.FC<Props> = ({
  title,
  variant = 'default',
  className = '',
  children,
  actions,
}) => {
  const baseClasses = 'rounded-lg p-6'

  const variantClasses = {
    default: 'bg-white shadow-md',
    outlined: 'bg-white border-2 border-gray-200',
    elevated: 'bg-white shadow-lg',
  }

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${className}`

  return (
    <div className={cardClasses}>
      {title && (
        <GenericText variant="h3" size="lg" weight="semibold" className="mb-4">
          {title}
        </GenericText>
      )}

      <div className="card-content">{children}</div>

      {actions && <div className="mt-4 flex gap-2">{actions}</div>}
    </div>
  )
}

export default GenericCard
