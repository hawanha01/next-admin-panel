'use client'

import React from 'react'
import type { TextVariant, TextSize } from '@/types/component.types'

interface Props {
  variant?: TextVariant
  size?: TextSize
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string
  className?: string
  children: React.ReactNode
}

const GenericText: React.FC<Props> = ({
  variant = 'p',
  size = 'md',
  weight = 'normal',
  color = 'text-gray-900',
  className = '',
  children,
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const textClasses = `${sizeClasses[size]} ${weightClasses[weight]} ${color} ${className}`

  const Component = variant

  return <Component className={textClasses}>{children}</Component>
}

export default GenericText
