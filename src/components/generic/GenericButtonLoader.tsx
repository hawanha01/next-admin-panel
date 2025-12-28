'use client'

import React from 'react'
import GenericLoader from './GenericLoader'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
}

const GenericButtonLoader: React.FC<Props> = ({ size = 'sm', color = 'white' }) => {
  const loaderSizeMap: Record<'sm' | 'md' | 'lg', 'sm' | 'md'> = {
    sm: 'sm',
    md: 'sm',
    lg: 'md',
  }

  const loaderSize = loaderSizeMap[size]

  return <GenericLoader size={loaderSize} color={color} variant="spinner" />
}

export default GenericButtonLoader
