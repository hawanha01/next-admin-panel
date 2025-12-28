'use client'

import React from 'react'
import GenericText from '@/components/generic/GenericText'
import GenericButton from '@/components/generic/GenericButton'

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export const SidebarHeader: React.FC<Props> = ({ collapsed, onToggle }) => {
  const logoSize = collapsed ? 'w-10 h-10' : 'w-12 h-12'

  return (
    <div
      className={`flex items-center justify-between p-4 border-b border-gray-200 ${
        collapsed ? 'flex-col gap-2' : 'flex-row'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 transition-all duration-300 ${
          collapsed ? 'flex-col' : 'flex-row'
        }`}
      >
        <div
          className={`bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold ${logoSize}`}
        >
          <GenericText variant="span" size="lg" weight="bold">
            A
          </GenericText>
        </div>
        {!collapsed && (
          <GenericText
            variant="h2"
            size="xl"
            weight="bold"
            color="text-gray-900"
            className="whitespace-nowrap"
          >
            Admin Panel
          </GenericText>
        )}
      </div>

      {/* Toggle Button */}
      <GenericButton
        variant="secondary"
        size="sm"
        type="button"
        className={`p-2 !min-w-0 ${collapsed ? '' : '[&>svg]:rotate-180'}`}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={onToggle}
      >
        <svg
          className="w-5 h-5 text-gray-600 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </GenericButton>
    </div>
  )
}
