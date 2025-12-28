'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import GenericButton from '@/components/generic/GenericButton'
import GenericText from '@/components/generic/GenericText'
import type { NavigationItem } from '@/types/navigation.types'

interface Props {
  item: NavigationItem
  collapsed: boolean
  onNavigate: () => void
}

export const SidebarTab: React.FC<Props> = ({ item, collapsed, onNavigate }) => {
  const router = useRouter()
  const hasChildren = item.children && item.children.length > 0

  // Derive expanded state from props - if item is active, it should be expanded
  const shouldBeExpandedByProps = useMemo(
    () => item.active || (item.children?.some(child => child.active) ?? false),
    [item.active, item.children]
  )

  // Use local state for user interactions (expanding/collapsing)
  const [userExpanded, setUserExpanded] = useState(false)

  // Determine final expanded state: use prop-based expansion OR user interaction
  const isExpanded = shouldBeExpandedByProps || userExpanded

  const handleClick = (): void => {
    if (hasChildren && !collapsed) {
      setUserExpanded(!userExpanded)
    } else if (item.route) {
      router.push(item.route)
      onNavigate()
    }
  }

  const handleChildClick = (childRoute: string, event: React.MouseEvent): void => {
    event.stopPropagation()
    router.push(childRoute)
    onNavigate()
  }

  const tabButtonClasses = `w-full flex items-center gap-3 !justify-start !bg-transparent !shadow-none ${
    item.active ? '!bg-blue-50' : 'hover:!bg-gray-100'
  } ${collapsed ? '!justify-center' : ''}`

  const getChildButtonClasses = (child: NavigationItem): string => {
    return `w-full flex items-center gap-3 !justify-start !bg-transparent !shadow-none ${
      child.active ? '!bg-blue-50' : 'hover:!bg-gray-50'
    }`
  }

  return (
    <li>
      {/* Main Tab */}
      <GenericButton
        variant="secondary"
        size="md"
        type="button"
        className={tabButtonClasses}
        aria-label={item.label}
        onClick={handleClick}
      >
        <span className="text-xl flex-shrink-0">{item.icon}</span>
        {!collapsed && (
          <GenericText
            variant="span"
            size="md"
            weight={item.active ? 'medium' : 'normal'}
            color={item.active ? 'text-blue-700' : 'text-gray-700'}
            className="flex-1 text-left"
          >
            {item.label}
          </GenericText>
        )}
        {hasChildren && !collapsed && (
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
              isExpanded ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </GenericButton>

      {/* Child Tabs (Sub-menu) */}
      {hasChildren && !collapsed && isExpanded && (
        <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
          {item.children?.map(child => (
            <li key={child.id}>
              <GenericButton
                variant="secondary"
                size="sm"
                type="button"
                className={getChildButtonClasses(child)}
                onClick={e => handleChildClick(child.route, e)}
              >
                <span className="text-lg flex-shrink-0">{child.icon}</span>
                <GenericText
                  variant="span"
                  size="sm"
                  weight={child.active ? 'medium' : 'normal'}
                  color={child.active ? 'text-blue-700' : 'text-gray-600'}
                  className="flex-1 text-left"
                >
                  {child.label}
                </GenericText>
              </GenericButton>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
